import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { User } from '@/users/user.entity';
import { LedgerEntry } from '@/ledger/ledger-entry.entity';

export const makeTypeOrmOptions = (databaseUrl: string): DataSourceOptions => ({
  type: 'postgres',
  url: databaseUrl,
  synchronize: false,
  entities: [User, LedgerEntry],
  logging: false,
});

export const makeDataSource = (databaseUrl: string) =>
  new DataSource(makeTypeOrmOptions(databaseUrl));
