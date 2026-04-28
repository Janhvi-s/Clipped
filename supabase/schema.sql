-- Run this in your Supabase SQL editor

create table topics (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  color text not null default '#6366f1',
  created_at timestamp with time zone default now()
);

create table notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text not null,
  preserved_clip text not null,
  tag text not null check (tag in ('concept', 'example', 'quote')),
  topic_id uuid references topics(id) on delete cascade,
  source text not null,
  date date not null default current_date,
  created_at timestamp with time zone default now()
);

create table settings (
  id int primary key default 1,
  anthropic_api_key text,
  updated_at timestamp with time zone default now()
);

-- Insert the single settings row so upsert works
insert into settings (id) values (1) on conflict do nothing;

-- Enable Row Level Security (optional but recommended)
alter table topics enable row level security;
alter table notes enable row level security;
alter table settings enable row level security;

-- Allow all operations for now (tighten per your auth setup)
create policy "allow all" on topics for all using (true) with check (true);
create policy "allow all" on notes for all using (true) with check (true);
create policy "allow all" on settings for all using (true) with check (true);
