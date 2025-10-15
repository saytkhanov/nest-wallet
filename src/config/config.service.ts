import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get databaseUrl(): string {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    return url;
  }

  get port(): number {
    const port = parseInt(process.env.PORT ?? '3000', 10);
    if (!Number.isFinite(port) || port <= 0 || port > 65535) {
      throw new Error('Invalid PORT');
    }
    return port;
  }

  get cacheTtl(): number {
    const ttl = parseInt(process.env.CACHE_TTL ?? '30', 10);
    if (!Number.isFinite(ttl) || ttl < 0) {
      throw new Error('Invalid CACHE_TTL');
    }
    return ttl;
  }
}
