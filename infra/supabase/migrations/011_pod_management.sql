/*
====================================================
THE ARGENT ORDER
MIGRATION 011: POD MANAGEMENT & GRACEFUL LEAVING
Version: 1.0
====================================================

This migration adds comprehensive pod management features:

1. Pod departure handling
2. Pod reassignment when captain leaves
3. Pod archiving
4. Captain succession
5. Mentorship continuity on departure
6. Data preservation on leave

====================================================
*/

----------------------------------------------------
-- PHASE 1: POD DEPARTURE TRACKING
----------------------------------------------------

-- Enhanced pod_members table tracking (already added columns in 009)
-- Add departure type enum
do $$
begin
  create type departure_type as enum (
    'voluntary',      -- User chose to leave
    'promoted',       -- User promoted to different pod role
    'removed',        -- Removed by captain/admin
    'inactive',       -- System removed due to inactivity
    'disciplinary'    -- Removed due to rule violation
  );
exception
  when duplicate_object then null;
end $$;

-- Add departure type to pod_members
alter table pod_members add column if not exists departure_type departure_type;

-- Add rejoin restrictions
alter table pod_members add column if not exists rejoin_cooldown timestamp with time zone;
alter table pod_members add column if not exists max_pods integer default 3;  -- Max pods user can join in lifetime

----------------------------------------------------
-- PHASE 2: POD GRACEFUL DEPARTURE FUNCTION
----------------------------------------------------

create or replace function handle_member_graceful_departure(
  p_user_id uuid,
  p_pod_id uuid,
  p_departure_type departure_type default 'voluntary',
  p_reason text default null
)
returns void as $$
declare
  v_member_record pod_members%rowtype;
  v_captain_count int;
  v_new_captain_id uuid;
  v_mentor_id uuid;
begin
  -- Get the member record
  select * into v_member_record
  from pod_members
  where user_id = p_user_id and pod_id = p_pod_id and left_at is null;
  
  if v_member_record is null then
    raise exception 'Member not found in pod';
  end if;
  
  -- If captain leaving, handle succession
  if v_member_record.pod_role = 'captain' then
    -- Find a veteran to promote
    select user_id into v_new_captain_id
    from pod_members
    where pod_id = p_pod_id 
      and pod_role = 'member'
      and left_at is null
    order by joined_at asc
    limit 1;
    
    -- If no veteran, try any member
    if v_new_captain_id is null then
      select user_id into v_new_captain_id
      from pod_members
      where pod_id = p_pod_id 
        and left_at is null
        and user_id != p_user_id
      order by joined_at asc
      limit 1;
    end if;
    
    -- Update new captain
    if v_new_captain_id is not null then
      update pod_members
      set pod_role = 'captain'
      where user_id = v_new_captain_id and pod_id = p_pod_id;
      
      update pods
      set captain_id = v_new_captain_id
      where id = p_pod_id;
      
      -- Notify new captain
      insert into notifications (user_id, title, message, type)
      values (
        v_new_captain_id,
        'Promoted to Captain',
        'You have been promoted to Captain of your pod. Lead well.',
        'promotion'
      );
    end if;
  end if;
  
  -- If mentor leaving, reassign mentees
  if v_member_record.pod_role = 'mentor' then
    select mentor_id into v_mentor_id
    from pods
    where id = p_pod_id;
    
    -- Transfer active mentorships to captain
    update mentorships
    set mentor_id = (
      select captain_id from pods where id = p_pod_id
    )
    where mentor_id = p_user_id
      and ended_at is null;
  end if;
  
  -- Mark departure
  update pod_members
  set 
    left_at = now(),
    departure_reason = p_reason,
    departure_type = p_departure_type,
    rejoinable = case 
      when p_departure_type = 'disciplinary' then false
      when p_departure_type = 'inactive' then true
      else true
    end,
    rejoin_cooldown = case
      when p_departure_type = 'voluntary' then now() + interval '30 days'
      when p_departure_type = 'disciplinary' then null  -- Never
      else now() + interval '7 days'
    end
  where user_id = p_user_id and pod_id = p_pod_id;
  
  -- Log the departure
  insert into audit_logs (user_id, action, table_name, record_id, metadata)
  values (
    p_user_id,
    'pod_departure',
    'pod_members',
    v_member_record.id,
    jsonb_build_object(
      'pod_id', p_pod_id,
      'departure_type', p_departure_type,
      'reason', p_reason,
      'role', v_member_record.pod_role
    )
  );
  
  -- Notify pod members
  insert into notifications (user_id, title, message, type)
  select 
    user_id,
    'Brother Departed',
    'A member has left the pod. Keep the brotherhood strong.',
    'pod_update'
  from pod_members
  where pod_id = p_pod_id and user_id != p_user_id and left_at is null;
  
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 3: POD REASSIGNMENT FUNCTION
----------------------------------------------------

create or replace function reassign_pod_member(
  p_user_id uuid,
  p_from_pod_id uuid,
  p_to_pod_id uuid,
  p_initiated_by uuid,
  p_reason text default null
)
returns void as $$
declare
  v_member_record pod_members%rowtype;
begin
  -- Get member record
  select * into v_member_record
  from pod_members
  where user_id = p_user_id and pod_id = p_from_pod_id and left_at is null;
  
  if v_member_record is null then
    raise exception 'Member not found in source pod';
  end if;
  
  -- Check cooldown
  if v_member_record.rejoin_cooldown is not null and v_member_record.rejoin_cooldown > now() then
    raise exception 'Member is in rejoin cooldown period';
  end if;
  
  -- Check max pods
  if v_member_record.max_pods <= (
    select count(*) from pod_members 
    where user_id = p_user_id and left_at is not null
  ) then
    raise exception 'Member has reached maximum pod limit';
  end if;
  
  -- Mark departure from old pod
  update pod_members
  set left_at = now(),
      departure_reason = 'reassigned',
      departure_type = 'promoted',
      rejoinable = false
  where user_id = p_user_id and pod_id = p_from_pod_id;
  
  -- Add to new pod
  insert into pod_members (user_id, pod_id, pod_role, joined_at, enrolled_by)
  values (
    p_user_id,
    p_to_pod_id,
    'member',  -- Always join as member, can be promoted later
    now(),
    p_initiated_by
  );
  
  -- Log reassignment
  insert into audit_logs (user_id, action, table_name, record_id, metadata)
  values (
    p_user_id,
    'pod_reassignment',
    'pod_members',
    p_user_id,
    jsonb_build_object(
      'from_pod', p_from_pod_id,
      'to_pod', p_to_pod_id,
      'initiated_by', p_initiated_by,
      'reason', p_reason
    )
  );
  
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 4: POD DISSOLUTION FUNCTION
----------------------------------------------------

create or replace function dissolve_pod(
  p_pod_id uuid,
  p_dissolved_by uuid,
  p_reason text default null
)
returns void as $$
declare
  v_pod pods%rowtype;
  v_member_count int;
begin
  -- Get pod record
  select * into v_pod from pods where id = p_pod_id;
  
  if v_pod is null then
    raise exception 'Pod not found';
  end if;
  
  -- Count active members
  select count(*) into v_member_count
  from pod_members
  where pod_id = p_pod_id and left_at is null;
  
  -- Archive all members
  update pod_members
  set 
    left_at = now(),
    departure_reason = 'pod_dissolved',
    departure_type = 'promoted',  -- Positive framing
    rejoinable = true
  where pod_id = p_pod_id and left_at is null;
  
  -- Archive pod
  update pods
  set 
    active = false,
    dissolved_at = now(),
    dissolved_reason = p_reason,
    dissolved_by = p_dissolved_by
  where id = p_pod_id;
  
  -- Log dissolution
  insert into audit_logs (user_id, action, table_name, record_id, metadata)
  values (
    p_dissolved_by,
    'pod_dissolved',
    'pods',
    p_pod_id,
    jsonb_build_object(
      'pod_name', v_pod.name,
      'member_count', v_member_count,
      'reason', p_reason
    )
  );
  
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 5: POD HEALTH CHECK FUNCTION
----------------------------------------------------

create or replace function check_pod_health(p_pod_id uuid)
returns jsonb as $$
declare
  v_result jsonb;
  v_member_count int;
  v_avg_attendance decimal;
  v_avg_formation decimal;
  v_inactive_members int;
begin
  -- Count members
  select count(*) into v_member_count
  from pod_members
  where pod_id = p_pod_id and left_at is null;
  
  -- Calculate average attendance (last 90 days)
  select avg(attendance_rate) into v_avg_attendance
  from (
    select 
      pm.user_id,
      count(pa.id)::decimal / nullif(count(pm2.id), 0) as attendance_rate
    from pod_members pm
    left join pod_meetings pm2 on pm.pod_id = pm2.pod_id 
      and pm2.scheduled_at > now() - interval '90 days'
    left join pod_attendance pa on pm2.id = pa.meeting_id 
      and pa.user_id = pm.user_id
    where pm.pod_id = p_pod_id and pm.left_at is null
    group by pm.user_id
  ) attendance;
  
  -- Calculate average formation score
  select avg(fs.overall_score) into v_avg_formation
  from pod_members pm
  join formation_scores fs on pm.user_id = fs.user_id
  where pm.pod_id = p_pod_id and pm.left_at is null;
  
  -- Count inactive members (no events in 30 days)
  select count(*) into v_inactive_members
  from pod_members pm
  left join formation_events fe on pm.user_id = fe.user_id 
    and fe.created_at > now() - interval '30 days'
  where pm.pod_id = p_pod_id 
    and pm.left_at is null
    and fe.id is null;
  
  -- Determine health status
  v_result := jsonb_build_object(
    'pod_id', p_pod_id,
    'member_count', v_member_count,
    'avg_attendance', round(v_avg_attendance::numeric, 2),
    'avg_formation_score', round(v_avg_formation::numeric, 0),
    'inactive_members', v_inactive_members,
    'health_status', case
      when v_member_count < 3 then 'at_risk'  -- Too few members
      when v_inactive_members > v_member_count / 2 then 'concerning'  -- Too many inactive
      when v_avg_attendance < 0.5 then 'needs_attention'
      else 'healthy'
    end,
    'checked_at', now()
  );
  
  return v_result;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 6: INACTIVITY HANDLING
----------------------------------------------------

create or replace function mark_inactive_members()
returns void as $$
declare
  v_inactive_users uuid[];
  v_user_id uuid;
begin
  -- Find users with no activity in 30 days who are in pods
  select array_agg(distinct pm.user_id) into v_inactive_users
  from pod_members pm
  left join formation_events fe on pm.user_id = fe.user_id 
    and fe.created_at > now() - interval '30 days'
  where pm.left_at is null
    and fe.id is null;
  
  -- Send warnings
  foreach v_user_id in array v_inactive_users
  loop
    insert into notifications (user_id, title, message, type)
    values (
      v_user_id,
      'Pod Activity Warning',
      'You have not recorded any formation events in 30 days. Please check in to avoid removal from your pod.',
      'warning'
    );
  end loop;
  
  -- Log inactive check
  insert into audit_logs (action, table_name, metadata)
  values (
    'inactivity_check',
    'pod_members',
    jsonb_build_object(
      'inactive_count', array_length(v_inactive_users, 1),
      'checked_at', now()
    )
  );
  
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 7: POD MERGE FUNCTION
----------------------------------------------------

create or replace function merge_pods(
  p_source_pod_id uuid,
  p_target_pod_id uuid,
  p_initiated_by uuid,
  p_reason text default null
)
returns void as $$
declare
  v_source_members int;
begin
  -- Get member count
  select count(*) into v_source_members
  from pod_members
  where pod_id = p_source_pod_id and left_at is null;
  
  -- Check target pod has capacity (max 10 per pod)
  if v_source_members + (
    select count(*) from pod_members 
    where pod_id = p_target_pod_id and left_at is null
  ) > 10 then
    raise exception 'Merged pod would exceed maximum size of 10';
  end if;
  
  -- Transfer all members
  update pod_members
  set pod_id = p_target_pod_id
  where pod_id = p_source_pod_id and left_at is null;
  
  -- Archive source pod
  update pods
  set 
    active = false,
    dissolved_at = now(),
    dissolved_reason = 'merged_into:' || p_target_pod_id,
    dissolved_by = p_initiated_by
  where id = p_source_pod_id;
  
  -- Log merge
  insert into audit_logs (user_id, action, table_name, record_id, metadata)
  values (
    p_initiated_by,
    'pods_merged',
    'pods',
    p_source_pod_id,
    jsonb_build_object(
      'source_pod', p_source_pod_id,
      'target_pod', p_target_pod_id,
      'members_transferred', v_source_members,
      'reason', p_reason
    )
  );
  
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 8: POD CREATION VALIDATION
----------------------------------------------------

create or replace function validate_pod_creation(
  p_name text,
  p_captain_id uuid
)
returns boolean as $$
declare
  v_captain_pods int;
  v_captain_rank leadership_level;
begin
  -- Check captain doesn't have too many pods
  select count(*) into v_captain_pods
  from pods
  where captain_id = p_captain_id and active = true;
  
  if v_captain_pods > 0 then
    raise exception 'Captain already leads a pod';
  end if;
  
  -- Check captain has appropriate rank
  select get_user_leadership_level(p_captain_id) into v_captain_rank;
  
  if v_captain_rank not in ('captain', 'officer', 'mentor', 'steward') then
    raise exception 'User must be at least Captain rank to create a pod';
  end if;
  
  -- Check name isn't taken
  if exists (select 1 from pods where name = p_name and active = true) then
    raise exception 'Pod name already exists';
  end if;
  
  return true;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------

/*
This migration adds:
1. Pod departure tracking and types
2. Graceful departure function with captain succession
3. Pod reassignment with cooldown handling
4. Pod dissolution and merging
5. Pod health checking
6. Inactivity detection and warnings
7. Pod creation validation

Functions added:
- handle_member_graceful_departure()
- reassign_pod_member()
- dissolve_pod()
- merge_pods()
- check_pod_health()
- mark_inactive_members()
- validate_pod_creation()
*/
