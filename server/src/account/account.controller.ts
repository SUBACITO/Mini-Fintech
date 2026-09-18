import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service.js';
import { ActivatedUserGuard } from '../common/guards/activate.guard.js';
import { AllowAnonymous, Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  
  @Get()
  @UseGuards(ActivatedUserGuard)
  @AllowAnonymous()
  findAll(@Session() session: UserSession) {
    const userId = session['session'].userId
    return this.accountService.getData(userId);
  }

}
