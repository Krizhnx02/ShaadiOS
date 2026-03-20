-- ShaadiOS: Auth Migration
-- Run this in your Supabase SQL Editor AFTER the initial migration

-- 1. Add user_id to wedding_profiles
alter table wedding_profiles add column user_id uuid references auth.users(id) on delete cascade;

-- 2. Backfill existing rows if any (optional — set to your own user id after signing up)
-- update wedding_profiles set user_id = 'YOUR_USER_UUID' where user_id is null;

-- 3. Make user_id required for new rows
-- (Run this AFTER backfilling, or skip if table is empty)
alter table wedding_profiles alter column user_id set not null;

-- 4. Drop old permissive policies
drop policy if exists "Allow all on wedding_profiles" on wedding_profiles;
drop policy if exists "Allow all on tasks" on tasks;
drop policy if exists "Allow all on budget_items" on budget_items;
drop policy if exists "Allow all on vendors" on vendors;
drop policy if exists "Allow all on guests" on guests;

-- 5. New RLS policies scoped to authenticated user

-- wedding_profiles: user can only see/modify their own
create policy "Users can view own profiles"
  on wedding_profiles for select
  using (user_id = auth.uid());

create policy "Users can insert own profiles"
  on wedding_profiles for insert
  with check (user_id = auth.uid());

create policy "Users can update own profiles"
  on wedding_profiles for update
  using (user_id = auth.uid());

create policy "Users can delete own profiles"
  on wedding_profiles for delete
  using (user_id = auth.uid());

-- tasks: user can access tasks belonging to their profiles
create policy "Users can view own tasks"
  on tasks for select
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can insert own tasks"
  on tasks for insert
  with check (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can update own tasks"
  on tasks for update
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can delete own tasks"
  on tasks for delete
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

-- budget_items
create policy "Users can view own budget_items"
  on budget_items for select
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can insert own budget_items"
  on budget_items for insert
  with check (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can update own budget_items"
  on budget_items for update
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can delete own budget_items"
  on budget_items for delete
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

-- vendors
create policy "Users can view own vendors"
  on vendors for select
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can insert own vendors"
  on vendors for insert
  with check (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can update own vendors"
  on vendors for update
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can delete own vendors"
  on vendors for delete
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

-- guests
create policy "Users can view own guests"
  on guests for select
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can insert own guests"
  on guests for insert
  with check (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can update own guests"
  on guests for update
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));

create policy "Users can delete own guests"
  on guests for delete
  using (profile_id in (select id from wedding_profiles where user_id = auth.uid()));
