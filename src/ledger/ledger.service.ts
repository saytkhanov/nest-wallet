import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { LedgerEntry } from './ledger-entry.entity';
import { User } from '@/users/user.entity';
import { toCents } from '@/common/money';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry) private readonly ledgerRepo: Repository<LedgerEntry>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectDataSource() private readonly ds: DataSource,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async getBalance(userId: number): Promise<number> {
    const cacheKey = `user:${userId}:balance_cents`;
    const cached = await this.cache.get<number>(cacheKey);
    if (typeof cached === 'number') return cached;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.cache.set(cacheKey, user.balanceCents);
    return user.balanceCents;
  }

  async debit(userId: number, amountDollars: number, idempotencyKey?: string) {
    if (!Number.isFinite(amountDollars) || amountDollars <= 0) {
      throw new BadRequestException('Amount must be > 0');
    }
    const amountCents = toCents(amountDollars);

    return this.ds.transaction('READ COMMITTED', async (mgr) => {
      await mgr.query('select pg_advisory_xact_lock($1)', [userId]);

      const user = await mgr.getRepository(User).findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) throw new NotFoundException('User not found');

      if (idempotencyKey) {
        const existing = await mgr.getRepository(LedgerEntry).findOne({
          where: { userId, action: 'DEBIT', idempotencyKey },
        });
        if (existing) {
          return { userId, balanceCents: user.balanceCents, idempotent: true };
        }
      }

      if (user.balanceCents < amountCents) {
        throw new ConflictException('Insufficient funds');
      }

      const entry = mgr.getRepository(LedgerEntry).create({
        userId,
        action: 'DEBIT',
        amountCents,
        idempotencyKey: idempotencyKey ?? null,
      });
      try {
        await mgr.getRepository(LedgerEntry).save(entry);
      } catch (e) {
        const error = e as Error;
        if (String(error?.message || '').includes('uq_ledger_idem')) {
          return { userId, balanceCents: user.balanceCents, idempotent: true };
        }
        throw e;
      }

      const result = await mgr
        .getRepository(LedgerEntry)
        .createQueryBuilder('e')
        .select(
          "COALESCE(SUM(CASE WHEN e.action = 'CREDIT' THEN e.amount_cents ELSE -e.amount_cents END), 0)",
          'balance',
        )
        .where('e.user_id = :userId', { userId })
        .getRawOne<{ balance: string }>();

      const newBalance = parseInt(result?.balance ?? '0', 10);
      if (!Number.isSafeInteger(newBalance)) {
        throw new ConflictException('Balance calculation overflow');
      }
      if (newBalance < 0) {
        throw new ConflictException('Balance would become negative');
      }

      user.balanceCents = newBalance;
      await mgr.getRepository(User).save(user);

      await this.cache.del(`user:${userId}:balance_cents`);

      return { userId, balanceCents: newBalance };
    });
  }
}
