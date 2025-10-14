import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../users/user.entity.js';
import { LedgerEntry } from '../../ledger/ledger-entry.entity.js';

export const makeTypeOrmOptions = (databaseUrl: string): DataSourceOptions => ({
  type: 'postgres',
  url: databaseUrl,
  synchronize: false,
  entities: [User, LedgerEntry],
  logging: false,
});

export const makeDataSource = (databaseUrl: string) =>
  new DataSource(makeTypeOrmOptions(databaseUrl));
