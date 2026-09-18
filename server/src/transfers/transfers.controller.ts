import { Body, Controller, Post, Req, Session, UseGuards} from '@nestjs/common';
import { TransfersService } from './transfers.service.js';
import { CreateTransferDto } from './dto/create-transfer.dto.js';
import { type UserSession } from '@thallesp/nestjs-better-auth';
import { ActivatedUserGuard } from '../common/guards/activate.guard.js';
import { IdempotencyGuard } from '../common/guards/idempotency.guard.js';
import { IdempotencyKey } from '../common/decorators/idempotency-key.decorator.js';

@UseGuards(ActivatedUserGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post('/new')
  @UseGuards(IdempotencyGuard)
  async transfer(@Body() dto : CreateTransferDto, @Session() session: UserSession, @IdempotencyKey() idempotencyKey: string){
    const userId = session['session'].userId
    dto.senderId = userId
    dto.idempotencyKey = idempotencyKey
    return this.transfersService.transfer(dto)
  }
}
