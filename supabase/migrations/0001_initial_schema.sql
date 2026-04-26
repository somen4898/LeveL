-- LEVEL v1.0 — Initial Schema
-- All tables scoped per-user via RLS.

-- ── profiles ──
create table profiles (
  id              uuid primary key references auth.users on delete cascade,
  display_name    text,
  timezone        text not null default 'UTC',
  day_close_time  time not null default '23:59:00',
  active_run_id   uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── runs ──
create table runs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  status          text not null check (status in ('onboarding','active','archived')),
  start_date      date,
  end_date        date,
  current_level   integer not null default 1 check (current_level between 1 and 30),
  level_streak    integer not null default 0,
  created_at      timestamptz not null default now()
);
create unique index runs_user_active_idx on runs(user_id) where status = 'active';

-- FK from profiles to runs (deferred to avoid circular)
alter table profiles add constraint profiles_active_run_fk
  foreign key (active_run_id) references runs(id);

-- ── cores ──
create table cores (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  kind            text not null check (kind in ('eating','gym','coding')),
  schedule_days   smallint[] not null,
  is_locked       boolean not null default true,
  created_at      timestamptz not null default now(),
  unique(run_id, kind)
);

-- ── subtasks ──
create table subtasks (
  id              uuid primary key default gen_random_uuid(),
  core_id         uuid not null references cores(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  label           text not null,
  measurement     text not null check (measurement in ('binary','numeric')),
  target_numeric  numeric,
  unit            text,
  position        integer not null default 0,
  active_from_level  integer not null default 1,
  active_until_level integer
);

-- ── optionals ──
create table optionals (
  id                       uuid primary key default gen_random_uuid(),
  run_id                   uuid not null references runs(id) on delete cascade,
  user_id                  uuid not null references auth.users on delete cascade,
  label                    text not null,
  measurement              text not null check (measurement in ('binary','numeric')),
  target_numeric           numeric,
  unit                     text,
  unlocked_at_level        integer not null,
  consecutive_skip_count   integer not null default 0,
  is_locked_in_today       boolean not null default false,
  created_at               timestamptz not null default now()
);

-- ── rewards ──
create table rewards (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  scheduled_day   integer not null check (scheduled_day in (15,30,45,60,75,90)),
  tier            text not null check (tier in ('small','big')),
  name            text not null,
  price_amount    numeric,
  price_currency  text default 'INR',
  image_url       text,
  motivation_note text,
  status          text not null default 'locked'
                  check (status in ('locked','qualifying','claimable','claimed')),
  claimed_at      timestamptz,
  unique(run_id, scheduled_day)
);

-- ── level_catalogue ──
create table level_catalogue (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  level_number    integer not null check (level_number between 1 and 30),
  effect_kind     text not null check (effect_kind in ('TIGHTEN','UNLOCK')),
  description     text not null,
  target_subtask_id  uuid references subtasks(id),
  delta_numeric      numeric,
  new_optional_label text,
  new_optional_measurement text,
  new_optional_target_numeric numeric,
  new_optional_unit  text,
  unique(run_id, level_number)
);

-- ── level_history ──
create table level_history (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  level_number    integer not null,
  catalogue_id    uuid not null references level_catalogue(id),
  achieved_on     date not null,
  achieved_at     timestamptz not null default now(),
  unique(run_id, level_number)
);

-- ── daily_logs ──
create table daily_logs (
  id                       uuid primary key default gen_random_uuid(),
  run_id                   uuid not null references runs(id) on delete cascade,
  user_id                  uuid not null references auth.users on delete cascade,
  log_date                 date not null,
  day_index                integer not null check (day_index between 1 and 90),
  status                   text not null default 'in_progress'
                           check (status in ('in_progress','qualified','failed')),
  closed_at                timestamptz,
  cores_complete_count     integer not null default 0,
  cores_required_count     integer not null default 0,
  optional_skips_with_reason  integer not null default 0,
  optional_skips_without_reason integer not null default 0,
  unique(run_id, log_date),
  unique(run_id, day_index)
);

-- ── task_completions ──
create table task_completions (
  id              uuid primary key default gen_random_uuid(),
  daily_log_id    uuid not null references daily_logs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  task_kind       text not null check (task_kind in ('subtask','optional')),
  subtask_id      uuid references subtasks(id),
  optional_id     uuid references optionals(id),
  completed       boolean not null default false,
  numeric_value   numeric,
  note            text,
  logged_at       timestamptz not null default now(),
  check (
    (task_kind = 'subtask' and subtask_id is not null and optional_id is null) or
    (task_kind = 'optional' and optional_id is not null and subtask_id is null)
  )
);

-- ── reasoning_entries ──
create table reasoning_entries (
  id              uuid primary key default gen_random_uuid(),
  daily_log_id    uuid not null references daily_logs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  optional_id     uuid not null references optionals(id),
  reason_text     text not null check (length(reason_text) >= 50),
  tag             text check (tag in ('sick','tired','busy','other')),
  logged_at       timestamptz not null default now(),
  is_immutable    boolean not null default true
);

-- ── IMMUTABILITY TRIGGERS ──
create or replace function prevent_update_delete()
returns trigger as $$
begin
  raise exception 'This table is append-only. Updates and deletes are not permitted.';
end;
$$ language plpgsql;

create trigger reasoning_entries_immutable
  before update or delete on reasoning_entries
  for each row execute function prevent_update_delete();

create trigger level_history_immutable
  before update or delete on level_history
  for each row execute function prevent_update_delete();

-- ── ROW-LEVEL SECURITY ──
alter table profiles enable row level security;
create policy "users see own profile" on profiles for all
  using (id = auth.uid()) with check (id = auth.uid());

alter table runs enable row level security;
create policy "users see own rows" on runs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table cores enable row level security;
create policy "users see own rows" on cores for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table subtasks enable row level security;
create policy "users see own rows" on subtasks for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table optionals enable row level security;
create policy "users see own rows" on optionals for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table rewards enable row level security;
create policy "users see own rows" on rewards for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table level_catalogue enable row level security;
create policy "users see own rows" on level_catalogue for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table level_history enable row level security;
create policy "users see own rows" on level_history for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table daily_logs enable row level security;
create policy "users see own rows" on daily_logs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table task_completions enable row level security;
create policy "users see own rows" on task_completions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table reasoning_entries enable row level security;
create policy "users see own rows" on reasoning_entries for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── Auto-create profile on signup ──
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
