import { Column, Entity, PrimaryColumn, VersionColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('bigint')
  id!: number;

  @Column('bigint', { name: 'balance_cents', default: 0 })
  balanceCents!: number;

  @VersionColumn({ default: 0 })
  version!: number;
}
