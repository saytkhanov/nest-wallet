import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';
import { ConfigService } from './config.service.js';

@Global()
@Module({
  imports: [
    NestConfig.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
