import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { type Db } from '../database/database.provider.js';
import { CreateTransferDto } from './dto/create-transfer.dto.js';
import { wallets } from '../database/schema/wallets.js';
import { eq, inArray, sql, sum } from 'drizzle-orm';
import { transfers } from '../database/schema/transfers.js';
import { ledger_transactions } from '../database/schema/ledger_transactions.js';
import { ledger_entries } from '../database/schema/ledger_entries.js';
import { LedgerEntriesType } from '../common/enums/ledger_entries-type.enum.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransferCompletedEvent } from '../common/events/transfer-completed.event.js';

@Injectable()
export class TransfersService {
  constructor(
    @Inject('DRIZZLE') readonly drizzle: Db,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async transfer(dto: CreateTransferDto) {
    // console.log(dto.idempotencyKey)
    // const existIdempotencyKey = await this.drizzle.select()
    


    const amount = BigInt(dto.amount)

    const result = await this.drizzle.transaction(async (tx) => {

      // Lock cả 2 ví cùng lúc theo UUID order → tránh deadlock
      const [firstId, secondId] = [dto.senderWalletId, dto.receiverWalletId].sort()

      const lockedWallets = await tx
        .select({ id: wallets.id, balance: wallets.balance, userId: wallets.userId })
        .from(wallets)
        .where(inArray(wallets.id, [firstId, secondId]))
        .for('update')

      const senderWallet = lockedWallets.find(
        w => w.id === dto.senderWalletId && w.userId === dto.senderId
      )
      const receiverWallet = lockedWallets.find(
        w => w.id === dto.receiverWalletId
      )

      if (!senderWallet) throw new NotFoundException('Sender wallet not found')
      if (!receiverWallet) throw new NotFoundException('Receiver wallet not found')

      if (senderWallet.balance < amount) {
        throw new BadRequestException('Insufficient balance')
      }

      const [newTransfer] = await tx.insert(transfers)
        .values({
          sender_wallet_id: senderWallet.id,
          receiver_wallet_id: receiverWallet.id,
          amount
        })
        .returning()

      if (!newTransfer) {
        throw new InternalServerErrorException('Failed to create transfer')
      }

      const [newLedgerTransaction] = await tx.insert(ledger_transactions)
        .values({
          transfer_id: newTransfer.id,
          description: 'YEAH'
        })
        .returning()

      if (!newLedgerTransaction) {
        throw new InternalServerErrorException('Failed to create ledger transaction')
      }

      await tx.insert(ledger_entries)
        .values([
          {
            transactionId: newLedgerTransaction.id,
            walletId: senderWallet.id,
            amount: -amount,
            type: LedgerEntriesType.DEBIT
          },
          {
            transactionId: newLedgerTransaction.id,
            walletId: receiverWallet.id,
            amount,
            type: LedgerEntriesType.CREDIT
          }
        ])

      // Verify SUM = 0
      const [{ total }] = await tx
        .select({ total: sum(ledger_entries.amount) })
        .from(ledger_entries)
        .where(eq(ledger_entries.transactionId, newLedgerTransaction.id))

      if (BigInt(total ?? 0) !== 0n) {
        throw new InternalServerErrorException('Ledger entries are not balanced')
      }

      await tx.update(wallets)
        .set({ balance: sql`${wallets.balance} - ${amount}` })
        .where(eq(wallets.id, senderWallet.id))

      await tx.update(wallets)
        .set({ balance: sql`${wallets.balance} + ${amount}` })
        .where(eq(wallets.id, receiverWallet.id))

      return {
        transferId: newTransfer.id,
        ledgerTransactionId: newLedgerTransaction.id,
        amount: amount.toString()
      }
    })

     // Emit sau khi transaction commit thành công
    this.eventEmitter.emit('transfer.completed', {
      transferId: result.transferId,
      senderId: dto.senderId,
      receiverWalletId: dto.receiverWalletId,
      amount: result.amount
    } satisfies TransferCompletedEvent)

    return result
  }
}