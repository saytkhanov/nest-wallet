import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerController } from './ledger.controller.js';
import { LedgerService } from './ledger.service.js';
import { LedgerEntry } from './ledger-entry.entity.js';
import { User } from '../users/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerEntry, User])],
  controllers: [LedgerController],
  providers: [LedgerService],
})
export class LedgerModule {}
