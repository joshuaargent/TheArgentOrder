/*
====================================================
THE ARGENT ORDER
MIGRATION 004: Discord Link Codes
====================================================

This table stores temporary codes for linking Discord accounts
to The Argent Order portal accounts.

Run after 001_initial_schema.sql
====================================================
*/

----------------------------------------------------
-- DISCORD LINK CODES
----------------------------------------------------

create table discord_link_codes (
  id uuid primary key default uuid_generate_v4(),
  
  discord_id text not null,
  code text not null unique,
  
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null
);

-- Index for code lookups
create index idx_discord_link_codes_code on discord_link_codes(code);
create index idx_discord_link_codes_discord_id on discord_link_codes(discord_id);

-- Auto-cleanup expired codes (run periodically)
-- DELETE FROM discord_link_codes WHERE expires_at < now();

----------------------------------------------------
-- RLS POLICIES
----------------------------------------------------

-- Allow anyone to create link codes (Discord bot creates them)
alter table discord_link_codes enable row level security;

create policy "Anyone can insert link codes"
  on discord_link_codes
  for insert
  to anon, authenticated
  with check (true);

-- Allow authenticated users to read their own link codes
create policy "Users can read own link codes"
  on discord_link_codes
  for select
  to authenticated
  using (true);

-- Users can delete their own expired codes
create policy "Users can delete own link codes"
  on discord_link_codes
  for delete
  to authenticated
  using (true);

-- Service role can do anything
create policy "Service role full access"
  on discord_link_codes
  for all
  to service_role
  using (true);

----------------------------------------------------
-- SEED DATA: NONE REQUIRED
----------------------------------------------------
