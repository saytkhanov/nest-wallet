# NestJS Wallet

Production-ready wallet service with transaction ledger and balance management.

## Features

- **ACID Transactions** — PostgreSQL with proper isolation
- **Concurrency Control** — Advisory locks per user (no double-spend)
- **Idempotency** — Unique constraint on idempotency keys
- **Balance Recomputation** — Recalculated from ledger history after each operation
- **Caching** — Redis-compatible cache layer (invalidated on writes)
- **Validation** — Request DTOs with class-validator
- **API Documentation** — OpenAPI/Swagger at `/docs`

## Tech Stack

- NestJS 10 + TypeScript
- PostgreSQL + TypeORM
- cache-manager for caching
- Helmet for security headers

## Quick Start

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Configure environment
echo 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wallet' > .env

# 3. Install dependencies
npm install

# 4. Run migrations
npm run db:migrate

# 5. Start server
npm run start:dev
```

Access Swagger UI: http://localhost:3000/docs

## API Examples

### Get Balance
```bash
curl http://localhost:3000/users/1/balance
```

### Debit Amount
```bash
curl -X POST http://localhost:3000/users/1/debit \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: order-123' \
  -d '{"amount": 100}'
```

## Architecture

### Database Schema

**users**
- `id` — User ID (primary key)
- `balance_cents` — Current balance in cents
- `version` — Optimistic locking version

**ledger_entries**
- `user_id` — Foreign key to users
- `action` — `DEBIT` or `CREDIT`
- `amount_cents` — Transaction amount in cents
- `idempotency_key` — Optional deduplication key
- `created_at` — Transaction timestamp

### Business Logic

1. **Advisory Lock** — `pg_advisory_xact_lock(user_id)` prevents concurrent modifications
2. **Idempotency Check** — Query existing entry by `(user_id, action, idempotency_key)`
3. **Balance Validation** — Reject if `balance_cents < amount_cents`
4. **Insert Entry** — Add new ledger record
5. **Recompute Balance** — `SUM(CREDIT) - SUM(DEBIT)` from history
6. **Update User** — Store new balance in `users.balance_cents`
7. **Invalidate Cache** — Clear cached balance

### Project Structure

```
.
├── db/migrations/          # SQL migrations
├── src/
│   ├── main.ts            # Application entrypoint
│   ├── app.module.ts      # Root module
│   ├── config/            # Environment configuration
│   ├── common/            # Shared utilities (validation, filters, money)
│   ├── infrastructure/    # Database configuration
│   ├── users/             # User entity and endpoints
│   └── ledger/            # Transaction ledger and debit logic
├── docker-compose.yml     # PostgreSQL container
└── package.json
```

## Development

```bash
npm run start:dev   # Development mode with watch
npm run build       # Production build
npm run lint        # ESLint
npm run format      # Prettier
```

## Notes

- All amounts are stored as **integer cents** to avoid floating-point issues
- Balance is **always recomputed** from ledger history on write operations
- Idempotency keys prevent duplicate transactions from retries
- Pessimistic locking (`FOR UPDATE`) used for user row during transactions
