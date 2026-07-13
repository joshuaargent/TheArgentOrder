/*
====================================================
THE ARGENT ORDER
ROW LEVEL SECURITY POLICIES
Version: 1.0
====================================================

Philosophy:
- Users can access their own data
- Captains can access their pod members' data
- Mentors can access their mentees' data
- Steward/Officers can access operational data
- Admins (service role) have full access
====================================================
*/

----------------------------------------------------
-- ENABLE RLS ON ALL TABLES
----------------------------------------------------

alter table profiles enable row level security;
alter table ranks enable row level security;
alter table user_ranks enable row level security;
alter table formation_levels enable row level security;
alter table user_formation_levels enable row level security;
alter table formation_events enable row level security;
alter table formation_scores enable row level security;
alter table rules_of_life enable row level security;
alter table rule_items enable row level security;
alter table rule_logs enable row level security;
alter table campaigns enable row level security;
alter table campaign_tasks enable row level security;
alter table campaign_enrollments enable row level security;
alter table campaign_progress enable row level security;
alter table campaign_reviews enable row level security;
alter table pods enable row level security;
alter table pod_members enable row level security;
alter table pod_meetings enable row level security;
alter table pod_attendance enable row level security;
alter table mentorships enable row level security;
alter table journal_entries enable row level security;
alter table examens enable row level security;
alter table gratitude_entries enable row level security;
alter table weekly_reviews enable row level security;
alter table monthly_reviews enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table certifications enable row level security;
alter table user_certifications enable row level security;
alter table projects enable row level security;
alter table project_updates enable row level security;
alter table project_milestones enable row level security;
alter table xp_events enable row level security;
alter table user_levels enable row level security;
alter table notifications enable row level security;
alter table discord_accounts enable row level security;
alter table discord_roles enable row level security;
alter table discord_sync_events enable row level security;
alter table moderation_actions enable row level security;
alter table audit_logs enable row level security;

----------------------------------------------------
-- HELPER FUNCTIONS FOR RLS
----------------------------------------------------

-- Check if user is in a pod led by the target user
create or replace function is_in_users_pod(p_user_id uuid, p_target_user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from pod_members pm1
    join pod_members pm2 on pm1.pod_id = pm2.pod_id
    join pods p on pm1.pod_id = p.id
    where pm1.user_id = p_user_id
      and pm2.user_id = p_target_user_id
      and p.captain_id = p_user_id
  );
end;
$$ language plpgsql security definer;

-- Check if user is a mentor of the target user
create or replace function is_mentor_of(p_user_id uuid, p_target_user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from mentorships
    where mentor_id = p_user_id
      and mentee_id = p_target_user_id
      and status = 'active'
  );
end;
$$ language plpgsql security definer;

-- Check user's leadership level
create or replace function get_user_leadership_level(p_user_id uuid)
returns leadership_level as $$
declare
  v_rank_order int;
begin
  select r.order_index
  into v_rank_order
  from user_ranks ur
  join ranks r on ur.rank_id = r.id
  where ur.user_id = p_user_id
  order by r.order_index desc
  limit 1;
  
  -- Map rank order to leadership level
  return case v_rank_order
    when 2 then 'initiate'::leadership_level
    when 3 then 'brother'::leadership_level
    when 4 then 'veteran'::leadership_level
    when 5 then 'captain'::leadership_level
    when 6 then 'officer'::leadership_level
    when 7 then 'mentor'::leadership_level
    when 8 then 'steward'::leadership_level
    else 'initiate'::leadership_level
  end;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PROFILES POLICIES
----------------------------------------------------

-- Users can read all profiles (for brotherhood lookup)
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

----------------------------------------------------
-- RANKS & FORMATION POLICIES
----------------------------------------------------

-- Everyone can read ranks and formation levels
create policy "Ranks are viewable by everyone"
  on ranks for select using (true);

create policy "Formation levels are viewable by everyone"
  on formation_levels for select using (true);

-- Users can read their own ranks and formation levels
create policy "Users can view own ranks"
  on user_ranks for select
  using (auth.uid() = user_id);

create policy "Users can view own formation levels"
  on user_formation_levels for select
  using (auth.uid() = user_id);

-- Users can read all formation events (for analytics)
create policy "Formation events are viewable by all members"
  on formation_events for select using (true);

-- Users can insert their own formation events
create policy "Users can insert own formation events"
  on formation_events for insert
  with check (auth.uid() = user_id);

-- Users can read their own formation scores
create policy "Users can view own formation scores"
  on formation_scores for select
  using (auth.uid() = user_id);

----------------------------------------------------
-- RULE OF LIFE POLICIES
----------------------------------------------------

-- Users can manage their own rules
create policy "Users can manage own rules"
  on rules_of_life for all
  using (auth.uid() = user_id);

create policy "Users can manage own rule items"
  on rule_items for all
  using (exists (
    select 1 from rules_of_life
    where id = rule_items.rule_id
    and user_id = auth.uid()
  ));

-- Users can log their own rule completions
create policy "Users can log own rule completions"
  on rule_logs for all
  using (auth.uid() = user_id);

----------------------------------------------------
-- CAMPAIGN POLICIES
----------------------------------------------------

-- Everyone can view active campaigns
create policy "Active campaigns are viewable"
  on campaigns for select
  using (active = true);

-- Users can manage their own enrollments
create policy "Users can manage own campaign enrollments"
  on campaign_enrollments for all
  using (auth.uid() = user_id);

create policy "Users can manage own campaign progress"
  on campaign_progress for all
  using (exists (
    select 1 from campaign_enrollments
    where id = campaign_progress.enrollment_id
    and user_id = auth.uid()
  ));

-- Users can write their own campaign reviews
create policy "Users can write own campaign reviews"
  on campaign_reviews for insert
  with check (auth.uid() = user_id);

----------------------------------------------------
-- BROTHERHOOD POLICIES
----------------------------------------------------

-- Everyone can view pods
create policy "Pods are viewable"
  on pods for select using (true);

-- Users can view their own pod membership
create policy "Users can view own pod membership"
  on pod_members for select
  using (auth.uid() = user_id);

-- Captains can view their pod members
create policy "Captains can view pod members"
  on pod_members for select
  using (
    exists (
      select 1 from pods
      where id = pod_members.pod_id
      and captain_id = auth.uid()
    )
  );

-- Users can manage their own attendance
create policy "Users can manage own attendance"
  on pod_attendance for all
  using (auth.uid() = user_id);

-- Captains can manage pod meetings and attendance
create policy "Captains can manage pod meetings"
  on pod_meetings for all
  using (
    exists (
      select 1 from pods
      where id = pod_meetings.pod_id
      and captain_id = auth.uid()
    )
  );

----------------------------------------------------
-- MENTORSHIP POLICIES
----------------------------------------------------

-- Users can view their mentorships
create policy "Users can view own mentorships"
  on mentorships for select
  using (auth.uid() = mentor_id or auth.uid() = mentee_id);

-- Mentors can update their mentorships
create policy "Mentors can manage mentorships"
  on mentorships for update
  using (auth.uid() = mentor_id);

----------------------------------------------------
-- JOURNAL POLICIES
----------------------------------------------------

-- Users can manage their own journal entries
create policy "Users can manage own journal"
  on journal_entries for all
  using (auth.uid() = user_id);

-- Journal entries have visibility settings
create policy "Users can view others' public journal entries"
  on journal_entries for select
  using (
    auth.uid() = user_id
    or visibility = 'public'
    or (visibility = 'pod' and exists (
      select 1 from pod_members pm1
      join pod_members pm2 on pm1.pod_id = pm2.pod_id
      where pm1.user_id = auth.uid()
      and pm2.user_id = journal_entries.user_id
    ))
  );

-- Examen entries are always private
create policy "Users can manage own examens"
  on examens for all
  using (auth.uid() = user_id);

-- Gratitude entries
create policy "Users can manage own gratitude"
  on gratitude_entries for all
  using (auth.uid() = user_id);

----------------------------------------------------
-- REVIEWS POLICIES
----------------------------------------------------

-- Users can manage their own reviews
create policy "Users can manage own reviews"
  on weekly_reviews for all
  using (auth.uid() = user_id);

create policy "Users can manage own monthly reviews"
  on monthly_reviews for all
  using (auth.uid() = user_id);

----------------------------------------------------
-- ACHIEVEMENTS POLICIES
----------------------------------------------------

-- Everyone can view achievements
create policy "Achievements are viewable"
  on achievements for select using (true);

-- Users can view their own achievements
create policy "Users can view own achievements"
  on user_achievements for select
  using (auth.uid() = user_id);

-- Certifications
create policy "Certifications are viewable"
  on certifications for select using (true);

create policy "Users can view own certifications"
  on user_certifications for select
  using (auth.uid() = user_id);

----------------------------------------------------
-- PROJECTS POLICIES
----------------------------------------------------

-- Users can manage their own projects
create policy "Users can manage own projects"
  on projects for all
  using (auth.uid() = user_id);

-- Users can manage their own project updates and milestones
create policy "Users can manage own project updates"
  on project_updates for all
  using (
    exists (
      select 1 from projects
      where id = project_updates.project_id
      and user_id = auth.uid()
    )
  );

create policy "Users can manage own milestones"
  on project_milestones for all
  using (
    exists (
      select 1 from projects
      where id = project_milestones.project_id
      and user_id = auth.uid()
    )
  );

----------------------------------------------------
-- XP & LEVELS POLICIES
----------------------------------------------------

-- Users can view their own XP and level
create policy "Users can view own XP"
  on xp_events for select
  using (auth.uid() = user_id);

create policy "Users can view own level"
  on user_levels for select
  using (auth.uid() = user_id);

----------------------------------------------------
-- NOTIFICATIONS POLICIES
----------------------------------------------------

-- Users can only see their own notifications
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can manage own notifications"
  on notifications for all
  using (auth.uid() = user_id);

----------------------------------------------------
-- DISCORD POLICIES
----------------------------------------------------

-- Users can link their own Discord account
create policy "Users can manage own Discord account"
  on discord_accounts for all
  using (auth.uid() = user_id);

----------------------------------------------------
-- ADMIN/MODERATION POLICIES
----------------------------------------------------

-- Officers and above can view moderation actions
create policy "Leaders can view moderation actions"
  on moderation_actions for select
  using (
    get_user_leadership_level(auth.uid()) in ('officer', 'mentor', 'steward')
    or auth.uid() = actor_user_id
    or auth.uid() = target_user_id
  );

-- Only officers can create moderation actions
create policy "Officers can create moderation actions"
  on moderation_actions for insert
  with check (
    get_user_leadership_level(auth.uid()) in ('officer', 'mentor', 'steward')
  );

-- Leadership reviews
create policy "Users can view their own reviews"
  on leadership_reviews for select
  using (auth.uid() = reviewer_id or auth.uid() = reviewee_id);

create policy "Leaders can create reviews"
  on leadership_reviews for insert
  with check (
    get_user_leadership_level(auth.uid()) in ('captain', 'officer', 'mentor', 'steward')
  );

-- Promotion recommendations
create policy "Users can view own recommendations"
  on promotion_recommendations for select
  using (auth.uid() = user_id);

create policy "Leaders can view pending recommendations"
  on promotion_recommendations for select
  using (
    get_user_leadership_level(auth.uid()) in ('officer', 'mentor', 'steward')
    or auth.uid() = recommended_by
  );

create policy "Leaders can create recommendations"
  on promotion_recommendations for insert
  with check (
    get_user_leadership_level(auth.uid()) in ('captain', 'officer', 'mentor', 'steward')
  );

----------------------------------------------------
-- SERVICE ROLE BYPASS
----------------------------------------------------

-- Note: The service_role key bypasses all RLS policies
-- This should only be used server-side for admin operations
