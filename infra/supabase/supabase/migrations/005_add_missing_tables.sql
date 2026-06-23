/*
====================================================
THE ARGENT ORDER
MIGRATION 005: Missing Tables & Expanded Seed Data
====================================================

Phase 1: Missing tables
- formation_pillars
- formation_milestones
- user_formation_milestones
- examen_entries (separate from examens)
- quarterly_reviews
- annual_reviews
- formation_snapshots (daily)
- project_showcases

Phase 2: Expanded seed data
- More campaigns per docs/20_CAMPAIGN_LIBRARY.md
- More achievements per docs/08_FORMATION_SYSTEM.md
- Rule category templates
- Campaign tasks for new campaigns

====================================================
*/

----------------------------------------------------
-- PHASE 1: MISSING TABLES
----------------------------------------------------

----------------------------------------------------
-- FORMATION PILLARS
----------------------------------------------------

create table if not exists formation_pillars (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  color text,
  sort_order int not null default 0
);

-- Seed formation pillars
insert into formation_pillars (name, slug, description, icon, color, sort_order) values
  ('Faith', 'faith', 'Relationship with God through prayer, sacraments, and scripture', '✝️', '#3B82F6', 1),
  ('Discipline', 'discipline', 'Mastery of self through habits, fitness, and execution', '⚔️', '#EF4444', 2),
  ('Brotherhood', 'brotherhood', 'Relationship with others through community and accountability', '🤝', '#8B5CF6', 3),
  ('Building', 'building', 'Creation of value through projects, businesses, and creation', '🏗️', '#22C55E', 4),
  ('Truth', 'truth', 'Pursuit of wisdom through learning, apologetics, and reason', '📖', '#F59E0B', 5)
on conflict (slug) do nothing;

----------------------------------------------------
-- FORMATION MILESTONES
----------------------------------------------------

create table if not exists formation_milestones (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  pillar formation_pillar not null,
  requirement_type text not null, -- 'streak', 'count', 'cumulative', 'achievement'
  requirement_value jsonb not null, -- {"days": 30} or {"count": 10}
  formation_level_id uuid references formation_levels(id),
  points int default 0,
  icon text,
  created_at timestamp with time zone default now()
);

-- Seed formation milestones
insert into formation_milestones (slug, name, description, pillar, requirement_type, requirement_value, points, icon) values
  ('first_prayer', 'First Prayer', 'Logged your first prayer', 'faith', 'count', '{"count": 1}', 10, '🙏'),
  ('prayer_streak_7', 'Week of Prayer', '7-day prayer streak', 'faith', 'streak', '{"days": 7}', 50, '📿'),
  ('prayer_streak_30', 'Month of Prayer', '30-day prayer streak', 'faith', 'streak', '{"days": 30}', 200, '🔥'),
  ('first_mass', 'First Mass', 'Attended your first Mass', 'faith', 'count', '{"count": 1}', 25, '✝️'),
  ('first_examen', 'First Examen', 'Completed your first daily examen', 'faith', 'count', '{"count": 1}', 10, '💭'),
  ('first_workout', 'First Rep', 'Completed your first workout', 'discipline', 'count', '{"count": 1}', 10, '💪'),
  ('workout_streak_7', 'Week Warrior', '7-day workout streak', 'discipline', 'streak', '{"days": 7}', 50, '🔥'),
  ('deep_work_10', 'Deep Diver', 'Completed 10 deep work sessions', 'discipline', 'count', '{"count": 10}', 50, '🎯'),
  ('first_pod_meeting', 'Pod Initiation', 'Attended your first pod meeting', 'brotherhood', 'count', '{"count": 1}', 25, '👥'),
  ('first_mentorship', 'Mentor Connection', 'Started your first mentorship', 'brotherhood', 'count', '{"count": 1}', 50, '🤝'),
  ('first_project', 'Builder Begins', 'Created your first project', 'building', 'count', '{"count": 1}', 25, '🔨'),
  ('project_launched', 'First Launch', 'Launched your first project', 'building', 'count', '{"count": 1}', 100, '🚀'),
  ('first_book', 'Reader', 'Completed your first book', 'truth', 'count', '{"count": 1}', 10, '📚'),
  ('course_1', 'Student', 'Completed your first course', 'truth', 'count', '{"count": 1}', 50, '🎓')
on conflict (slug) do nothing;

----------------------------------------------------
-- USER FORMATION MILESTONES
----------------------------------------------------

create table if not exists user_formation_milestones (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  milestone_id uuid not null references formation_milestones(id) on delete cascade,
  progress int default 0,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, milestone_id)
);

-- Indexes
create index idx_user_milestones_user on user_formation_milestones(user_id);
create index idx_user_milestones_milestone on user_formation_milestones(milestone_id);

----------------------------------------------------
-- EXAMEN ENTRIES (Daily spiritual reflection)
----------------------------------------------------

create table if not exists examen_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  went_well text,
  failed text,
  saw_god text,
  improve_tomorrow text,
  gratitude text[],
  prayer_focus text,
  date date not null default current_date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, date)
);

-- Indexes
create index idx_examen_user_date on examen_entries(user_id, date desc);

----------------------------------------------------
-- QUARTERLY REVIEWS
----------------------------------------------------

create table if not exists quarterly_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  -- Quarter info
  quarter int not null, -- 1, 2, 3, or 4
  year int not null,
  
  -- Review content
  wins text,
  failures text,
  lessons text,
  goals text,
  identity_reflection text,
  mission_reflection text,
  direction_reflection text,
  purpose_reflection text,
  
  -- Formations scores at time of review
  faith_score int,
  discipline_score int,
  brotherhood_score int,
  building_score int,
  truth_score int,
  overall_score int,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_quarterly_user on quarterly_reviews(user_id);
create index idx_quarterly_period on quarterly_reviews(year, quarter);

----------------------------------------------------
-- ANNUAL REVIEWS
----------------------------------------------------

create table if not exists annual_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  year int not null,
  
  -- Annual reflection
  wins text,
  failures text,
  lessons text,
  growth_areas text,
  biggest_lesson text,
  answered_prayers text,
  unanswered_prayers text,
  
  -- Year in review
  proudest_moment text,
  hardest_moment text,
  biggest_leap text,
  
  -- Looking forward
  next_year_vision text,
  key_goals text[],
  habits_to_build text[],
  habits_to_break text[],
  relationships_to_deepen text[],
  
  -- Final scores
  faith_score int,
  discipline_score int,
  brotherhood_score int,
  building_score int,
  truth_score int,
  overall_score int,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_annual_user on annual_reviews(user_id);
create index idx_annual_year on annual_reviews(year);

----------------------------------------------------
-- PROJECT SHOWCASES
----------------------------------------------------

create table if not exists project_showcases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  
  title text not null,
  tagline text,
  description text,
  impact text,
  lessons_learned text,
  
  -- Media
  demo_url text,
  thumbnail_url text,
  
  -- Stats
  views int default 0,
  likes int default 0,
  
  -- Status
  featured boolean default false,
  published boolean default false,
  published_at timestamp with time zone,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index idx_showcase_published on project_showcases(published, featured);
create index idx_showcase_project on project_showcases(project_id);
create index idx_showcase_user on project_showcases(user_id);

----------------------------------------------------
-- FORMATION SNAPSHOTS (Daily snapshots for charts)
----------------------------------------------------

create table if not exists formation_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  
  date date not null default current_date,
  
  faith_score int not null default 0,
  discipline_score int not null default 0,
  brotherhood_score int not null default 0,
  building_score int not null default 0,
  truth_score int not null default 0,
  overall_score int not null default 0,
  
  level int default 1,
  total_xp int default 0,
  
  streak_days int default 0,
  
  created_at timestamp with time zone default now(),
  
  unique(user_id, date)
);

-- Indexes
create index idx_snapshots_user_date on formation_snapshots(user_id, date desc);
create index idx_snapshots_date on formation_snapshots(date);

----------------------------------------------------
-- RLS POLICIES
----------------------------------------------------

-- Enable RLS on new tables
alter table formation_pillars enable row level security;
alter table formation_milestones enable row level security;
alter table user_formation_milestones enable row level security;
alter table examen_entries enable row level security;
alter table quarterly_reviews enable row level security;
alter table annual_reviews enable row level security;
alter table project_showcases enable row level security;
alter table formation_snapshots enable row level security;

-- Formation pillars are public read
create policy "pillars_public_read"
  on formation_pillars
  for select using (true);

-- Milestones are public read
create policy "milestones_public_read"
  on formation_milestones
  for select using (true);

-- User milestones: user owns their own
create policy "users_manage_own_milestones"
  on user_formation_milestones
  for all using (user_id = auth.uid());

-- Examen entries: user owns their own
create policy "users_manage_own_examens"
  on examen_entries
  for all using (user_id = auth.uid());

-- Quarterly reviews: user owns their own
create policy "users_manage_own_quarterly_reviews"
  on quarterly_reviews
  for all using (user_id = auth.uid());

-- Annual reviews: user owns their own
create policy "users_manage_own_annual_reviews"
  on annual_reviews
  for all using (user_id = auth.uid());

-- Project showcases: owner or featured/public
create policy "users_create_own_showcases"
  on project_showcases
  for insert with check (user_id = auth.uid());

create policy "users_update_own_showcases"
  on project_showcases
  for update using (user_id = auth.uid());

create policy "showcases_public_read"
  on project_showcases
  for select using (published = true or user_id = auth.uid());

-- Formation snapshots: user owns their own
create policy "users_manage_own_snapshots"
  on formation_snapshots
  for all using (user_id = auth.uid());

----------------------------------------------------
-- TRIGGER FOR UPDATED_AT
----------------------------------------------------

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_examen_entries_updated_at
  before update on examen_entries
  for each row execute function update_updated_at();

create trigger update_quarterly_reviews_updated_at
  before update on quarterly_reviews
  for each row execute function update_updated_at();

create trigger update_annual_reviews_updated_at
  before update on annual_reviews
  for each row execute function update_updated_at();

create trigger update_project_showcases_updated_at
  before update on project_showcases
  for each row execute function update_updated_at();

----------------------------------------------------
-- PHASE 2: EXPANDED SEED DATA
----------------------------------------------------

----------------------------------------------------
-- MORE CAMPAIGNS (per 20_CAMPAIGN_LIBRARY.md)
----------------------------------------------------

-- Add more campaigns
INSERT INTO campaigns (slug, title, description, campaign_type, difficulty, duration_days, start_date, end_date, active) VALUES
  ('foundation_21', 'Foundation 21', 'Establish baseline discipline and identity in 21 days', 'foundation', 'beginner', 21, NULL, NULL, true),
  ('prayer_30', 'Prayer 30', 'Rebuild relationship with God through 30 days of prayer', 'faith', 'beginner', 30, NULL, NULL, true),
  ('discipline_30', 'Discipline 30', 'Remove softness and inconsistency in 30 days', 'discipline', 'intermediate', 30, NULL, NULL, true),
  ('brotherhood_28', 'Brotherhood 28', 'Break isolation through 28 days of pod participation', 'brotherhood', 'intermediate', 28, NULL, NULL, true),
  ('building_30', 'Building 30', 'Create output through 30 days of focused building', 'building', 'intermediate', 30, NULL, NULL, true),
  ('truth_14', 'Truth 14', 'Remove self-deception through 14 days of daily examen', 'truth', 'intermediate', 14, NULL, NULL, true),
  ('chastity_21', 'Chastity 21', 'Master desire and impulse through 21 days of discipline', 'discipline', 'advanced', 21, NULL, NULL, true),
  ('leadership_30', 'Leadership 30', 'Train responsibility under pressure for 30 days', 'leadership', 'advanced', 30, NULL, NULL, true),
  ('marriage_60', 'Marriage 60', '60-day marriage preparation through prayer and discipline', 'vocation', 'intermediate', 60, NULL, NULL, true),
  ('fatherhood_90', 'Fatherhood 90', 'Develop provider and leader mindset over 90 days', 'vocation', 'advanced', 90, NULL, NULL, true),
  ('builder_sprint', 'Builder Sprint', 'Ongoing 90-day builder cycles', 'building', 'advanced', 90, NULL, NULL, true),
  ('vocation_discernment', 'Vocation Discernment', 'Align life with calling', 'vocation', 'advanced', 60, NULL, NULL, true),
  ('saintly_discipline', 'Saintly Discipline', 'Extreme formation intensity', 'advanced', 'advanced', 30, NULL, NULL, true)
ON CONFLICT (slug) DO NOTHING;

----------------------------------------------------
-- RULE CATEGORY TEMPLATES
----------------------------------------------------

-- Add rule categories (if not exists)
INSERT INTO rule_categories (name, slug, description, sort_order) VALUES
  ('Prayer', 'prayer', 'Spiritual practices and prayer life', 1),
  ('Health', 'health', 'Physical fitness and body stewardship', 2),
  ('Work', 'work', 'Professional and deep work habits', 3),
  ('Learning', 'learning', 'Education and skill development', 4),
  ('Brotherhood', 'brotherhood', 'Community and relationship habits', 5),
  ('Rest', 'rest', 'Sleep and recovery practices', 6)
ON CONFLICT (slug) DO NOTHING;

----------------------------------------------------
-- FORMATION MILESTONE TEMPLATES
----------------------------------------------------

-- Additional milestones
INSERT INTO formation_milestones (slug, name, description, pillar, requirement_type, requirement_value, points, icon) VALUES
  ('first_confession', 'First Confession', 'Completed your first confession', 'faith', 'count', '{"count": 1}', 25, '💒'),
  ('rosary_complete', 'Rosary Complete', 'Completed your first full rosary', 'faith', 'count', '{"count": 1}', 25, '🌹'),
  ('scripture_streak_7', 'Scripture Reader', '7-day scripture reading streak', 'faith', 'streak', '{"days": 7}', 50, '📖'),
  ('mass_streak_4', 'Weekly Worship', '4 consecutive weeks of Mass attendance', 'faith', 'streak', '{"weeks": 4}', 100, '✝️'),
  ('sleep_target_7', 'Rested', 'Met sleep target for 7 days', 'discipline', 'streak', '{"days": 7}', 50, '😴'),
  ('early_riser_7', 'Early Riser', 'Woke before 6am for 7 consecutive days', 'discipline', 'streak', '{"days": 7}', 100, '🌅'),
  ('deep_work_hour_10', '10 Hours Deep', 'Logged 10 hours of deep work', 'discipline', 'count', '{"hours": 10}', 50, '⏰'),
  ('campaign_joined', 'Campaign Starter', 'Joined your first campaign', 'brotherhood', 'count', '{"count": 1}', 25, '🎯'),
  ('pod_meeting_10', 'Pod Regular', 'Attended 10 pod meetings', 'brotherhood', 'count', '{"meetings": 10}', 100, '👥'),
  ('first_mentor', 'Mentor Mentee', 'Started your first mentorship relationship', 'brotherhood', 'count', '{"count": 1}', 50, '🤝'),
  ('project_milestone', 'Milestone Maker', 'Completed your first project milestone', 'building', 'count', '{"count": 1}', 50, '🏗️'),
  ('deep_work_hour_100', '100 Hours Deep', 'Logged 100 hours of deep work', 'building', 'count', '{"hours": 100}', 300, '⏱️'),
  ('book_12', 'Year of Reading', 'Completed 12 books', 'truth', 'count', '{"count": 12}', 100, '📚'),
  ('course_complete', 'Student', 'Completed your first course', 'truth', 'count', '{"count": 1}', 50, '🎓'),
  ('apologetics_1', 'Defender', 'Completed your first apologetics module', 'truth', 'count', '{"count": 1}', 100, '⚔️')
ON CONFLICT (slug) DO NOTHING;

----------------------------------------------------
-- NOTIFICATION TEMPLATES
----------------------------------------------------

-- Add notification types
INSERT INTO notifications (user_id, title, message, type, created_at) VALUES
  (NULL, 'Welcome', 'Welcome to The Argent Order', 'system', now())
ON CONFLICT DO NOTHING;
