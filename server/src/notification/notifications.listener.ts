
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransferCompletedEvent } from '../common/events/transfer-completed.event.js';

@Injectable()
export class NotificationsListener {
  private readonly logger = new Logger(NotificationsListener.name);

  @OnEvent('transfer.completed')
  handleTransferCompleted(payload: TransferCompletedEvent) {
    this.logger.log(`Transfer completed: ${JSON.stringify(payload)}`);
  }
}