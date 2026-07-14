/*
====================================================
THE ARGENT ORDER
MIGRATION 016: Fix Newsletter Subscribers RLS
====================================================

Fix: upsert requires UPDATE permission for anon role.
The existing policy only allows INSERT for anon, but upsert
does INSERT ON CONFLICT UPDATE, so we need UPDATE for anon too.

Run after 008_newsletter_subscribers.sql
====================================================
*/

-- Drop the restrictive update policy
drop policy "Users can update own subscription" on newsletter_subscribers;

-- Create new policy allowing UPDATE for anon (needed for upsert)
create policy "Anyone can upsert newsletter subscription"
  on newsletter_subscribers
  for update
  to anon, authenticated
  using (true)
  with check (true);
