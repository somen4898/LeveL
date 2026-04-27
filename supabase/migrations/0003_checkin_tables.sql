-- Weight check-ins (weekly)
create table weight_checkins (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  checkin_date    date not null,
  day_index       integer not null,
  weight_kg       numeric not null check (weight_kg > 0),
  notes           text,
  created_at      timestamptz not null default now(),
  unique(run_id, checkin_date)
);

alter table weight_checkins enable row level security;
create policy "users see own rows" on weight_checkins for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Progress photos (daily, optional)
create table progress_photos (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  photo_date      date not null,
  day_index       integer not null,
  storage_path    text not null,
  created_at      timestamptz not null default now()
);

alter table progress_photos enable row level security;
create policy "users see own rows" on progress_photos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Remove the level cap constraint so levels can exceed 30
alter table runs drop constraint runs_current_level_check;
alter table runs add constraint runs_current_level_check check (current_level >= 1);

-- Same for level_catalogue
alter table level_catalogue drop constraint level_catalogue_level_number_check;
alter table level_catalogue add constraint level_catalogue_level_number_check check (level_number >= 1);
