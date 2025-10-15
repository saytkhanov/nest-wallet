import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@/config/config.module';
import { ConfigService } from '@/config/config.service';
import { makeTypeOrmOptions } from '@/infrastructure/db/typeorm.config';
import { UsersModule } from '@/users/users.module';
import { LedgerModule } from '@/ledger/ledger.module';

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
