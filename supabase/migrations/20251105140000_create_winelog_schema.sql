-- migration: create_winelog_schema
-- purpose: sets up custom enum types, tables, constraints, indexes and row-level security policies for the WineLog application
-- affected objects: custom types batch_status_enum, batch_type_enum, stage_name_enum;
--                  tables templates, template_stages, batches, batch_stages, notes, ratings;
--                  associated RLS policies and indexes.
-- notes: all ddl statements are idempotent by using IF NOT EXISTS where possible. destructive operations are avoided.

-- ensure crypto extension for gen_random_uuid() exists
create extension if not exists pgcrypto;

/* -----------------------------------------------------------------------
 * 1. custom enum types
 * --------------------------------------------------------------------- */
-- wrap type creation in plpgsql blocks to ignore duplicate_object errors, since
-- some postgres versions used by supabase may not support "create type if not exists"
-- syntax. this keeps the migration idempotent without relying on that clause.

do $$
begin
  create type batch_status_enum as enum ('active', 'archived');
exception when duplicate_object then null;
end$$;

do $$
begin
  create type batch_type_enum as enum ('red_wine', 'white_wine', 'rose_wine', 'fruit_wine', 'mead');
exception when duplicate_object then null;
end$$;

do $$
begin
  create type stage_name_enum as enum (
    'preparation',
    'press_or_maceration',
    'separation',
    'primary_fermentation',
    'secondary_fermentation',
    'clarification',
    'racking',
    'maturation',
    'bottling'
  );
exception when duplicate_object then null;
end$$;

/* -----------------------------------------------------------------------
 * 2. tables
 * --------------------------------------------------------------------- */

-- 2.1 templates ---------------------------------------------------------
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type batch_type_enum not null,
  version smallint not null default 1,
  created_at timestamptz not null default now()
);

-- 2.2 template_stages ---------------------------------------------------
create table if not exists public.template_stages (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  position smallint not null,
  name stage_name_enum not null,
  description text not null,
  instructions text not null,
  materials text[] null,
  days_min smallint null,
  days_max smallint null,
  created_at timestamptz not null default now(),
  constraint template_stages_unique_pos unique (template_id, position)
);

-- 2.3 batches -----------------------------------------------------------
create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.templates(id),
  name varchar(100) not null check (char_length(name) <= 100),
  type batch_type_enum not null,
  status batch_status_enum not null default 'active',
  started_at date not null default current_date,
  completed_at date, -- nullable: filled when batch done
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.4 batch_stages ------------------------------------------------------
create table if not exists public.batch_stages (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  template_stage_id uuid not null references public.template_stages(id),
  started_at date,
  completed_at date,
  created_at timestamptz not null default now(),
  constraint batch_stages_unique unique (batch_id, template_stage_id)
);

-- 2.5 notes -------------------------------------------------------------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  stage_id uuid references public.batch_stages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  action varchar(200) not null check (char_length(action) <= 200),
  observations varchar(200) check (char_length(observations) <= 200),
  created_at timestamptz not null default now()
);

-- 2.6 ratings -----------------------------------------------------------
create table if not exists public.ratings (
  batch_id uuid references public.batches(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (batch_id, user_id)
);

/* -----------------------------------------------------------------------
 * 3. indexes
 * --------------------------------------------------------------------- */

create index if not exists idx_batches_user_status on public.batches (user_id, status);
create index if not exists idx_batch_stages_batch_template on public.batch_stages (batch_id, template_stage_id);
create index if not exists idx_notes_batch_created_at on public.notes (batch_id, created_at desc);
create index if not exists idx_template_stages_template_pos on public.template_stages (template_id, position);
create index if not exists idx_ratings_batch on public.ratings (batch_id);

/* -----------------------------------------------------------------------
 * 4. row level security & policies
 * --------------------------------------------------------------------- */

-- enable rls for every table -------------------------------------------------
alter table public.templates          enable row level security;
alter table public.template_stages    enable row level security;
alter table public.batches            enable row level security;
alter table public.batch_stages       enable row level security;
alter table public.notes              enable row level security;
alter table public.ratings            enable row level security;

-- 4.1 templates -----------------------------------------------------------
-- allow only authenticated users to select. no insert/update/delete via api.

-- authenticated role policies
create policy templates_select_authenticated on public.templates
  for select to authenticated using (true);

-- anon role policies (deny explicit)
create policy templates_select_anon on public.templates
  for select to anon using (false);

-- 4.2 template_stages ----------------------------------------------------
create policy template_stages_select_authenticated on public.template_stages
  for select to authenticated using (true);

create policy template_stages_select_anon on public.template_stages
  for select to anon using (false);

-- 4.3 batches ------------------------------------------------------------
-- ownership enforced via user_id column
create policy batches_select_authenticated on public.batches
  for select to authenticated using (user_id = auth.uid());
create policy batches_insert_authenticated on public.batches
  for insert to authenticated with check (user_id = auth.uid());
create policy batches_update_authenticated on public.batches
  for update to authenticated using (user_id = auth.uid());
create policy batches_delete_authenticated on public.batches
  for delete to authenticated using (user_id = auth.uid());

-- anon role denied all implicitly, but create explicit false policies for clarity
create policy batches_select_anon on public.batches
  for select to anon using (false);
create policy batches_insert_anon on public.batches
  for insert to anon with check (false);
create policy batches_update_anon on public.batches
  for update to anon using (false);
create policy batches_delete_anon on public.batches
  for delete to anon using (false);

-- 4.4 batch_stages -------------------------------------------------------
-- access allowed when user owns parent batch
create policy batch_stages_select_authenticated on public.batch_stages
  for select to authenticated using (
    exists (select 1 from public.batches b where b.id = batch_stages.batch_id and b.user_id = auth.uid())
  );
create policy batch_stages_insert_authenticated on public.batch_stages
  for insert to authenticated with check (
    exists (select 1 from public.batches b where b.id = batch_stages.batch_id and b.user_id = auth.uid())
  );
create policy batch_stages_update_authenticated on public.batch_stages
  for update to authenticated using (
    exists (select 1 from public.batches b where b.id = batch_stages.batch_id and b.user_id = auth.uid())
  );
create policy batch_stages_delete_authenticated on public.batch_stages
  for delete to authenticated using (
    exists (select 1 from public.batches b where b.id = batch_stages.batch_id and b.user_id = auth.uid())
  );

-- anon denied
create policy batch_stages_select_anon on public.batch_stages for select to anon using (false);
create policy batch_stages_insert_anon on public.batch_stages for insert to anon with check (false);
create policy batch_stages_update_anon on public.batch_stages for update to anon using (false);
create policy batch_stages_delete_anon on public.batch_stages for delete to anon using (false);

-- 4.5 notes --------------------------------------------------------------
create policy notes_select_authenticated on public.notes
  for select to authenticated using (user_id = auth.uid());
create policy notes_insert_authenticated on public.notes
  for insert to authenticated with check (user_id = auth.uid());
create policy notes_update_authenticated on public.notes
  for update to authenticated using (user_id = auth.uid());
create policy notes_delete_authenticated on public.notes
  for delete to authenticated using (user_id = auth.uid());

-- anon denied
create policy notes_select_anon on public.notes for select to anon using (false);
create policy notes_insert_anon on public.notes for insert to anon with check (false);
create policy notes_update_anon on public.notes for update to anon using (false);
create policy notes_delete_anon on public.notes for delete to anon using (false);

-- 4.6 ratings ------------------------------------------------------------
-- allow only owner (batch creator) to manage rating.
create policy ratings_select_authenticated on public.ratings
  for select to authenticated using (
    exists (select 1 from public.batches b where b.id = ratings.batch_id and b.user_id = auth.uid())
  );
create policy ratings_insert_authenticated on public.ratings
  for insert to authenticated with check (
    exists (select 1 from public.batches b where b.id = ratings.batch_id and b.user_id = auth.uid())
  );
create policy ratings_update_authenticated on public.ratings
  for update to authenticated using (
    exists (select 1 from public.batches b where b.id = ratings.batch_id and b.user_id = auth.uid())
  );
create policy ratings_delete_authenticated on public.ratings
  for delete to authenticated using (
    exists (select 1 from public.batches b where b.id = ratings.batch_id and b.user_id = auth.uid())
  );

-- anon denied
create policy ratings_select_anon on public.ratings for select to anon using (false);
create policy ratings_insert_anon on public.ratings for insert to anon with check (false);
create policy ratings_update_anon on public.ratings for update to anon using (false);
create policy ratings_delete_anon on public.ratings for delete to anon using (false);

-- end of migration


