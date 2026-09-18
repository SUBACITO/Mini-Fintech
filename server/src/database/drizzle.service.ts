import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { Db } from './database.provider.js';

@Injectable()
export class DrizzleService implements OnModuleInit {
    private readonly logger = new Logger(DrizzleService.name);

    constructor(@Inject('DRIZZLE') private readonly db: Db) { }

    async onModuleInit() {
        try {
            await this.db.execute(sql`SELECT 1`);
            this.logger.log('✅ DrizzleService initialized successfully');
        } catch (err) {
            this.logger.error('🐞 Error initializing DrizzleService', err);
            throw err;
        }
    }

}