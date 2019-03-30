import { IMain, IDatabase } from 'pg-promise';
import * as pgPromise from 'pg-promise';
import { ENV } from './env';

const pgp: IMain = pgPromise({
  // Initialization Options
});

export const db: IDatabase<any> = pgp(ENV.DATABASE_URL);
