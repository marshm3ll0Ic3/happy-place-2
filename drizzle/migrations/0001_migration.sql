create table public.founding_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text,
  role text not null default 'creator',
  audience_size text,
  created_at timestamptz not null default now()
);
grant insert on public.founding_waitlist to anon, authenticated;
grant all on public.founding_waitlist to service_role;
alter table public.founding_waitlist enable row level security;
create policy "anyone can join" on public.founding_waitlist for insert to anon, authenticated
  with check (char_length(email) between 3 and 255 and position('@' in email) > 1);

create or replace function public.founding_counts() returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'creators', count(*) filter (where role = 'creator'),
    'buyers', count(*) filter (where role <> 'creator'))
  from founding_waitlist $$;
grant execute on function public.founding_counts() to anon, authenticated;