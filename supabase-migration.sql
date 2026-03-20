-- ShaadiOS: Supabase Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Wedding Profile (single row per wedding)
create table wedding_profiles (
  id uuid primary key default gen_random_uuid(),
  bride_name text not null,
  groom_name text not null,
  wedding_date timestamptz not null,
  venue text,
  city text,
  total_budget numeric not null default 0,
  currency text not null default 'INR',
  perspective text not null default 'all' check (perspective in ('all', 'bride', 'groom')),
  selected_events text[] not null default '{}',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references wedding_profiles(id) on delete cascade,
  title text not null,
  description text,
  side text not null check (side in ('bride', 'groom', 'shared')),
  event text not null,
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done', 'cancelled')),
  assignee text,
  assignee_phone text,
  due_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Budget Items
create table budget_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references wedding_profiles(id) on delete cascade,
  title text not null,
  category text not null,
  side text not null check (side in ('bride', 'groom', 'shared')),
  event text not null,
  estimated_cost numeric not null default 0,
  actual_cost numeric,
  is_paid boolean not null default false,
  vendor_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Vendors
create table vendors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references wedding_profiles(id) on delete cascade,
  name text not null,
  category text not null,
  side text not null check (side in ('bride', 'groom', 'shared')),
  phone text,
  email text,
  instagram text,
  quoted_price numeric,
  final_price numeric,
  is_booked boolean not null default false,
  rating integer check (rating >= 1 and rating <= 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Guests
create table guests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references wedding_profiles(id) on delete cascade,
  name text not null,
  side text not null check (side in ('bride', 'groom', 'shared')),
  phone text,
  email text,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'confirmed', 'declined', 'maybe')),
  plus_ones integer not null default 0,
  events text[] not null default '{}',
  table_number text,
  dietary_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for common queries
create index idx_tasks_profile on tasks(profile_id);
create index idx_budget_items_profile on budget_items(profile_id);
create index idx_vendors_profile on vendors(profile_id);
create index idx_guests_profile on guests(profile_id);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_wedding_profiles_updated before update on wedding_profiles for each row execute function update_updated_at();
create trigger trg_tasks_updated before update on tasks for each row execute function update_updated_at();
create trigger trg_budget_items_updated before update on budget_items for each row execute function update_updated_at();
create trigger trg_vendors_updated before update on vendors for each row execute function update_updated_at();
create trigger trg_guests_updated before update on guests for each row execute function update_updated_at();

-- Enable Row Level Security (disabled for now — enable when you add auth)
alter table wedding_profiles enable row level security;
alter table tasks enable row level security;
alter table budget_items enable row level security;
alter table vendors enable row level security;
alter table guests enable row level security;

-- Permissive policies (allow all for anon — tighten when you add auth)
create policy "Allow all on wedding_profiles" on wedding_profiles for all using (true) with check (true);
create policy "Allow all on tasks" on tasks for all using (true) with check (true);
create policy "Allow all on budget_items" on budget_items for all using (true) with check (true);
create policy "Allow all on vendors" on vendors for all using (true) with check (true);
create policy "Allow all on guests" on guests for all using (true) with check (true);
