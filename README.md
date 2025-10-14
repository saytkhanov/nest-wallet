# NestJS Wallet

Production-ready wallet service with transaction ledger and balance management.

## Tech Stack

- NestJS 10 + TypeScript
- PostgreSQL + TypeORM
- cache-manager for caching
- Helmet for security headers

## Quick Start

```bash
docker-compose up -d

echo 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wallet' > .env

npm install

npm run db:migrate

npm run start:dev
```

## Development

```bash
npm run start:dev   # Development mode with watch
npm run build       # Production build
npm run lint        # ESLint
npm run format      # Prettier
```
