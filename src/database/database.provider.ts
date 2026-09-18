import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const createDb = (connectionString: string) => {
  const queryClient = postgres(connectionString, {
    max: 10,
  });

  return drizzle({ client: queryClient});
};

export type Db = ReturnType<typeof createDb>;