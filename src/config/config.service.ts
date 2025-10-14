import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get databaseUrl(): string {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    return url;
  }
  get port(): number {
    return Number(process.env.PORT ?? 3000);
  }
  get cacheTtl(): number {
    return Number(process.env.CACHE_TTL ?? 30);
  }
}
