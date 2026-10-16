create type public.ledger_direction as enum ('debit','credit');
create type public.credit_bucket as enum ('promotional','restricted','convertible');
create type public.txn_type as enum ('signup_bonus','purchase','refund','trade_debit','trade_credit','market_settlement','campaign_payment','management_payment','platform_fee','admin_adjustment');

create table public.feature_flags (key text primary key, enabled boolean not null default false, updated_at timestamptz not null default now());
grant select on public.feature_flags to anon, authenticated; grant all on public.feature_flags to service_role;
alter table public.feature_flags enable row level security;
create policy "flags readable" on public.feature_flags for select using (true);
insert into public.feature_flags (key, enabled) values
 ('credit_purchase_enabled',true),('creator_payouts_enabled',true),('real_money_trading_enabled',false),
 ('credit_withdrawal_enabled',false),('kyc_required_for_conversion',true),('jurisdiction_gating_enabled',true),('regulated_operator_connected',false);

create table public.credit_packs (id text primary key, name text not null, price_cents integer not null, dsc_amount integer not null, active boolean not null default true, sort integer not null default 0);
grant select on public.credit_packs to anon, authenticated; grant all on public.credit_packs to service_role;
alter table public.credit_packs enable row level security;
create policy "packs readable" on public.credit_packs for select using (active);
insert into public.credit_packs values ('starter','Starter',1000,1000,true,1),('builder','Builder',5000,5500,true,2),('pro','Pro',10000,12000,true,3);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  type public.txn_type not null,
  description text,
  created_at timestamptz not null default now()
);
create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete restrict,
  user_id uuid,            -- null = system account
  system_account text,     -- e.g. dsc_issuance, promo_pool
  bucket public.credit_bucket not null,
  direction public.ledger_direction not null,
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now()
);
create index on public.ledger_entries(user_id);
grant select on public.transactions, public.ledger_entries to authenticated;
grant all on public.transactions, public.ledger_entries to service_role;
alter table public.transactions enable row level security;
alter table public.ledger_entries enable row level security;
create policy "own entries" on public.ledger_entries for select to authenticated using (user_id = auth.uid());
create policy "own txns" on public.transactions for select to authenticated using (exists (select 1 from public.ledger_entries e where e.transaction_id = id and e.user_id = auth.uid()));

-- double-entry posting helper (server only)
create or replace function public.post_transfer(_key text, _type public.txn_type, _desc text, _from_user uuid, _from_system text, _to_user uuid, _to_system text, _bucket public.credit_bucket, _amount integer)
returns uuid language plpgsql security definer set search_path = public as $$
declare _id uuid;
begin
  select id into _id from transactions where idempotency_key = _key;
  if _id is not null then return _id; end if;
  insert into transactions(idempotency_key, type, description) values (_key, _type, _desc) returning id into _id;
  insert into ledger_entries(transaction_id,user_id,system_account,bucket,direction,amount) values
    (_id,_from_user,_from_system,_bucket,'debit',_amount),
    (_id,_to_user,_to_system,_bucket,'credit',_amount);
  return _id;
end $$;
revoke all on function public.post_transfer from public, anon, authenticated;
grant execute on function public.post_transfer to service_role;

create or replace view public.my_balances with (security_invoker = true) as
select bucket, coalesce(sum(case when direction='credit' then amount else -amount end),0)::integer as balance
from public.ledger_entries where user_id = auth.uid() group by bucket;
grant select on public.my_balances to authenticated;

create or replace function public.handle_signup_bonus() returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform post_transfer('signup:'||new.id, 'signup_bonus', 'Welcome bonus', null, 'promo_pool', new.id, null, 'promotional', 1000);
  return new;
end $$;
create trigger on_auth_user_bonus after insert on auth.users for each row execute function public.handle_signup_bonus();

create table public.conversion_waitlist (user_id uuid primary key, created_at timestamptz not null default now());
grant select, insert on public.conversion_waitlist to authenticated; grant all on public.conversion_waitlist to service_role;
alter table public.conversion_waitlist enable row level security;
create policy "own waitlist read" on public.conversion_waitlist for select to authenticated using (user_id = auth.uid());
create policy "own waitlist insert" on public.conversion_waitlist for insert to authenticated with check (user_id = auth.uid());

create table public.stripe_events (id text primary key, type text not null, created_at timestamptz not null default now());
grant all on public.stripe_events to service_role;
alter table public.stripe_events enable row level security;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, pack_id text references public.credit_packs(id),
  stripe_session_id text unique, stripe_payment_intent text,
  amount_cents integer not null, dsc_amount integer not null,
  status text not null default 'paid', created_at timestamptz not null default now()
);
grant select on public.payments to authenticated; grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "own payments" on public.payments for select to authenticated using (user_id = auth.uid());