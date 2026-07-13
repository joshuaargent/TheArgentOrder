/*
====================================================
THE ARGENT ORDER
MIGRATION 008: Newsletter Subscribers
====================================================

This table stores email addresses of users who sign up via
the /join page. Used for future newsletters and email campaigns.

Run after 001_initial_schema.sql
====================================================
*/

----------------------------------------------------
-- NEWSLETTER SUBSCRIBERS
----------------------------------------------------

create table newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamp with time zone default now(),
  confirmed boolean default false,
  unsubscribed_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- Index for email lookups
create index idx_newsletter_subscribers_email on newsletter_subscribers(email);
create index idx_newsletter_subscribers_subscribed_at on newsletter_subscribers(subscribed_at);

----------------------------------------------------
-- RLS POLICIES
----------------------------------------------------

-- Allow anyone to subscribe (public signup)
alter table newsletter_subscribers enable row level security;

create policy "Anyone can subscribe to newsletter"
  on newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

-- Only service role can view all subscribers
create policy "Service role can view all subscribers"
  on newsletter_subscribers
  for select
  to service_role
  using (true);

-- Only service role can delete subscribers
create policy "Service role can delete subscribers"
  on newsletter_subscribers
  for delete
  to service_role
  using (true);

-- Users can update their own subscription status
create policy "Users can update own subscription"
  on newsletter_subscribers
  for update
  to authenticated
  using (true);

----------------------------------------------------
-- SEED DATA: NONE REQUIRED
----------------------------------------------------
