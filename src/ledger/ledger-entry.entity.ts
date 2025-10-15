import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '@/users/user.entity';

export type Action = 'DEBIT' | 'CREDIT';

@Entity({ name: 'ledger_entries' })
@Index('idx_ledger_user_created', ['userId', 'createdAt'])
@Index('uq_ledger_idem', ['userId', 'action', 'idempotencyKey'], {
  unique: true,
  where: 'idempotency_key is not null',
})
export class LedgerEntry {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('bigint', { name: 'user_id' })
  userId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @Column('text')
  action!: Action;

  @Column('bigint', { name: 'amount_cents' })
  amountCents!: number; // > 0

  @Column('text', { name: 'idempotency_key', nullable: true })
  idempotencyKey?: string | null;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
