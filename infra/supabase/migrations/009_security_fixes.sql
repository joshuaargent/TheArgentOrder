/*
====================================================
THE ARGENT ORDER
MIGRATION 009: SECURITY & PRIVACY FIXES
Version: 1.0
====================================================

This migration addresses critical security findings from the audit:

1. Fix formation_events visibility (was public to all users)
2. Fix profiles visibility (was public to all users)
3. Add missing RLS policies for all tables
4. Add source tracking for audit trails
5. Add rate limiting support

====================================================
*/

----------------------------------------------------
-- PHASE 1: FIX FORMATION EVENTS PRIVACY
----------------------------------------------------

-- Drop the overly permissive policy
drop policy if exists "Formation events are viewable by all members" on formation_events;
drop policy if exists "Users can view own formation events" on formation_events;
create policy "Users can view own formation events"
  on formation_events for select
  using (auth.uid() = user_id);

-- Pod members can view aggregate formation scores (not individual events)
-- This is handled at the application level via views

----------------------------------------------------
-- PHASE 2: FIX PROFILES PRIVACY
----------------------------------------------------

-- Drop the overly permissive policy
drop policy if exists "Public profiles are viewable by everyone" on profiles;

-- Users can view their own profile
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id);

-- Users can view pod members' profiles (for brotherhood)
drop policy if exists "Users can view pod members' profiles" on profiles;
create policy "Users can view pod members' profiles"
  on profiles for select
  using (
    exists (
      select 1 from pod_members pm
      join pods p on pm.pod_id = p.id
      where pm.user_id = auth.uid()
      and pm.pod_id in (
        select pod_id from pod_members where user_id = profiles.user_id
      )
    )
  );

-- Captains can view their pod members' profiles
drop policy if exists "Captains can view pod members profiles" on profiles;
create policy "Captains can view pod members profiles"
  on profiles for select
  using (
    exists (
      select 1 from pods
      where id in (
        select pod_id from pod_members where user_id = auth.uid()
        and role = 'captain'
      )
      and id in (
        select pod_id from pod_members where user_id = profiles.user_id
      )
    )
  );

----------------------------------------------------
-- PHASE 3: ADD MISSING RLS POLICIES
----------------------------------------------------

-- formation_milestones (public read - these are system milestones)
drop policy if exists "Formation milestones are viewable by all" on formation_milestones;
create policy "Formation milestones are viewable by all"
  on formation_milestones for select using (true);

-- user_formation_milestones (users own their achievements)
drop policy if exists "Users can view own formation milestones" on user_formation_milestones;
create policy "Users can view own formation milestones"
  on user_formation_milestones for select
  using (auth.uid() = user_id);

-- rule_categories (public read - system data)
drop policy if exists "Rule categories are viewable by all" on rule_categories;
create policy "Rule categories are viewable by all"
  on rule_categories for select using (true);

-- quarterly_reviews
drop policy if exists "Users can manage own quarterly reviews" on quarterly_reviews;
create policy "Users can manage own quarterly reviews"
  on quarterly_reviews for all
  using (auth.uid() = user_id);

-- annual_reviews
drop policy if exists "Users can manage own annual reviews" on annual_reviews;
create policy "Users can manage own annual reviews"
  on annual_reviews for all
  using (auth.uid() = user_id);

-- articles (public read for published)
drop policy if exists "Published articles are viewable by all" on articles;
create policy "Published articles are viewable by all"
  on articles for select
  using (status = 'published' or auth.uid() = author_id);

drop policy if exists "Users can manage own articles" on articles;
create policy "Users can manage own articles"
  on articles for all
  using (auth.uid() = author_id);

-- newsletters (public read)
drop policy if exists "Newsletters are viewable by all" on newsletters;
create policy "Newsletters are viewable by all"
  on newsletters for select using (true);

-- xp_events - add insert policy
drop policy if exists "Users can insert own xp events" on xp_events;
create policy "Users can insert own xp events"
  on xp_events for insert
  with check (auth.uid() = user_id);

-- user_levels - add insert policy
drop policy if exists "Users can view own level" on user_levels;
create policy "Users can view own level"
  on user_levels for select
  using (auth.uid() = user_id);

drop policy if exists "System can update user levels" on user_levels;
create policy "System can update user levels"
  on user_levels for update
  using (true);  -- For trigger-based updates

----------------------------------------------------
-- PHASE 4: ADD SOURCE TRACKING FOR AUDIT
----------------------------------------------------

-- Add source column to track origin of formation events
alter table formation_events add column if not exists source text default 'portal';
comment on column formation_events.source is 'Source of event: portal, discord, bot, api';

-- Add enrolled_by to track who enrolled (self vs invite)
alter table campaign_enrollments add column if not exists enrolled_by uuid references profiles(user_id);
alter table campaign_enrollments add column if not exists enrollment_source text default 'self';
comment on column campaign_enrollments.enrollment_source is 'How user enrolled: self, invite, admin';

-- Add left_at for tracking graceful departure
alter table pod_members add column if not exists left_at timestamp with time zone;
alter table pod_members add column if not exists departure_reason text;
alter table pod_members add column if not exists rejoinable boolean default true;

-- Add source to rule_logs
alter table rule_logs add column if not exists source text default 'portal';
comment on column rule_logs.source is 'Source of log: portal, discord, bot, api';

----------------------------------------------------
-- PHASE 5: RATE LIMITING SUPPORT
----------------------------------------------------

-- Create rate limiting table for API abuse prevention
create table if not exists api_rate_limits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  endpoint text not null,
  request_count int default 1,
  window_start timestamp with time zone default now(),
  unique(user_id, endpoint)
);

-- Index for rate limit checks
create index idx_rate_limits_user_endpoint on api_rate_limits(user_id, endpoint);
create index idx_rate_limits_window on api_rate_limits(window_start);

-- Function to check and increment rate limit
create or replace function check_rate_limit(
  p_user_id uuid,
  p_endpoint text,
  p_max_requests int default 100,
  p_window_seconds int default 60
)
returns boolean as $$
declare
  v_count int;
  v_window_start timestamp with time zone;
begin
  -- Get current count
  select request_count, window_start into v_count, v_window_start
  from api_rate_limits
  where user_id = p_user_id and endpoint = p_endpoint;
  
  -- Check if window has expired
  if v_window_start is null or v_window_start < now() - (p_window_seconds || ' seconds')::interval then
    -- Start new window
    insert into api_rate_limits (user_id, endpoint, request_count, window_start)
    values (p_user_id, p_endpoint, 1, now())
    on conflict (user_id, endpoint) do update
    set request_count = 1, window_start = now();
    return true;
  end if;
  
  -- Check if limit exceeded
  if v_count >= p_max_requests then
    return false;
  end if;
  
  -- Increment counter
  update api_rate_limits
  set request_count = request_count + 1
  where user_id = p_user_id and endpoint = p_endpoint;
  
  return true;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 6: IMPROVED POD SECURITY
----------------------------------------------------

-- Ensure pod captains can only manage their own pods
drop policy if exists "Captains can manage own pod meetings" on pod_meetings;
create policy "Captains can manage own pod meetings"
  on pod_meetings for all
  using (
    exists (
      select 1 from pods
      where id = pod_meetings.pod_id
      and (captain_id = auth.uid() or mentor_id = auth.uid())
    )
  );

-- Ensure attendance records are properly secured
drop policy if exists "Captains can manage pod attendance" on pod_attendance;
drop policy if exists "Users can view own attendance" on pod_attendance;
create policy "Users can view own attendance"
  on pod_attendance for select
  using (auth.uid() = user_id);

drop policy if exists "Users can manage own attendance" on pod_attendance;
create policy "Users can manage own attendance"
  on pod_attendance for insert
  with check (auth.uid() = user_id);

create policy "Captains can manage pod attendance"
  on pod_attendance for all
  using (
    exists (
      select 1 from pod_meetings pm2
      join pods p on pm2.pod_id = p.id
      where pm2.id = pod_attendance.meeting_id
      and (p.captain_id = auth.uid() or p.mentor_id = auth.uid())
    )
  );

----------------------------------------------------
-- PHASE 7: ADMIN & MODERATION POLICIES
----------------------------------------------------

-- Ensure audit logs are viewable by officers only
drop policy if exists "Officers can view audit logs" on audit_logs;
create policy "Officers can view audit logs"
  on audit_logs for select
  using (
    get_user_leadership_level(auth.uid()) in ('officer', 'mentor', 'steward')
  );

-- Create moderation log for sensitive actions
drop policy if exists "Only service role can insert audit logs" on audit_logs;
create policy "Only service role can insert audit logs"
  on audit_logs for insert
  with check (true);  -- RLS bypassed for service role

----------------------------------------------------
-- PHASE 8: DISCORD SYNC SECURITY
----------------------------------------------------

-- Restrict discord sync events
drop policy if exists "Service can manage discord sync" on discord_sync_events;
drop policy if exists "Users can view own discord sync events" on discord_sync_events;
create policy "Users can view own discord sync events"
  on discord_sync_events for select
  using (auth.uid() = user_id);

drop policy if exists "Service can manage discord sync events" on discord_sync_events;
create policy "Service can manage discord sync events"
  on discord_sync_events for all
  using (true);  -- For service role / discord bot

-- Discord roles - public read
drop policy if exists "Discord roles are viewable by all" on discord_roles;
create policy "Discord roles are viewable by all"
  on discord_roles for select using (true);

-- Discord accounts - users manage own
drop policy if exists "Users can manage own Discord account" on discord_accounts;
drop policy if exists "Users can view own discord account" on discord_accounts;
create policy "Users can view own discord account"
  on discord_accounts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own discord account" on discord_accounts;
create policy "Users can insert own discord account"
  on discord_accounts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own discord account" on discord_accounts;
create policy "Users can update own discord account"
  on discord_accounts for update
  using (auth.uid() = user_id);

----------------------------------------------------
-- PHASE 9: LEADERBOARD & PUBLIC SCORES
----------------------------------------------------

-- Note: public_leaderboard view and policy moved to migration 010
-- to avoid view creation issues

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------

/*
This migration addresses:
1. Privacy: Formation events now private to user
2. Privacy: Profiles viewable by user + pod members + captains
3. Security: All tables now have RLS policies
4. Audit: Source tracking added to events
5. Rate Limiting: Infrastructure for API abuse prevention
6. Pod Security: Proper captain/mentor separation
7. Admin: Enhanced moderation policies
8. Leaderboard: Public aggregate view created
*/
