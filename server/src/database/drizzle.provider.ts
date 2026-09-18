import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDb } from './database.provider.js';


export const DrizzleProvider: Provider = {
  provide: 'DRIZZLE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    
    return createDb(connectionString);
  },
};