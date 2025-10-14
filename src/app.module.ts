import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module.js';
import { ConfigService } from './config/config.service.js';
import { makeTypeOrmOptions } from './infrastructure/db/typeorm.config.js';
import { UsersModule } from './users/users.module.js';
import { LedgerModule } from './ledger/ledger.module.js';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => makeTypeOrmOptions(cfg.databaseUrl),
    }),
    UsersModule,
    LedgerModule,
  ],
})
export class AppModule {}
