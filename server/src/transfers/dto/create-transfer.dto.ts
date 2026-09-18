// create-transfer.dto.ts
import { IsUUID, IsPositive } from 'class-validator';

export class CreateTransferDto {

  @IsUUID()
  senderId: string;

  @IsUUID()
  senderWalletId: string;

  @IsUUID()
  receiverWalletId: string;

  @IsPositive()
  amount: number;
}