/*
====================================================
THE ARGENT ORDER
FULL CANONICAL DATABASE SCHEMA
Version: 1.1 OPTIMIZED
====================================================

Design Philosophy:
- Formation is event-driven
- Brotherhood is structural, not optional
- Building is first-class (core differentiator)
- Everything is auditable
- No silent state changes
- All progression originates from events
- Optimized for read performance with strategic indexes
====================================================
*/

----------------------------------------------------
-- EXTENSIONS
----------------------------------------------------

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create uuid_generate_v4 function using pgcrypto
create or replace function uuid_generate_v4()
returns uuid
language plpgsql
volatile
as $$
begin
  return gen_random_uuid();
end;
$$;

----------------------------------------------------
-- ENUMS (GLOBAL SYSTEM TYPES)
----------------------------------------------------

create type formation_pillar as enum (
  'faith',
  'discipline',
  'brotherhood',
  'building',
  'truth'
);

create type campaign_status as enum (
  'not_started',
  'active',
  'completed',
  'abandoned'
);

create type pod_role as enum (
  'member',
  'captain',
  'mentor'
);

create type project_status as enum (
  'idea',
  'building',
  'launched',
  'scaled',
  'abandoned'
);

create type rule_frequency as enum (
  'daily',
  'weekly',
  'monthly'
);

-- Leadership levels (excludes Visitor - that's pre-formation)
create type leadership_level as enum (
  'initiate',
  'brother',
  'veteran',
  'captain',
  'officer',
  'mentor',
  'steward'
);

create type vocation_state as enum (
  'single',
  'dating',
  'engaged',
  'married',
  'father'
);

----------------------------------------------------
-- IDENTITY DOMAIN
----------------------------------------------------

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null,
  email text not null,
  
  display_name text not null,
  bio text,
  avatar_url text,
  
  timezone text default 'UTC',
  country text,
  
  vocation vocation_state default 'single',
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for profile lookups
create index idx_profiles_user_id on profiles(user_id);
create index idx_profiles_email on profiles(email);
create index idx_profiles_vocation on profiles(vocation);

----------------------------------------------------
-- RANKS & FORMATION LEVELS
----------------------------------------------------

create table ranks (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  order_index int not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Index for rank lookups
create unique index idx_ranks_order on ranks(order_index);

create table user_ranks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  rank_id uuid not null references ranks(id),
  assigned_by uuid references profiles(user_id),
  assigned_at timestamp with time zone default now(),
  
  unique(user_id, rank_id)
);

-- Index for user's current rank
create index idx_user_ranks_user on user_ranks(user_id);

create table formation_levels (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  order_index int not null,
  description text,
  created_at timestamp with time zone default now()
);

create unique index idx_formation_levels_order on formation_levels(order_index);

create table user_formation_levels (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  formation_level_id uuid not null references formation_levels(id),
  assigned_at timestamp with time zone default now(),
  
  unique(user_id, formation_level_id)
);

create index idx_user_formation_levels_user on user_formation_levels(user_id);

----------------------------------------------------
-- FORMATION EVENT ENGINE (SOURCE OF TRUTH)
----------------------------------------------------

create table formation_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  pillar formation_pillar not null,
  points int not null,
  
  reason text not null,
  metadata jsonb default '{}',
  
  created_at timestamp with time zone default now()
);

-- Critical indexes for formation queries
create index idx_formation_events_user_pillar on formation_events(user_id, pillar);
create index idx_formation_events_user_created on formation_events(user_id, created_at desc);
create index idx_formation_events_pillar_created on formation_events(pillar, created_at desc);
create index idx_formation_events_user_pillar_created on formation_events(user_id, pillar, created_at desc);

-- Index for recent events (no partial predicate - now() is not immutable)
create index idx_formation_events_recent on formation_events(created_at desc);

----------------------------------------------------
-- FORMATION SCORES (DENORMALIZED FOR PERFORMANCE)
----------------------------------------------------

create table formation_scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references profiles(user_id) on delete cascade,
  
  faith_score int default 0,
  discipline_score int default 0,
  brotherhood_score int default 0,
  building_score int default 0,
  truth_score int default 0,
  
  overall_score int generated always as (
    faith_score + discipline_score + brotherhood_score + building_score + truth_score
  ) stored,
  
  updated_at timestamp with time zone default now()
);

-- Index for leaderboard queries
create index idx_formation_scores_overall on formation_scores(overall_score desc);

----------------------------------------------------
-- RULE OF LIFE DOMAIN
----------------------------------------------------

create table rules_of_life (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  version int not null default 1,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, version)
);

create table rule_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  icon text,
  "order" int not null default 0,
  created_at timestamp with time zone default now()
);

create table rule_items (
  id uuid primary key default uuid_generate_v4(),
  rule_id uuid not null references rules_of_life(id) on delete cascade,
  category_id uuid not null references rule_categories(id),
  
  title text not null,
  description text,
  frequency rule_frequency not null,
  target int default 1,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for rule lookups
create index idx_rule_items_rule on rule_items(rule_id);
create index idx_rule_items_category on rule_items(category_id);

create table rule_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  rule_item_id uuid not null references rule_items(id) on delete cascade,
  
  completed boolean default true,
  logged_at timestamp with time zone default now(),
  
  unique(user_id, rule_item_id, logged_at)
);

-- Indexes for streak calculations
create index idx_rule_logs_user_date on rule_logs(user_id, logged_at);
create index idx_rule_logs_user_rule on rule_logs(user_id, rule_item_id);

-- Index for rule logs
create index idx_rule_logs_today on rule_logs(logged_at, user_id);

----------------------------------------------------
-- CAMPAIGN DOMAIN
----------------------------------------------------

create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  
  campaign_type text not null, -- 'lent', 'advent', 'sprint', 'permanent'
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  
  duration_days int,
  start_date date,
  end_date date,
  
  active boolean default true,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for campaign lookups
create index idx_campaigns_active on campaigns(active) where active = true;
create index idx_campaigns_type on campaigns(campaign_type);

create table campaign_tasks (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  
  title text not null,
  description text,
  task_type text not null, -- 'daily', 'weekly', 'one-time'
  
  points int not null default 10,
  required boolean default true,
  "order" int not null default 0,
  
  created_at timestamp with time zone default now()
);

create index idx_campaign_tasks_campaign on campaign_tasks(campaign_id);

create table campaign_enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  
  status campaign_status default 'not_started',
  
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  completion_percent decimal(5,2) default 0,
  
  created_at timestamp with time zone default now(),
  
  unique(user_id, campaign_id)
);

-- Indexes for enrollment queries
create index idx_campaign_enrollments_user on campaign_enrollments(user_id);
create index idx_campaign_enrollments_campaign on campaign_enrollments(campaign_id);
create index idx_campaign_enrollments_status on campaign_enrollments(status) where status = 'active';

create table campaign_progress (
  id uuid primary key default uuid_generate_v4(),
  enrollment_id uuid not null references campaign_enrollments(id) on delete cascade,
  task_id uuid not null references campaign_tasks(id) on delete cascade,
  
  completed boolean default false,
  completed_at timestamp with time zone,
  
  unique(enrollment_id, task_id)
);

create index idx_campaign_progress_enrollment on campaign_progress(enrollment_id);

create table campaign_reviews (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  reflection text,
  rating int check (rating between 1 and 5),
  
  created_at timestamp with time zone default now()
);

create index idx_campaign_reviews_campaign on campaign_reviews(campaign_id);

----------------------------------------------------
-- BROTHERHOOD DOMAIN
----------------------------------------------------

create table pods (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  
  captain_id uuid references profiles(user_id),
  mentor_id uuid references profiles(user_id),
  
  max_members int default 8,
  active boolean default true,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for pod lookups
create index idx_pods_captain on pods(captain_id) where captain_id is not null;
create index idx_pods_mentor on pods(mentor_id) where mentor_id is not null;

create table pod_members (
  id uuid primary key default uuid_generate_v4(),
  pod_id uuid not null references pods(id) on delete cascade,
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  role pod_role default 'member',
  joined_at timestamp with time zone default now(),
  
  unique(pod_id, user_id)
);

create index idx_pod_members_pod on pod_members(pod_id);
create index idx_pod_members_user on pod_members(user_id);

create table pod_meetings (
  id uuid primary key default uuid_generate_v4(),
  pod_id uuid not null references pods(id) on delete cascade,
  
  scheduled_at timestamp with time zone not null,
  duration_minutes int default 60,
  notes text,
  
  created_at timestamp with time zone default now()
);

create index idx_pod_meetings_pod on pod_meetings(pod_id);
create index idx_pod_meetings_upcoming on pod_meetings(scheduled_at);

create table pod_attendance (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references pod_meetings(id) on delete cascade,
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  attended boolean default false,
  
  unique(meeting_id, user_id)
);

create index idx_pod_attendance_meeting on pod_attendance(meeting_id);

----------------------------------------------------
-- MENTORSHIP DOMAIN
----------------------------------------------------

create table mentorships (
  id uuid primary key default uuid_generate_v4(),
  mentor_id uuid not null references profiles(user_id) on delete cascade,
  mentee_id uuid not null references profiles(user_id) on delete cascade,
  
  status text default 'active', -- 'active', 'completed', 'ended'
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone,
  
  unique(mentor_id, mentee_id)
);

create index idx_mentorships_mentor on mentorships(mentor_id) where status = 'active';
create index idx_mentorships_mentee on mentorships(mentee_id) where status = 'active';

----------------------------------------------------
-- JOURNAL DOMAIN
----------------------------------------------------

create table journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  title text,
  content text not null,
  visibility text default 'private', -- 'private', 'pod', 'mentor', 'public'
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_journal_entries_user on journal_entries(user_id, created_at desc);

create table examens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  went_well text,
  failed text,
  saw_god text,
  improve_tomorrow text,
  
  created_at timestamp with time zone default now()
);

create index idx_examens_user on examens(user_id, created_at desc);

create table gratitude_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  content text not null,
  created_at timestamp with time zone default now()
);

create index idx_gratitude_entries_user on gratitude_entries(user_id, created_at desc);

----------------------------------------------------
-- REVIEWS DOMAIN
----------------------------------------------------

create table weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  week_start date not null,
  wins text,
  failures text,
  lessons text,
  goals jsonb default '[]',
  
  created_at timestamp with time zone default now(),
  
  unique(user_id, week_start)
);

create index idx_weekly_reviews_user on weekly_reviews(user_id);

create table monthly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  month date not null,
  content text,
  
  created_at timestamp with time zone default now(),
  
  unique(user_id, month)
);

----------------------------------------------------
-- ACHIEVEMENTS DOMAIN
----------------------------------------------------

create table achievements (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  
  icon text,
  category text not null, -- 'faith', 'discipline', 'brotherhood', 'building', 'truth'
  
  points int default 0,
  
  criteria jsonb, -- conditions for earning
  
  created_at timestamp with time zone default now()
);

create index idx_achievements_category on achievements(category);

create table user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  achievement_id uuid not null references achievements(id),
  
  earned_at timestamp with time zone default now(),
  
  unique(user_id, achievement_id)
);

create index idx_user_achievements_user on user_achievements(user_id);

----------------------------------------------------
-- CERTIFICATIONS DOMAIN
----------------------------------------------------

create table certifications (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  
  category text not null,
  points int default 0,
  
  requirements jsonb, -- requirements for earning
  
  created_at timestamp with time zone default now()
);

create table user_certifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  certification_id uuid not null references certifications(id),
  
  earned_at timestamp with time zone default now(),
  
  unique(user_id, certification_id)
);

----------------------------------------------------
-- PROJECTS/BUILDER DOMAIN
----------------------------------------------------

create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  title text not null,
  description text,
  status project_status default 'idea',
  
  repository_url text,
  website_url text,
  
  started_at date,
  completed_at date,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_projects_user on projects(user_id);
create index idx_projects_status on projects(status) where status != 'abandoned';

create table project_updates (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  
  content text not null,
  
  created_at timestamp with time zone default now()
);

create index idx_project_updates_project on project_updates(project_id);

create table project_milestones (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  
  title text not null,
  description text,
  
  completed boolean default false,
  completed_at timestamp with time zone,
  
  "order" int not null default 0
);

----------------------------------------------------
-- XP & LEVELS DOMAIN
----------------------------------------------------

create table xp_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  amount int not null,
  reason text not null,
  metadata jsonb default '{}',
  
  created_at timestamp with time zone default now()
);

create index idx_xp_events_user on xp_events(user_id, created_at desc);

create table user_levels (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references profiles(user_id) on delete cascade,
  
  level int default 1,
  total_xp int default 0,
  
  updated_at timestamp with time zone default now()
);

-- Index for leaderboard
create index idx_user_levels_xp on user_levels(total_xp desc);

----------------------------------------------------
-- NOTIFICATIONS DOMAIN
----------------------------------------------------

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  title text not null,
  message text,
  type text not null, -- 'info', 'success', 'warning', 'achievement', 'campaign'
  
  read boolean default false,
  
  created_at timestamp with time zone default now()
);

create index idx_notifications_user on notifications(user_id, created_at desc);
create index idx_notifications_unread on notifications(user_id) where read = false;

----------------------------------------------------
-- ANALYTICS DOMAIN
----------------------------------------------------

create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(user_id) on delete set null,
  
  event_name text not null,
  properties jsonb default '{}',
  
  created_at timestamp with time zone default now()
);

-- Index for analytics queries
create index idx_analytics_events_name on analytics_events(event_name, created_at desc);
create index idx_analytics_events_user on analytics_events(user_id, created_at desc);

-- Monthly snapshots for retention analysis
create table formation_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  snapshot_date date not null,
  
  formation_scores jsonb not null,
  active_campaigns int default 0,
  pod_meetings_attended int default 0,
  rules_completed_today int default 0,
  
  created_at timestamp with time zone default now(),
  
  unique(user_id, snapshot_date)
);

create index idx_formation_snapshots_user on formation_snapshots(user_id, snapshot_date desc);

----------------------------------------------------
-- DISCORD DOMAIN
----------------------------------------------------

create table discord_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references profiles(user_id) on delete cascade,
  
  discord_id text unique not null,
  username text not null,
  discriminator text,
  global_name text,
  
  linked_at timestamp with time zone default now()
);

create index idx_discord_accounts_discord_id on discord_accounts(discord_id);
create index idx_discord_accounts_user on discord_accounts(user_id);

create table discord_roles (
  id uuid primary key default uuid_generate_v4(),
  discord_role_id text unique not null,
  name text not null,
  rank_id uuid references ranks(id),
  formation_level_id uuid references formation_levels(id)
);

create table discord_sync_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  event_type text not null, -- 'rank_change', 'achievement', 'campaign_join'
  payload jsonb,
  
  processed boolean default false,
  processed_at timestamp with time zone,
  
  created_at timestamp with time zone default now()
);

create index idx_discord_sync_pending on discord_sync_events(created_at) 
  where processed = false;

----------------------------------------------------
-- MODERATION & AUDIT DOMAIN
----------------------------------------------------

create table moderation_actions (
  id uuid primary key default uuid_generate_v4(),
  target_user_id uuid not null references profiles(user_id) on delete cascade,
  actor_user_id uuid not null references profiles(user_id) on delete cascade,
  
  action text not null, -- 'warn', 'mute', 'kick', 'ban'
  reason text,
  
  created_at timestamp with time zone default now()
);

create index idx_moderation_actions_target on moderation_actions(target_user_id, created_at desc);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  
  actor_id uuid references profiles(user_id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  
  action text not null,
  metadata jsonb default '{}',
  
  created_at timestamp with time zone default now()
);

create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_audit_logs_actor on audit_logs(actor_id, created_at desc);

----------------------------------------------------
-- CONTENT DOMAIN
----------------------------------------------------

create table articles (
  id uuid primary key default uuid_generate_v4(),
  
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  
  status text default 'draft', -- 'draft', 'published', 'archived'
  
  author_id uuid references profiles(user_id),
  
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index idx_articles_slug on articles(slug);
create index idx_articles_status on articles(status) where status = 'published';

create table newsletters (
  id uuid primary key default uuid_generate_v4(),
  
  title text not null,
  issue_number int unique,
  content text,
  
  sent_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

----------------------------------------------------
-- LEADERSHIP REVIEWS
----------------------------------------------------

create table leadership_reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid not null references profiles(user_id) on delete cascade,
  reviewee_id uuid not null references profiles(user_id) on delete cascade,
  
  review_type text not null, -- 'quarterly', 'promotion', 'mentorship'
  content text,
  
  recommended_level leadership_level,
  justification text,
  
  created_at timestamp with time zone default now()
);

create index idx_leadership_reviews_reviewee on leadership_reviews(reviewee_id, created_at desc);

create table promotion_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  recommended_level leadership_level not null,
  recommended_by uuid references profiles(user_id),
  
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by uuid references profiles(user_id),
  reviewed_at timestamp with time zone,
  
  justification text,
  
  created_at timestamp with time zone default now()
);

create index idx_promotion_recommendations_pending on promotion_recommendations(status) 
  where status = 'pending';

----------------------------------------------------
-- SEED DATA: CANONICAL RANKS
----------------------------------------------------

INSERT INTO ranks (name, order_index, description) VALUES
('Visitor', 1, 'Exploring the Order. No commitments. No responsibilities. Limited access to welcome and mission content.'),
('Initiate', 2, 'Learning the culture. Beginning formation. Has basic access to Chapel, Barracks, and Introductions.'),
('Brother', 3, 'Active member. Committed participant. Full member access with consistent participation and positive contribution.'),
('Veteran', 4, 'Proven member. Trusted brother. Can assist Captains, help onboarding, and support moderation. Leadership potential emerging.'),
('Captain', 5, 'Pod Leader. First level of leadership. Leads pod meetings, monitors pod health, supports accountability, and escalates concerns.'),
('Officer', 6, 'Guardian of culture. Operations leader. Has moderation authority, conflict resolution capability, and campaign management responsibility.'),
('Mentor', 7, 'Leadership developer. Formation guide. Develops Brothers, Veterans, Captains, and Officers through guidance, formation, and coaching.'),
('Steward', 8, 'Custodian of the Order. Protects vision, doctrine, culture, and direction. Has full operational authority and approves major initiatives.');

----------------------------------------------------
-- SEED DATA: FORMATION LEVELS
-- Per docs 08_FORMATION_SYSTEM.md
----------------------------------------------------

INSERT INTO formation_levels (name, order_index, description) VALUES
('Foundation', 1, 'Awaken responsibility. Establish prayer, structure, and accountability. Move from chaos to structure.'),
('Discipline', 2, 'Create consistency. Build habits, reduce excuses, increase execution. Become reliable.'),
('Brotherhood', 3, 'Move beyond self-improvement. Serve others, develop relationships, become accountable. Become connected.'),
('Leadership', 4, 'Guide others. Lead, serve, protect culture. Develop influence.'),
('Stewardship', 5, 'Build institutions. Long-term responsibility, legacy, mission protection.');

----------------------------------------------------
-- SEED DATA: RULE CATEGORIES
----------------------------------------------------

INSERT INTO rule_categories (name, slug, icon, "order") VALUES
('Prayer', 'prayer', '🙏', 1),
('Fitness', 'fitness', '💪', 2),
('Work', 'work', '⚒️', 3),
('Learning', 'learning', '📚', 4),
('Family', 'family', '👨‍👩‍👧', 5),
('Rest', 'rest', '😴', 6);

----------------------------------------------------
-- HELPER FUNCTIONS
----------------------------------------------------

-- Function to calculate formation scores from events
create or replace function calculate_formation_scores(p_user_id uuid)
returns void as $$
declare
  v_faith int;
  v_discipline int;
  v_brotherhood int;
  v_building int;
  v_truth int;
begin
  -- Sum points by pillar for the last 90 days
  select 
    coalesce(sum(case when pillar = 'faith' then points else 0 end), 0),
    coalesce(sum(case when pillar = 'discipline' then points else 0 end), 0),
    coalesce(sum(case when pillar = 'brotherhood' then points else 0 end), 0),
    coalesce(sum(case when pillar = 'building' then points else 0 end), 0),
    coalesce(sum(case when pillar = 'truth' then points else 0 end), 0)
  into v_faith, v_discipline, v_brotherhood, v_building, v_truth
  from formation_events
  where user_id = p_user_id
    and created_at > now() - interval '90 days';
  
  -- Upsert formation scores
  insert into formation_scores (user_id, faith_score, discipline_score, brotherhood_score, building_score, truth_score, updated_at)
  values (p_user_id, v_faith, v_discipline, v_brotherhood, v_building, v_truth, now())
  on conflict (user_id) do update
    set faith_score = v_faith,
        discipline_score = v_discipline,
        brotherhood_score = v_brotherhood,
        building_score = v_building,
        truth_score = v_truth,
        updated_at = now();
end;
$$ language plpgsql security definer;

-- Trigger to auto-calculate formation scores on event insert
create or replace function trigger_calculate_formation_scores()
returns trigger as $$
begin
  perform calculate_formation_scores(new.user_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_formation_event_insert
  after insert on formation_events
  for each row execute function trigger_calculate_formation_scores();

-- Function to calculate XP for level
create or replace function get_xp_for_level(p_level int)
returns int as $$
begin
  return case p_level
    when 1 then 0
    when 2 then 100
    when 3 then 250
    when 4 then 500
    when 5 then 1000
    else (p_level - 1) * 500 + 500
  end;
end;
$$ language plpgsql immutable;

-- Function to calculate level from XP
create or replace function get_level_from_xp(p_xp int)
returns int as $$
begin
  if p_xp < 100 then return 1; end if;
  if p_xp < 250 then return 2; end if;
  if p_xp < 500 then return 3; end if;
  if p_xp < 1000 then return 4; end if;
  return floor((p_xp - 1000) / 500 + 5)::int;
end;
$$ language plpgsql immutable;

-- Function to award XP and update level
create or replace function award_xp(p_user_id uuid, p_amount int, p_reason text, p_metadata jsonb default '{}')
returns void as $$
declare
  v_new_total int;
  v_new_level int;
begin
  -- Insert XP event
  insert into xp_events (user_id, amount, reason, metadata)
  values (p_user_id, p_amount, p_reason, p_metadata);
  
  -- Update total and recalculate level
  update user_levels
  set total_xp = total_xp + p_amount,
      level = get_level_from_xp(total_xp + p_amount),
      updated_at = now()
  where user_id = p_user_id;
  
  -- If user_levels doesn't exist, create it
  if not found then
    insert into user_levels (user_id, level, total_xp)
    values (p_user_id, 1, p_amount);
  end if;
end;
$$ language plpgsql security definer;

-- Function to check and award achievements
create or replace function check_achievements(p_user_id uuid)
returns void as $$
declare
  v_user_achievements text[];
  v_achievement record;
begin
  -- Get existing achievements
  select array_agg(achievement_id::text)
  into v_user_achievements
  from user_achievements
  where user_id = p_user_id;
  
  -- Check each achievement
  for v_achievement in select * from achievements loop
    -- Skip if already earned
    if v_achievement.id::text = any(v_user_achievements) then
      continue;
    end if;
    
    -- TODO: Add achievement-specific logic here based on criteria JSONB
    -- For now, this is a placeholder for future achievement checking
    
  end loop;
end;
$$ language plpgsql security definer;

-- Function to log audit events
create or replace function log_audit(
  p_actor_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_action text,
  p_metadata jsonb default '{}'
)
returns void as $$
begin
  insert into audit_logs (actor_id, entity_type, entity_id, action, metadata)
  values (p_actor_id, p_entity_type, p_entity_id, p_action, p_metadata);
end;
$$ language plpgsql security definer;

-- Function to update timestamps
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger update_campaigns_updated_at before update on campaigns
  for each row execute function update_updated_at();

create trigger update_projects_updated_at before update on projects
  for each row execute function update_updated_at();

----------------------------------------------------
-- RLS POLICIES (handled in separate migration)
----------------------------------------------------

-- Note: RLS policies are defined in 13_RLS_POLICIES.sql
