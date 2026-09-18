import { Body, Controller, Post, Session, UseGuards} from '@nestjs/common';
import { TransfersService } from './transfers.service.js';
import { CreateTransferDto } from './dto/create-transfer.dto.js';
import { type UserSession } from '@thallesp/nestjs-better-auth';
import { ActivatedUserGuard } from '../common/guards/activate.guard.js';

@UseGuards(ActivatedUserGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post('/new')
  async transfer(@Body() dto : CreateTransferDto, @Session() session: UserSession){
    const userId = session['session'].userId
    dto.senderId = userId
    return this.transfersService.transfer(dto)
  }
}
