import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { DrizzleModule } from './database/drizzle.module.js';
import { auth } from "./auth.js";
import { AccountModule } from './account/account.module.js';
import { TransfersModule } from './transfers/transfers.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notification/notification.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    AuthModule.forRoot({ auth }),
    AccountModule,
    TransfersModule,
    NotificationsModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
