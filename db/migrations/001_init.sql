-- Users table
create table if not exists users (
  id bigint primary key,
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  version integer not null default 0
);

-- Ledger entries (history)
create table if not exists ledger_entries (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  action text not null check (action in ('DEBIT','CREDIT')),
  amount_cents bigint not null check (amount_cents > 0),
  idempotency_key text null,
  metadata jsonb null,
  created_at timestamptz not null default now()
);

-- Fast lookups
create index if not exists idx_ledger_user_created on ledger_entries(user_id, created_at desc);

-- Idempotency: unique per (user, action, key) when key is present
create unique index if not exists uq_ledger_idem
  on ledger_entries(user_id, action, idempotency_key)
  where idempotency_key is not null;

-- Seed a user with id=1 if missing
insert into users(id, balance_cents)
select 1, 0
where not exists (select 1 from users where id=1);
