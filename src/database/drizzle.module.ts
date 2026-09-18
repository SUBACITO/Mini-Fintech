import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service.js';
import { DrizzleProvider } from './drizzle.provider.js';

@Global()
@Module({
  providers: [DrizzleProvider, DrizzleService],
  exports: [DrizzleProvider],
})
export class DrizzleModule {}