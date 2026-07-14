/*
====================================================
THE ARGENT ORDER
MIGRATION 017: Fix Auth Flow RLS Policies
====================================================

Fix: Discord OAuth callback needs to INSERT into profiles, formation_scores,
user_ranks, and discord_accounts tables. These tables lack INSERT policies.

Run after 016_newsletter_rls_fix.sql
====================================================
*/

----------------------------------------------------
-- PROFILES INSERT POLICY
----------------------------------------------------

-- Allow authenticated users to insert their own profile (for auth flow)
-- This is used during sign-up via Discord OAuth
create policy "Users can insert own profile"
  on profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- FORMATION_SCORES INSERT POLICY
----------------------------------------------------

-- Allow authenticated users to insert their own formation scores (for auth flow)
create policy "Users can insert own formation scores"
  on formation_scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- USER_RANKS INSERT POLICY
----------------------------------------------------

-- Allow authenticated users to insert their own ranks (for auth flow)
create policy "Users can insert own ranks"
  on user_ranks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- DISCORD_ACCOUNTS INSERT POLICY (already exists, but ensure it works)
----------------------------------------------------

-- Discord OAuth flow needs to insert discord_accounts during sign-up
drop policy if exists "Users can insert own discord account" on discord_accounts;
create policy "Users can insert own discord account"
  on discord_accounts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------
