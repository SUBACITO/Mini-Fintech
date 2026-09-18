import { Inject, Injectable } from '@nestjs/common';
import type { Db } from '../database/database.provider.js';
import { users } from '../database/schema/users.js';
import { eq , and, lt } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

@Injectable()
export class AccountService {
  constructor(
    @Inject('DRIZZLE')
    private readonly drizzle: Db) {
  }

  async getData(userId: string){
    // const [user] = await this.drizzle
    //   .select()
    //   .from(users)
    //   .where(
    //     and(
    //       eq(users.id, userId),
    //       lt(users.activatedAt, sql`now()`)
    //     )
    //   )

    // return user
  }

  async getInfoUser(userId: string){
    const [user] = await this.drizzle
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, userId)
        )
      )

    return user
  }
}
