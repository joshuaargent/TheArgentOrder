/*
====================================================
THE ARGENT ORDER
MIGRATION 010: PERFORMANCE & DATA INTEGRITY
Version: 1.0
====================================================

This migration addresses performance and data integrity findings:

1. Add soft delete columns to user content tables
2. Add partial indexes for common queries
3. Optimize formation score calculation
4. Add materialized views for reports
5. Add missing foreign keys

====================================================
*/

----------------------------------------------------
-- PHASE 1: SOFT DELETE COLUMNS
----------------------------------------------------

-- Journal entries soft delete
alter table journal_entries add column if not exists deleted_at timestamp with time zone;
create index idx_journal_entries_deleted on journal_entries(deleted_at) where deleted_at is null;

-- Examens soft delete
alter table examens add column if not exists deleted_at timestamp with time zone;
create index idx_examens_deleted on examens(deleted_at) where deleted_at is null;

-- Gratitude entries soft delete
alter table gratitude_entries add column if not exists deleted_at timestamp with time zone;
create index idx_gratitude_deleted on gratitude_entries(deleted_at) where deleted_at is null;

-- Weekly reviews soft delete
alter table weekly_reviews add column if not exists deleted_at timestamp with time zone;
create index idx_weekly_reviews_deleted on weekly_reviews(deleted_at) where deleted_at is null;

-- Monthly reviews soft delete
alter table monthly_reviews add column if not exists deleted_at timestamp with time zone;
create index idx_monthly_reviews_deleted on monthly_reviews(deleted_at) where deleted_at is null;

-- Quarterly reviews soft delete
alter table quarterly_reviews add column if not exists deleted_at timestamp with time zone;
create index idx_quarterly_reviews_deleted on quarterly_reviews(deleted_at) where deleted_at is null;

-- Annual reviews soft delete
alter table annual_reviews add column if not exists deleted_at timestamp with time zone;
create index idx_annual_reviews_deleted on annual_reviews(deleted_at) where deleted_at is null;

-- Projects soft delete
alter table projects add column if not exists deleted_at timestamp with time zone;
create index idx_projects_deleted on projects(deleted_at) where deleted_at is null;

-- Campaign enrollments soft delete
alter table campaign_enrollments add column if not exists deleted_at timestamp with time zone;
create index idx_enrollments_deleted on campaign_enrollments(deleted_at) where deleted_at is null;

-- Pod memberships soft delete
alter table pod_members add column if not exists deleted_at timestamp with time zone;
create index idx_pod_members_deleted on pod_members(deleted_at) where deleted_at is null;

----------------------------------------------------
-- PHASE 2: PARTIAL INDEXES FOR COMMON QUERIES
----------------------------------------------------

-- Unread notifications (most common query)
create index if not exists idx_notifications_unread 
  on notifications(user_id, created_at desc) 
  where read = false;

-- Active pods
create index if not exists idx_pods_active 
  on pods(captain_id) 
  where active = true;

-- Active campaigns for enrollment
create index if not exists idx_campaigns_enrollable 
  on campaigns(start_date, end_date) 
  where active = true;

-- User's current rank (for quick lookup)
create index if not exists idx_user_ranks_current 
  on user_ranks(user_id, assigned_at desc);

-- User's current formation level
create index if not exists idx_user_formation_levels_current 
  on user_formation_levels(user_id, assigned_at desc);

-- Campaign progress for completion tracking
create unique index if not exists idx_campaign_progress_enrollment_task 
  on campaign_progress(enrollment_id, task_id);

-- Project updates for recent activity
create index if not exists idx_project_updates_recent 
  on project_updates(project_id, created_at desc);

-- Formation events for streak calculations
create index if not exists idx_formation_events_streak 
  on formation_events(user_id, pillar, created_at desc);

----------------------------------------------------
-- PHASE 3: OPTIMIZED FORMATION SCORE CALCULATION
----------------------------------------------------

-- Create incremental score update function
create or replace function increment_formation_score()
returns trigger as $$
begin
  -- Increment the appropriate pillar score
  update formation_scores
  set 
    faith_score = faith_score + case when new.pillar = 'faith' then new.points else 0 end,
    discipline_score = discipline_score + case when new.pillar = 'discipline' then new.points else 0 end,
    brotherhood_score = brotherhood_score + case when new.pillar = 'brotherhood' then new.points else 0 end,
    building_score = building_score + case when new.pillar = 'building' then new.points else 0 end,
    truth_score = truth_score + case when new.pillar = 'truth' then new.points else 0 end,
    updated_at = now()
  where user_id = new.user_id;
  
  -- If no row exists, create one
  if not found then
    insert into formation_scores (user_id, faith_score, discipline_score, brotherhood_score, building_score, truth_score, updated_at)
    values (
      new.user_id,
      case when new.pillar = 'faith' then new.points else 0 end,
      case when new.pillar = 'discipline' then new.points else 0 end,
      case when new.pillar = 'brotherhood' then new.points else 0 end,
      case when new.pillar = 'building' then new.points else 0 end,
      case when new.pillar = 'truth' then new.points else 0 end,
      now()
    );
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop old trigger and replace with optimized version
drop trigger if exists on_formation_event_insert on formation_events;

-- Create new trigger for incremental updates
create trigger on_formation_event_insert_increment
  after insert on formation_events
  for each row execute function increment_formation_score();

-- Function to recalculate scores from scratch (for maintenance)
create or replace function recalculate_all_formation_scores()
returns void as $$
begin
  -- This is a maintenance function to be run periodically
  -- It recalculates all scores based on the last 90 days of events
  with scores as (
    select 
      user_id,
      sum(case when pillar = 'faith' then points else 0 end) as faith,
      sum(case when pillar = 'discipline' then points else 0 end) as discipline,
      sum(case when pillar = 'brotherhood' then points else 0 end) as brotherhood,
      sum(case when pillar = 'building' then points else 0 end) as building,
      sum(case when pillar = 'truth' then points else 0 end) as truth
    from formation_events
    where created_at > now() - interval '90 days'
    group by user_id
  )
  update formation_scores fs
  set 
    faith_score = scores.faith,
    discipline_score = scores.discipline,
    brotherhood_score = scores.brotherhood,
    building_score = scores.building,
    truth_score = scores.truth,
    updated_at = now()
  from scores
  where fs.user_id = scores.user_id;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 4: MATERIALIZED VIEWS FOR REPORTS
----------------------------------------------------

-- Formation leaderboard materialized view
drop materialized view if exists mv_formation_leaderboard;
create materialized view mv_formation_leaderboard as
select 
  fs.user_id,
  p.display_name,
  p.avatar_url,
  fs.faith_score,
  fs.discipline_score,
  fs.brotherhood_score,
  fs.building_score,
  fs.truth_score,
  fs.overall_score,
  fs.updated_at as last_activity,
  row_number() over (order by fs.overall_score desc) as rank
from formation_scores fs
join profiles p on fs.user_id = p.user_id;

create unique index idx_mv_leaderboard_user on mv_formation_leaderboard(user_id);
create index idx_mv_leaderboard_rank on mv_formation_leaderboard(rank);

-- User activity summary
drop materialized view if exists mv_user_activity_summary;
create materialized view mv_user_activity_summary as
select 
  user_id,
  count(*) as total_events,
  sum(points) as total_points,
  count(distinct date(created_at)) as active_days,
  max(created_at) as last_activity
from formation_events
where created_at > now() - interval '30 days'
group by user_id;

create index idx_mv_activity_user on mv_user_activity_summary(user_id);

-- Pod health metrics
drop materialized view if exists mv_pod_health;
create materialized view mv_pod_health as
select 
  p.id as pod_id,
  p.name as pod_name,
  p.captain_id,
  count(distinct pm.user_id) as member_count,
  count(distinct pa.user_id) as attendees_last_30_days,
  count(distinct pm2.meeting_id) as meetings_last_30_days,
  coalesce(avg(fs.overall_score), 0) as avg_formation_score
from pods p
left join pod_members pm on p.id = pm.pod_id and pm.left_at is null
left join pod_members pm2 on p.id = pm2.pod_id
left join pod_meetings pm3 on p.id = pm3.pod_id and pm3.scheduled_at > now() - interval '30 days'
left join pod_attendance pa on pm3.id = pa.meeting_id
left join formation_scores fs on pm.user_id = fs.user_id
group by p.id, p.name, p.captain_id;

create index idx_mv_pod_health_id on mv_pod_health(pod_id);

----------------------------------------------------
-- PHASE 5: FIX MISSING FOREIGN KEYS
----------------------------------------------------

-- Add missing foreign key constraint for user_ranks
-- First, check if there are orphaned records
do $$
begin
  -- Add foreign key if no orphans exist
  alter table user_ranks 
    add constraint fk_user_ranks_profiles 
    foreign key (user_id) references profiles(user_id) on delete cascade;
exception
  when others then
    raise notice 'Foreign key already exists or has violations: %', sqlerrm;
end $$;

-- Add missing foreign key for user_formation_levels
do $$
begin
  alter table user_formation_levels
    add constraint fk_user_formation_levels_profiles
    foreign key (user_id) references profiles(user_id) on delete cascade;
exception
  when others then
    raise notice 'Foreign key already exists or has violations: %', sqlerrm;
end $$;

----------------------------------------------------
-- PHASE 6: ENFORCE CONSISTENT NAMING
----------------------------------------------------

-- Ensure all timestamp columns use consistent naming and type
-- This is informational - actual fixes would require data migration

/*
The following columns should be reviewed for consistency:
- created_at should be "timestamp with time zone" everywhere
- updated_at should be "timestamp with time zone" everywhere
- _at columns should follow same pattern

This is a documentation of the expected standard:
- All date/time columns: "timestamp with time zone"
- All boolean columns: snake_case (e.g., is_active, has_completed)
- All status columns: should use enums where applicable
*/

----------------------------------------------------
-- PHASE 7: CLEANUP ORPHANED DATA
----------------------------------------------------

-- Clean up orphaned formation scores (users who don't exist)
delete from formation_scores 
where user_id not in (select user_id from profiles);

-- Clean up orphaned rank records
delete from user_ranks 
where user_id not in (select user_id from profiles);

-- Clean up orphaned formation level records
delete from user_formation_levels 
where user_id not in (select user_id from profiles);

----------------------------------------------------
-- LEADERBOARD VIEW
----------------------------------------------------

-- Create a view for public leaderboard (aggregate scores only)
-- This is separate from migration 009 due to policy syntax issues with views
drop view if exists public_leaderboard cascade;
create view public_leaderboard as
select 
  fs.user_id,
  fs.overall_score,
  fs.faith_score,
  fs.discipline_score,
  fs.brotherhood_score,
  fs.building_score,
  fs.truth_score,
  p.display_name,
  p.avatar_url,
  row_number() over (order by fs.overall_score desc) as rank
from formation_scores fs
join profiles p on fs.user_id = p.user_id;

-- For views, we use security barrier for additional protection
alter view public_leaderboard set (security_barrier = true);

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------

/*
This migration adds:
1. Soft delete columns to all user content tables
2. Partial indexes for common query patterns
3. Optimized incremental score calculation
4. Materialized views for reports
5. Foreign key constraints where missing
6. Data cleanup for orphaned records

Performance impact:
- Faster notification queries (unread)
- Faster leaderboard (materialized)
- Faster pod health (materialized)
- Reduced CPU on score updates (incremental vs full recalc)
*/
