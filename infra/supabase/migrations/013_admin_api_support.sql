/*
====================================================
THE ARGENT ORDER
MIGRATION 013: ADMIN API SUPPORT FUNCTIONS
Version: 1.0
====================================================

This migration adds RPC functions to support the web admin API:

1. Admin member management
2. Admin pod management
3. Admin moderation actions
4. Admin auth verification

====================================================
*/

----------------------------------------------------
-- PHASE 1: ADMIN VERIFICATION FUNCTION
----------------------------------------------------

create or replace function is_admin(p_user_id uuid)
returns boolean as $$
declare
  v_level leadership_level;
begin
  select get_user_leadership_level(p_user_id) into v_level;
  return v_level in ('officer', 'mentor', 'steward');
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 2: ADMIN MEMBER FUNCTIONS
----------------------------------------------------

-- Get all members with pagination
create or replace function get_all_members(
  p_limit int default 50,
  p_offset int default 0,
  p_search text default null
)
returns table (
  user_id uuid,
  display_name text,
  email text,
  avatar_url text,
  vocation vocation_state,
  rank_name text,
  formation_level text,
  overall_score bigint,
  last_activity timestamptz,
  created_at timestamptz
) as $$
begin
  return query
  select 
    p.user_id,
    p.display_name,
    p.email,
    p.avatar_url,
    p.vocation,
    r.name as rank_name,
    fl.name as formation_level,
    coalesce(fs.overall_score, 0) as overall_score,
    (select max(created_at) from formation_events where user_id = p.user_id) as last_activity,
    p.created_at
  from profiles p
  left join user_ranks ur on p.user_id = ur.user_id
  left join ranks r on ur.rank_id = r.id
  left join user_formation_levels ufl on p.user_id = ufl.user_id
  left join formation_levels fl on ufl.formation_level_id = fl.id
  left join formation_scores fs on p.user_id = fs.user_id
  where p_search is null 
     or p.display_name ilike '%' || p_search || '%'
     or p.email ilike '%' || p_search || '%'
  order by coalesce(fs.overall_score, 0) desc
  limit p_limit
  offset p_offset;
end;
$$ language plpgsql security definer;

-- Get member details for admin view
create or replace function get_member_details(p_user_id uuid)
returns jsonb as $$
declare
  v_result jsonb;
begin
  -- Get profile and formation
  with member_data as (
    select 
      p.user_id,
      p.display_name,
      p.email,
      p.bio,
      p.avatar_url,
      p.vocation,
      p.created_at,
      (select name from ranks where id = (select rank_id from user_ranks where user_id = p.user_id order by assigned_at desc limit 1)) as rank_name,
      (select name from formation_levels where id = (select formation_level_id from user_formation_levels where user_id = p.user_id order by assigned_at desc limit 1)) as formation_level,
      fs.faith_score,
      fs.discipline_score,
      fs.brotherhood_score,
      fs.building_score,
      fs.truth_score,
      fs.overall_score,
      (select count(*) from formation_events fe where fe.user_id = p.user_id and fe.created_at > now() - interval '30 days') as activity_30_days,
      (select count(*) from formation_events fe where fe.user_id = p.user_id and fe.created_at > now() - interval '7 days') as activity_7_days,
      (select name from pods where id = (select pod_id from pod_members where user_id = p.user_id and left_at is null limit 1)) as pod_name
  )
  select jsonb_build_object(
    'profile', row_to_json(d.*),
    'achievements', (
      select jsonb_agg(jsonb_build_object(
        'name', a.name,
        'icon', a.icon,
        'earned_at', ua.earned_at
      ))
      from user_achievements ua
      join achievements a on ua.achievement_id = a.id
      where ua.user_id = p_user_id
    ),
    'campaigns', (
      select jsonb_agg(jsonb_build_object(
        'title', c.title,
        'status', ce.status,
        'started_at', ce.started_at,
        'completion_percent', ce.completion_percent
      ))
      from campaign_enrollments ce
      join campaigns c on ce.campaign_id = c.id
      where ce.user_id = p_user_id
    ),
    'projects', (
      select jsonb_agg(jsonb_build_object(
        'title', title,
        'status', status,
        'started_at', started_at
      ))
      from projects
      where user_id = p_user_id
    ),
    'recent_events', (
      select jsonb_agg(jsonb_build_object(
        'pillar', pillar,
        'points', points,
        'reason', reason,
        'created_at', created_at
      ) order by created_at desc)
      from formation_events
      where user_id = p_user_id
      limit 20
    ),
    'pod_history', (
      select jsonb_agg(jsonb_build_object(
        'pod_name', p.name,
        'role', pod_role,
        'joined_at', joined_at,
        'left_at', left_at,
        'departure_reason', departure_reason
      ) order by joined_at desc)
      from pod_members pm
      join pods p on pm.pod_id = p.id
      where pm.user_id = p_user_id
    )
  ) into v_result
  from member_data d
  where d.user_id = p_user_id;
  
  return v_result;
end;
$$ language plpgsql security definer;

-- Update member rank
create or replace function admin_update_member_rank(
  p_user_id uuid,
  p_rank_id uuid,
  p_admin_id uuid
)
returns void as $$
begin
  -- Verify admin
  if not is_admin(p_admin_id) then
    raise exception 'Unauthorized';
  end if;
  
  -- Update or insert rank
  insert into user_ranks (user_id, rank_id, assigned_by, assigned_at)
  values (p_user_id, p_rank_id, p_admin_id, now())
  on conflict (user_id, rank_id) do nothing;
  
  -- Log action
  insert into audit_logs (user_id, action, table_name, metadata)
  values (p_user_id, 'admin_rank_change', 'user_ranks', jsonb_build_object(
    'rank_id', p_rank_id,
    'admin_id', p_admin_id
  ));
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 3: ADMIN POD FUNCTIONS
----------------------------------------------------

-- Get all pods for admin view
create or replace function get_all_pods()
returns table (
  id uuid,
  name text,
  description text,
  captain_id uuid,
  captain_name text,
  mentor_id uuid,
  member_count int,
  active_members int,
  avg_formation decimal,
  last_meeting timestamptz,
  created_at timestamptz
) as $$
begin
  return query
  select 
    p.id,
    p.name,
    p.description,
    p.captain_id,
    cap.display_name as captain_name,
    p.mentor_id,
    (select count(*) from pod_members where pod_id = p.id) as member_count,
    (select count(*) from pod_members where pod_id = p.id and left_at is null) as active_members,
    (select avg(fs.overall_score) from pod_members pm2 join formation_scores fs on pm2.user_id = fs.user_id where pm2.pod_id = p.id and pm2.left_at is null) as avg_formation,
    (select max(scheduled_at) from pod_meetings where pod_id = p.id) as last_meeting,
    p.created_at
  from pods p
  left join profiles cap on p.captain_id = cap.user_id
  where p.active = true
  order by p.name;
end;
$$ language plpgsql security definer;

-- Admin reassign pod member
create or replace function admin_reassign_member(
  p_user_id uuid,
  p_from_pod_id uuid,
  p_to_pod_id uuid,
  p_admin_id uuid,
  p_reason text default null
)
returns void as $$
begin
  -- Verify admin
  if not is_admin(p_admin_id) then
    raise exception 'Unauthorized';
  end if;
  
  -- Use existing function
  perform reassign_pod_member(p_user_id, p_from_pod_id, p_to_pod_id, p_admin_id, p_reason);
end;
$$ language plpgsql security definer;

-- Admin dissolve pod
create or replace function admin_dissolve_pod(
  p_pod_id uuid,
  p_admin_id uuid,
  p_reason text default null
)
returns void as $$
begin
  -- Verify admin
  if not is_admin(p_admin_id) then
    raise exception 'Unauthorized';
  end if;
  
  perform dissolve_pod(p_pod_id, p_admin_id, p_reason);
end;
$$ language plpgsql security definer;

-- Admin merge pods
create or replace function admin_merge_pods(
  p_source_pod_id uuid,
  p_target_pod_id uuid,
  p_admin_id uuid,
  p_reason text default null
)
returns void as $$
begin
  -- Verify admin
  if not is_admin(p_admin_id) then
    raise exception 'Unauthorized';
  end if;
  
  perform merge_pods(p_source_pod_id, p_target_pod_id, p_admin_id, p_reason);
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 4: ADMIN MODERATION FUNCTIONS
----------------------------------------------------

-- Create moderation action
create or replace function admin_create_moderation(
  p_admin_id uuid,
  p_target_user_id uuid,
  p_action text,
  p_reason text,
  p_metadata jsonb default '{}'
)
returns uuid as $$
declare
  v_action_id uuid;
begin
  -- Verify admin
  if not is_admin(p_admin_id) then
    raise exception 'Unauthorized';
  end if;
  
  -- Validate action
  if p_action not in ('warning', 'mute', 'kick', 'ban', 'unmute', 'unban') then
    raise exception 'Invalid action: %', p_action;
  end if;
  
  -- Create moderation record
  insert into moderation_actions (
    moderator_id,
    target_user_id,
    action,
    reason,
    metadata
  ) values (
    p_admin_id,
    p_target_user_id,
    p_action,
    p_reason,
    p_metadata
  ) returning id into v_action_id;
  
  -- Create notification for target
  insert into notifications (user_id, title, message, type)
  values (
    p_target_user_id,
    case p_action
      when 'warning' then '⚠️ You have received a warning'
      when 'mute' then '🔇 You have been muted'
      when 'kick' then '👢 You have been removed from the server'
      when 'ban' then '🔨 You have been banned'
      else 'Notification'
    end,
    'Reason: ' || p_reason,
    'moderation'
  );
  
  -- Log to audit
  insert into audit_logs (user_id, action, table_name, record_id, metadata)
  values (p_target_user_id, 'moderation_' || p_action, 'moderation_actions', v_action_id, p_metadata);
  
  return v_action_id;
end;
$$ language plpgsql security definer;

-- Get moderation history for a user
create or replace function get_user_moderation_history(p_user_id uuid)
returns table (
  id uuid,
  action text,
  reason text,
  metadata jsonb,
  created_at timestamptz,
  moderator_name text
) as $$
begin
  return query
  select 
    ma.id,
    ma.action,
    ma.reason,
    ma.metadata,
    ma.created_at,
    p.display_name as moderator_name
  from moderation_actions ma
  left join profiles p on ma.moderator_id = p.user_id
  where ma.target_user_id = p_user_id
  order by ma.created_at desc;
end;
$$ language plpgsql security definer;

-- Get recent moderation actions
create or replace function get_recent_moderation(p_limit int default 50)
returns table (
  id uuid,
  action text,
  reason text,
  target_user_id uuid,
  target_name text,
  moderator_name text,
  created_at timestamptz
) as $$
begin
  return query
  select 
    ma.id,
    ma.action,
    ma.reason,
    ma.target_user_id,
    tp.display_name as target_name,
    mp.display_name as moderator_name,
    ma.created_at
  from moderation_actions ma
  join profiles tp on ma.target_user_id = tp.user_id
  left join profiles mp on ma.moderator_id = mp.user_id
  order by ma.created_at desc
  limit p_limit;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 5: ADMIN STATS FUNCTION
----------------------------------------------------

create or replace function get_admin_stats()
returns jsonb as $$
declare
  v_stats jsonb;
begin
  with totals as (
    select 
      (select count(*) from profiles) as total_members,
      (select count(*) from profiles where user_id in (
        select distinct user_id from formation_events 
        where created_at > now() - interval '30 days'
      )) as active_30_days,
      (select count(*) from profiles where user_id in (
        select distinct user_id from formation_events 
        where created_at > now() - interval '7 days'
      )) as active_7_days,
      (select count(*) from pods where active = true) as total_pods,
      (select count(*) from campaigns where active = true) as active_campaigns,
      (select count(*) from formation_events where created_at > now() - interval '7 days') as formations_week,
      (select count(*) from moderation_actions where created_at > now() - interval '30 days') as mod_actions_30_days
  )
  select jsonb_build_object(
    'total_members', totals.total_members,
    'active_30_days', totals.active_30_days,
    'active_7_days', totals.active_7_days,
    'participation_rate_30', case when totals.total_members > 0 
      then round((totals.active_30_days::numeric / totals.total_members) * 100, 1) 
      else 0 end,
    'total_pods', totals.total_pods,
    'active_campaigns', totals.active_campaigns,
    'formations_this_week', totals.formations_week,
    'mod_actions_30_days', totals.mod_actions_30_days,
    'pillar_breakdown', (
      select jsonb_object_agg(pillar, count)
      from (
        select pillar, count(*) 
        from formation_events 
        where created_at > now() - interval '7 days'
        group by pillar
      ) pb
    ),
    'generated_at', now()
  ) into v_stats
  from totals;
  
  return v_stats;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------

/*
This migration adds RPC functions for admin operations:

Member Management:
- is_admin() - Verify admin status
- get_all_members() - Paginated member list
- get_member_details() - Full member profile
- admin_update_member_rank() - Change member rank

Pod Management:
- get_all_pods() - Admin pod overview
- admin_reassign_member() - Move member between pods
- admin_dissolve_pod() - Archive a pod
- admin_merge_pods() - Merge two pods

Moderation:
- admin_create_moderation() - Create moderation action
- get_user_moderation_history() - User's mod history
- get_recent_moderation() - Recent mod actions

Stats:
- get_admin_stats() - Dashboard statistics
*/
