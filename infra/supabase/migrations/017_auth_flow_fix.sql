/*
====================================================
THE ARGENT ORDER
MIGRATION 017: Fix Auth Flow RLS Policies
====================================================

Fix: Discord OAuth callback and API routes need to INSERT into various
tables. These tables lack INSERT policies.

Run after 016_newsletter_rls_fix.sql
====================================================
*/

----------------------------------------------------
-- PROFILES INSERT POLICY
----------------------------------------------------

create policy "Users can insert own profile"
  on profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- FORMATION_SCORES INSERT POLICY
----------------------------------------------------

create policy "Users can insert own formation scores"
  on formation_scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- FORMATION_EVENTS INSERT POLICY
----------------------------------------------------

create policy "Users can insert own formation events"
  on formation_events
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- USER_RANKS INSERT POLICY
----------------------------------------------------

create policy "Users can insert own ranks"
  on user_ranks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- DISCORD_ACCOUNTS INSERT POLICY
----------------------------------------------------

drop policy if exists "Users can insert own discord account" on discord_accounts;
create policy "Users can insert own discord account"
  on discord_accounts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- MENTORSHIPS INSERT POLICY
----------------------------------------------------

create policy "Users can create mentorships"
  on mentorships
  for insert
  to authenticated
  with check (auth.uid() = mentor_id or auth.uid() = mentee_id);

----------------------------------------------------
-- USER_ACHIEVEMENTS INSERT POLICY
----------------------------------------------------

create policy "Users can unlock achievements"
  on user_achievements
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- JOURNAL_ENTRIES INSERT POLICY
----------------------------------------------------

create policy "Users can create journal entries"
  on journal_entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- USER_LEVELS INSERT POLICY
----------------------------------------------------

create policy "Users can have user levels"
  on user_levels
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- NOTIFICATIONS INSERT POLICY
----------------------------------------------------

create policy "Users can receive notifications"
  on notifications
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------
