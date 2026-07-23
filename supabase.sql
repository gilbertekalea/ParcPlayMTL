
create table fields (id uuid primary key default gen_random_uuid(), name text not null, address text, borough text, surface text, access text, availability text, website text, contact text, eco_notes text, eco_score int, bike_yes_no text, stm_yes_no text, stm_details text, parking_yes_no text, parking_details text, lat double precision, lng double precision, contributor_type text default 'real', created_by_name text, created_by_id text, is_anonymous boolean default false, votes int default 0, created_at timestamptz default now());
create table field_votes (id uuid primary key default gen_random_uuid(), field_id uuid references fields(id) on delete cascade, user_id text, vote_type text, created_at timestamptz default now());
create table activity_logs (id uuid primary key default gen_random_uuid(), field_id text, field_name text, user_name text, action text, created_at timestamptz default now());
alter table fields enable row level security; alter table field_votes enable row level security; alter table activity_logs enable row level security;
create policy "allow all" on fields for all using (true) with check (true);
create policy "allow all" on field_votes for all using (true) with check (true);
create policy "allow all" on activity_logs for all using (true) with check (true);
