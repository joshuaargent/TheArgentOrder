-- Migration 006: Certification System
-- Adds certifications for earned competence tracking
-- Note: Uses IF NOT EXISTS to handle fresh installs and existing databases

----------------------------------------------------
-- CERTIFICATION DEFINITIONS
----------------------------------------------------

-- Create certifications table if not exists (001 may have created it)
create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null, -- 'builder', 'discipline', 'brotherhood', 'faith', 'leadership'
  icon text,
  color text,
  requirements jsonb not null default '{}', -- {campaigns: [], achievements: [], points: {}, custom: []}
  points_required int default 0,
  sort_order int default 0,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Add columns that might not exist in older schemas
DO $$BEGIN
  ALTER TABLE certifications ADD COLUMN IF NOT EXISTS requirements jsonb not null default '{}';
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

DO $$BEGIN
  ALTER TABLE certifications ADD COLUMN IF NOT EXISTS points_required int default 0;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

DO $$BEGIN
  ALTER TABLE certifications ADD COLUMN IF NOT EXISTS sort_order int default 0;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

DO $$BEGIN
  ALTER TABLE certifications ADD COLUMN IF NOT EXISTS active boolean default true;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

DO $$BEGIN
  ALTER TABLE certifications ADD COLUMN IF NOT EXISTS icon text;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

DO $$BEGIN
  ALTER TABLE certifications ADD COLUMN IF NOT EXISTS color text;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

create index idx_certifications_category on certifications(category);

----------------------------------------------------
-- USER CERTIFICATION EARNINGS
----------------------------------------------------

-- Create user_certifications table if not exists
create table if not exists user_certifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  certification_id uuid not null references certifications(id) on delete cascade,
  earned_at timestamp with time zone default now(),
  verified_by uuid references profiles(user_id),
  notes text,
  unique(user_id, certification_id)
);

-- Add columns that might not exist
DO $$BEGIN
  ALTER TABLE user_certifications ADD COLUMN IF NOT EXISTS verified_by uuid references profiles(user_id);
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

DO $$BEGIN
  ALTER TABLE user_certifications ADD COLUMN IF NOT EXISTS notes text;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END$$;

create index idx_user_certs_user on user_certifications(user_id);
create index idx_user_certs_cert on user_certifications(certification_id);

----------------------------------------------------
-- CERTIFICATION REQUIREMENTS
----------------------------------------------------

-- Builder Certification: Complete Building campaigns + project launches
insert into certifications (slug, name, description, category, icon, color, requirements, points_required, sort_order) values
  ('builder_foundation', 'Builder Foundation', 'Completed your first Building campaign', 'builder', '🏗️', '#10b981', 
   '{"campaigns_completed": 1, "category": "building"}', 100, 1),
  ('builder_apprentice', 'Builder Apprentice', 'Completed 3 Building campaigns', 'builder', '🔨', '#10b981',
   '{"campaigns_completed": 3, "category": "building"}', 300, 2),
  ('builder_master', 'Builder Master', 'Completed 5 Building campaigns and launched 3 projects', 'builder', '👷', '#10b981',
   '{"campaigns_completed": 5, "projects_launched": 3}', 500, 3),
  ('first_launch', 'First Launch', 'Launched your first project', 'builder', '🚀', '#f59e0b',
   '{"projects_launched": 1}', 200, 4)
on conflict (slug) do nothing;

-- Discipline Certification: Streaks and consistency
insert into certifications (slug, name, description, category, icon, color, requirements, points_required, sort_order) values
  ('discipline_seven', 'Week Warrior', '7-day formation streak', 'discipline', '🔥', '#ef4444',
   '{"streak_days": 7}', 70, 10),
  ('discipline_month', 'Month of Steel', '30-day formation streak', 'discipline', '⚔️', '#ef4444',
   '{"streak_days": 30}', 300, 11),
  ('discipline_champion', 'Discipline Champion', '90-day formation streak', 'discipline', '🏆', '#ef4444',
   '{"streak_days": 90}', 900, 12)
on conflict (slug) do nothing;

-- Brotherhood Certification: Community and pod participation
insert into certifications (slug, name, description, category, icon, color, requirements, points_required, sort_order) values
  ('brother_foundation', 'Brother', 'Completed Brotherhood campaign', 'brotherhood', '🤝', '#8b5cf6',
   '{"campaigns_completed": 1, "category": "brotherhood"}', 100, 20),
  ('pod_leader', 'Pod Leader', 'Led a pod for 30 days', 'brotherhood', '👥', '#8b5cf6',
   '{"pod_membership_days": 30, "role": "leader"}', 300, 21),
  ('mentor_certified', 'Certified Mentor', 'Mentored 3 brothers successfully', 'brotherhood', '🎓', '#8b5cf6',
   '{"mentees_guided": 3}', 450, 22)
on conflict (slug) do nothing;

-- Faith Certification: Spiritual formation
insert into certifications (slug, name, description, category, icon, color, requirements, points_required, sort_order) values
  ('faith_walker', 'Faith Walker', 'Completed Foundation 21 campaign', 'faith', '✝️', '#3b82f6',
   '{"campaigns_completed": 1, "slug": "foundation_21"}', 150, 30),
  ('faith_warrior', 'Faith Warrior', 'Completed Prayer 30 campaign', 'faith', '🙏', '#3b82f6',
   '{"campaigns_completed": 1, "slug": "prayer_30"}', 200, 31),
  ('sacraments_active', 'Active Sacraments', 'Attended 12 Masses and 4 Confessions', 'faith', '🕊️', '#3b82f6',
   '{"mass_count": 12, "confession_count": 4}', 350, 32)
on conflict (slug) do nothing;

-- Leadership Certification: Community leadership
insert into certifications (slug, name, description, category, icon, color, requirements, points_required, sort_order) values
  ('leadership_veteran', 'Veteran', 'Achieved Veteran rank', 'leadership', '⭐', '#f97316',
   '{"rank": "veteran"}', 500, 40),
  ('leadership_captain', 'Captain', 'Achieved Captain rank', 'leadership', '🎖️', '#f97316',
   '{"rank": "captain"}', 750, 41),
  ('leadership_officer', 'Officer', 'Achieved Officer rank', 'leadership', '📯', '#f97316',
   '{"rank": "officer"}', 1000, 42)
on conflict (slug) do nothing;

----------------------------------------------------
-- FUNCTION: Check and award certifications
----------------------------------------------------

create or replace function check_user_certifications(user_id uuid)
returns setof uuid as $$
declare
  cert certifications%rowtype;
  req jsonb;
  campaign_count int;
  project_count int;
  streak_days int;
  pod_days int;
begin
  for cert in select * from certifications where active = true loop
    req := cert.requirements;
    
    -- Check campaign requirements
    if jsonb_extract_path_text(req, 'campaigns_completed') is not null then
      select count(*) into campaign_count
      from campaign_enrollments ce
      join campaigns c on c.id = ce.campaign_id
      where ce.user_id = check_user_certifications.user_id
        and ce.status = 'completed';
      
      if campaign_count < jsonb_extract_path_text(req, 'campaigns_completed')::int then
        continue;
      end if;
    end if;
    
    -- Check project requirements
    if jsonb_extract_path_text(req, 'projects_launched') is not null then
      select count(*) into project_count
      from projects
      where user_id = check_user_certifications.user_id
        and status = 'completed';
      
      if project_count < jsonb_extract_path_text(req, 'projects_launched')::int then
        continue;
      end if;
    end if;
    
    -- Award certification if not already earned
    perform award_certification(check_user_certifications.user_id, cert.id);
    
    return next cert.id;
  end loop;
  
  return;
end;
$$ language plpgsql security definer;

create or replace function award_certification(p_user_id uuid, p_certification_id uuid)
returns void as $$
begin
  insert into user_certifications (user_id, certification_id)
  values (p_user_id, p_certification_id)
  on conflict (user_id, certification_id) do nothing;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- TRIGGER: Auto-check certifications on relevant events
----------------------------------------------------

create or replace function trigger_check_certifications()
returns trigger as $$
begin
  perform check_user_certifications(NEW.user_id);
  return NEW;
end;
$$ language plpgsql security definer;

-- Check certifications when campaign is completed
drop trigger if exists on_campaign_complete_check_cert on campaign_enrollments;
create trigger on_campaign_complete_check_cert
  after update of status on campaign_enrollments
  for each row
  when (NEW.status = 'completed')
  execute function trigger_check_certifications();

-- Check certifications when project is updated
drop trigger if exists on_project_complete_check_cert on projects;
create trigger on_project_complete_check_cert
  after update of status on projects
  for each row
  when (NEW.status = 'completed')
  execute function trigger_check_certifications();

-- Check certifications on formation event (for streak checks)
drop trigger if exists on_formation_event_check_cert on formation_events;
create trigger on_formation_event_check_cert
  after insert on formation_events
  for each row
  execute function trigger_check_certifications();
