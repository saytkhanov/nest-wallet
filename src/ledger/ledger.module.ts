import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';
import { LedgerEntry } from './ledger-entry.entity';
import { User } from '@/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerEntry, User])],
  controllers: [LedgerController],
  providers: [LedgerService],
})
export class LedgerModule {}
