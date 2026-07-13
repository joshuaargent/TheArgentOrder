/*
====================================================
THE ARGENT ORDER
FULL CANONICAL DATABASE SCHEMA
Version: 1.0 FINAL DESIGN
====================================================

Design Philosophy:
- Formation is event-driven
- Brotherhood is structural, not optional
- Building is first-class (core differentiator)
- Everything is auditable
- No silent state changes
- All progression originates from events
====================================================
*/

----------------------------------------------------
-- EXTENSIONS
----------------------------------------------------

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

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

  display_name text not null,
  bio text,
  avatar_url text,

  timezone text,
  country text,

  vocation vocation_state default 'single',

  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table ranks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  order_index int not null,
  description text
);

----------------------------------------------------
-- SEED DATA: CANONICAL RANKS
----------------------------------------------------

-- Formation Ranks (ordered from entry to highest)
INSERT INTO ranks (name, order_index, description) VALUES
('Visitor', 1, 'Exploring the Order. No commitments. No responsibilities. Limited access to welcome and mission content.'),
('Initiate', 2, 'Learning the culture. Beginning formation. Has basic access to Chapel, Barracks, and Introductions.'),
('Brother', 3, 'Active member. Committed participant. Full member access with consistent participation and positive contribution.'),
('Veteran', 4, 'Proven member. Trusted brother. Can assist Captains, help onboarding, and support moderation. Leadership potential emerging.'),
('Captain', 5, 'Pod Leader. First level of leadership. Leads pod meetings, monitors pod health, supports accountability, and escalates concerns.'),
('Officer', 6, 'Guardian of culture. Operations leader. Has moderation authority, conflict resolution capability, and campaign management responsibility.'),
('Mentor', 7, 'Leadership developer. Formation guide. Develops Brothers, Veterans, Captains, and Officers through guidance, formation, and coaching.'),
('Steward', 8, 'Custodian of the Order. Protects vision, doctrine, culture, and direction. Has full operational authority and approves major initiatives.');

create table user_ranks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id),
  rank_id uuid references ranks(id),
  assigned_at timestamp default now()
);

create table formation_levels (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  order_index int not null
);

create table user_formation_levels (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  formation_level_id uuid references formation_levels(id),
  assigned_at timestamp default now()
);

----------------------------------------------------
-- SEED DATA: FORMATION LEVELS (for gamification)
----------------------------------------------------

INSERT INTO formation_levels (name, order_index, description) VALUES
('Novice', 1, 'Beginning formation. Learning fundamentals.'),
('Builder', 2, 'Active in all pillars. Consistent execution.'),
('Established', 3, 'Proven discipline. Leadership emerging.'),
('Mature', 4, 'Stable formation. Active in leadership.'),
('Exemplar', 5, 'Leadership example. Mentoring others.');

----------------------------------------------------
-- FORMATION EVENT ENGINE (SOURCE OF TRUTH)
----------------------------------------------------

create table formation_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,

  pillar formation_pillar not null,
  points int not null,

  reason text not null,
  metadata jsonb,

  created_at timestamp default now()
);

create table formation_scores (
  user_id uuid primary key,

  faith_score int default 0,
  discipline_score int default 0,
  brotherhood_score int default 0,
  building_score int default 0,
  truth_score int default 0,

  overall_score int default 0,
  updated_at timestamp default now()
);

create table formation_milestones (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  pillar formation_pillar not null,
  threshold int not null,
  description text
);

create table user_formation_milestones (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  milestone_id uuid references formation_milestones(id),
  achieved_at timestamp default now()
);

----------------------------------------------------
-- RULE OF LIFE SYSTEM
----------------------------------------------------

create table rule_of_life (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,

  version int default 1,
  active boolean default true,

  created_at timestamp default now()
);

create table rule_items (
  id uuid primary key default uuid_generate_v4(),
  rule_id uuid references rule_of_life(id),

  category text not null,
  title text not null,
  description text,

  frequency rule_frequency not null,
  target int default 1
);

create table rule_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  rule_item_id uuid references rule_items(id),

  completed boolean default true,
  logged_at timestamp default now()
);

----------------------------------------------------
-- CAMPAIGNS SYSTEM
----------------------------------------------------

create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,

  title text not null,
  description text,

  status campaign_status default 'not_started',

  duration_days int,

  created_at timestamp default now()
);

create table campaign_phases (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id),
  name text not null,
  order_index int not null
);

create table campaign_tasks (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id),
  phase_id uuid references campaign_phases(id),

  title text not null,
  description text,

  pillar formation_pillar,
  points int default 0,

  required boolean default true
);

create table campaign_enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  campaign_id uuid references campaigns(id),

  status campaign_status default 'active',

  started_at timestamp default now(),
  completed_at timestamp
);

create table campaign_progress (
  id uuid primary key default uuid_generate_v4(),
  enrollment_id uuid references campaign_enrollments(id),
  task_id uuid references campaign_tasks(id),

  completed boolean default false,
  completed_at timestamp
);

create table campaign_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  campaign_id uuid references campaigns(id),

  reflection text,
  rating int,

  created_at timestamp default now()
);

----------------------------------------------------
-- BROTHERHOOD SYSTEM (PODS + MENTORSHIP)
----------------------------------------------------

create table pods (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,

  captain_id uuid,
  mentor_id uuid,

  created_at timestamp default now()
);

create table pod_members (
  id uuid primary key default uuid_generate_v4(),
  pod_id uuid references pods(id),
  user_id uuid not null,

  role pod_role default 'member',

  joined_at timestamp default now()
);

create table pod_meetings (
  id uuid primary key default uuid_generate_v4(),
  pod_id uuid references pods(id),

  scheduled_at timestamp,
  notes text
);

create table pod_attendance (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid references pod_meetings(id),
  user_id uuid not null,

  attended boolean default false
);

create table mentorships (
  id uuid primary key default uuid_generate_v4(),
  mentor_id uuid not null,
  mentee_id uuid not null,

  started_at timestamp default now(),
  ended_at timestamp
);

----------------------------------------------------
-- BUILDER SYSTEM (CORE DIFFERENTIATOR)
----------------------------------------------------

create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,

  title text not null,
  description text,

  status project_status default 'idea',

  repo_url text,
  live_url text,

  started_at timestamp,
  completed_at timestamp
);

create table project_milestones (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id),

  title text not null,
  completed boolean default false,
  completed_at timestamp
);

create table project_updates (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id),

  content text,
  created_at timestamp default now()
);

create table project_showcases (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id),

  description text,
  created_at timestamp default now()
);

----------------------------------------------------
-- JOURNAL SYSTEM
----------------------------------------------------

create table journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,

  title text,
  content text,

  visibility text default 'private',

  created_at timestamp default now()
);

create table examen_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,

  went_well text,
  failed text,
  saw_god text,
  improve_tomorrow text,

  created_at timestamp default now()
);

create table gratitude_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,

  content text,
  created_at timestamp default now()
);

----------------------------------------------------
-- REVIEWS SYSTEM
----------------------------------------------------

create table weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,

  wins text,
  failures text,
  lessons text,
  goals text,

  created_at timestamp default now()
);

create table monthly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  content text,
  created_at timestamp default now()
);

create table quarterly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  content text,
  created_at timestamp default now()
);

create table annual_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  content text,
  created_at timestamp default now()
);

----------------------------------------------------
-- ACHIEVEMENTS SYSTEM
----------------------------------------------------

create table achievements (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  category text,
  points int default 0
);

create table user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  achievement_id uuid references achievements(id),
  earned_at timestamp default now()
);

create table certifications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text
);

create table user_certifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  certification_id uuid references certifications(id),
  earned_at timestamp default now()
);

----------------------------------------------------
-- LEADERSHIP SYSTEM
----------------------------------------------------

create table leadership_appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  level leadership_level not null,

  appointed_by uuid,
  reason text,

  created_at timestamp default now()
);

create table leadership_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  content text,
  created_at timestamp default now()
);

create table promotion_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  recommended_level leadership_level,
  justification text,
  created_at timestamp default now()
);

----------------------------------------------------
-- DISCORD SYSTEM
----------------------------------------------------

create table discord_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  discord_id text unique,
  username text,
  linked_at timestamp default now()
);

create table discord_roles (
  id uuid primary key default uuid_generate_v4(),
  role_name text,
  discord_role_id text
);

create table discord_sync_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  event_type text,
  payload jsonb,
  processed boolean default false,
  created_at timestamp default now()
);

----------------------------------------------------
-- NOTIFICATIONS SYSTEM
----------------------------------------------------

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  title text,
  message text,
  type text,
  read boolean default false,
  created_at timestamp default now()
);

----------------------------------------------------
-- ANALYTICS SYSTEM
----------------------------------------------------

create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  event_name text not null,
  properties jsonb,
  created_at timestamp default now()
);

create table daily_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  snapshot_date date,
  data jsonb
);

create table weekly_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  snapshot_date date,
  data jsonb
);

create table monthly_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  snapshot_date date,
  data jsonb
);

----------------------------------------------------
-- NEWSLETTER SUBSCRIBERS
----------------------------------------------------

create table newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamp default now(),
  confirmed boolean default false,
  unsubscribed_at timestamp,
  metadata jsonb
);

----------------------------------------------------
-- INDEXES
----------------------------------------------------

create index idx_formation_events_user on formation_events(user_id);
create index idx_campaign_enrollments_user on campaign_enrollments(user_id);
create index idx_pod_members_user on pod_members(user_id);
create index idx_projects_user on projects(user_id);
create index idx_analytics_user on analytics_events(user_id);
create index idx_newsletter_subscribers_email on newsletter_subscribers(email);

----------------------------------------------------
-- FINAL DESIGN RULE
----------------------------------------------------

/*
This database is valid only if:

1. Formation is event-driven
2. No manual score editing
3. Pods are mandatory for engagement
4. Campaigns drive structured growth
5. Builder system is first-class
6. Leadership is tracked historically
7. Discord is synced, not primary source
8. Analytics is snapshot + event hybrid
9. Nothing important is un-audited
10. The system produces saints AND builders
*/
