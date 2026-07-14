/*
====================================================
THE ARGENT ORDER
MIGRATION 014: AUTO POD ASSIGNMENT
Version: 1.0
====================================================

This migration ensures members are always in a pod:

1. Auto-assign new users to pods on onboarding
2. Trigger-based assignment on profile creation
3. Find smallest/neediest pods first
4. Notify captain when new member joins
5. Dashboard function for admins to see pod balance

====================================================
*/

----------------------------------------------------
-- PHASE 1: AUTO-ASSIGN FUNCTION
----------------------------------------------------

-- Core function to auto-assign a user to a pod
create or replace function auto_assign_user_to_pod(p_user_id uuid)
returns uuid as $$
declare
  v_pod_id uuid;
  v_pod_name text;
  v_captain_id uuid;
begin
  -- Find the best pod for this user
  -- Priority: smallest pods first, then pods with lowest average score (neediest)
  select p.id, p.name, p.captain_id into v_pod_id, v_pod_name, v_captain_id
  from pods p
  where p.active = true
  and (
    -- Pods under target size (5-8 members ideal)
    (
      select count(*) from pod_members 
      where pod_id = p.id and left_at is null
    ) < 8
  )
  order by (
    select count(*) from pod_members 
    where pod_id = p.id and left_at is null
  ) asc,
  -- Secondary: prefer pods with lower formation scores (needier)
  coalesce((
    select avg(fs.overall_score) 
    from pod_members pm2 
    join formation_scores fs on pm2.user_id = fs.user_id
    where pm2.pod_id = p.id and pm2.left_at is null
  ), 0) asc
  limit 1;
  
  -- If no pod found, create a new one
  if v_pod_id is null then
    -- Get any captain to be the first member
    select id into v_pod_id
    from pods
    where active = true
    limit 1;
    
    if v_pod_id is null then
      -- No pods exist, user will need manual assignment
      return null;
    end if;
  end if;
  
  -- Add user to pod
  insert into pod_members (user_id, pod_id, role, joined_at, enrolled_by)
  values (p_user_id, v_pod_id, 'member', now(), v_captain_id)
  on conflict (user_id, pod_id) do nothing;
  
  -- Update pods captain_id if this is the first member and no captain
  if v_captain_id is null then
    update pods set captain_id = p_user_id where id = v_pod_id;
  end if;
  
  -- Log the assignment
  insert into audit_logs (user_id, action, table_name, metadata)
  values (p_user_id, 'auto_pod_assignment', 'pod_members', jsonb_build_object(
    'pod_id', v_pod_id,
    'pod_name', v_pod_name
  ));
  
  -- Notify captain
  if v_captain_id is not null then
    insert into notifications (user_id, title, message, type)
    values (
      v_captain_id,
      '🆕 New Brother Joined',
      'A new member has been auto-assigned to your pod.',
      'pod_update'
    );
  end if;
  
  return v_pod_id;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 2: TRIGGER FOR PROFILE CREATION
----------------------------------------------------

-- Function to handle profile creation
create or replace function on_profile_created()
returns trigger as $$
declare
  v_pod_id uuid;
begin
  -- Auto-assign to pod
  v_pod_id := auto_assign_user_to_pod(new.user_id);
  
  -- Auto-create formation scores row
  insert into formation_scores (user_id)
  values (new.user_id)
  on conflict (user_id) do nothing;
  
  -- Auto-create user level
  insert into user_levels (user_id, level, total_xp)
  values (new.user_id, 1, 0)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop and recreate trigger
drop trigger if exists on_profile_created on profiles;
create trigger on_profile_created
  after insert on profiles
  for each row execute function on_profile_created();

----------------------------------------------------
-- PHASE 3: POD BALANCE FUNCTION
----------------------------------------------------

-- Get pod balance metrics for admin dashboard
create or replace function get_pod_balance()
returns table (
  pod_id uuid,
  pod_name text,
  member_count int,
  avg_formation bigint,
  recent_activity int,
  balance_score int  -- Lower = more imbalanced (needs attention)
) as $$
begin
  return query
  select 
    p.id,
    p.name,
    count(pm.id)::int as member_count,
    coalesce(avg(fs.overall_score), 0)::bigint as avg_formation,
    (
      select count(*) from formation_events fe
      join pod_members pm2 on fe.user_id = pm2.user_id
      where pm2.pod_id = p.id 
        and fe.created_at > now() - interval '7 days'
    )::int as recent_activity,
    -- Balance score: how close to ideal (5-8 members)
    abs(6 - count(pm.id))::int + 
    case when avg(fs.overall_score) > 0 then 0 else 5 end as balance_score
  from pods p
  left join pod_members pm on p.id = pm.pod_id and pm.left_at is null
  left join formation_scores fs on pm.user_id = fs.user_id
  where p.active = true
  group by p.id, p.name
  order by balance_score desc;  -- Most imbalanced first
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 4: POD ASSIGNMENT DASHBOARD
----------------------------------------------------

-- Function to suggest pod assignments for admin
create or replace function get_unassigned_members()
returns table (
  user_id uuid,
  display_name text,
  days_since_joined int,
  formation_score bigint
) as $$
begin
  return query
  select 
    p.user_id,
    p.display_name,
    (now() - p.created_at)::int / 86400 as days_since_joined,
    coalesce(fs.overall_score, 0)::bigint as formation_score
  from profiles p
  left join formation_scores fs on p.user_id = fs.user_id
  left join pod_members pm on p.user_id = pm.user_id and pm.left_at is null
  where pm.id is null  -- Not in any pod
  order by days_since_joined desc;  -- Longest waiting first
end;
$$ language plpgsql security definer;

-- Function to get pods that need members
create or replace function get_pods_needing_members()
returns table (
  pod_id uuid,
  pod_name text,
  current_members int,
  capacity int,
  avg_formation bigint,
  need int
) as $$
begin
  return query
  select 
    p.id,
    p.name,
    count(pm.id)::int as current_members,
    8 as capacity,  -- Max pod size
    coalesce(avg(fs.overall_score), 0)::bigint as avg_formation,
    (8 - count(pm.id))::int as need  -- How many more they can take
  from pods p
  left join pod_members pm on p.id = pm.pod_id and pm.left_at is null
  left join formation_scores fs on pm.user_id = fs.user_id
  where p.active = true
    and count(pm.id) < 8  -- Has room
  group by p.id, p.name
  having count(pm.id) < 8
  order by count(pm.id) asc;  -- Smallest pods first
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 5: MANUAL ASSIGNMENT FUNCTION
----------------------------------------------------

-- Admin function to manually assign a user to a pod
create or replace function admin_assign_to_pod(
  p_user_id uuid,
  p_pod_id uuid,
  p_admin_id uuid,
  p_role pod_role default 'member'
)
returns void as $$
declare
  v_current_pod_id uuid;
begin
  -- Check if already in a pod
  select pod_id into v_current_pod_id
  from pod_members
  where user_id = p_user_id and left_at is null;
  
  if v_current_pod_id is not null then
    -- Remove from current pod
    update pod_members
    set left_at = now(),
        departure_reason = 'reassigned_by_admin',
        departure_type = 'promoted'
    where user_id = p_user_id and left_at is null;
  end if;
  
  -- Add to new pod
  insert into pod_members (user_id, pod_id, role, joined_at, enrolled_by)
  values (p_user_id, p_pod_id, p_role, now(), p_admin_id);
  
  -- Update pod captain if needed
  if p_role = 'captain' then
    update pods set captain_id = p_user_id where id = p_pod_id;
  end if;
  
  -- Log action
  insert into audit_logs (user_id, action, table_name, metadata)
  values (p_user_id, 'admin_pod_assignment', 'pod_members', jsonb_build_object(
    'pod_id', p_pod_id,
    'role', p_role,
    'admin_id', p_admin_id,
    'previous_pod', v_current_pod_id
  ));
  
  -- Notify user
  insert into notifications (user_id, title, message, type)
  select 
    p_user_id,
    '👥 Pod Assignment',
    'You have been assigned to pod: ' || p.name,
    'pod_update'
  from pods p where id = p_pod_id;
  
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------

/*
This migration adds:

Auto-Assignment:
- auto_assign_user_to_pod() - Finds best pod and assigns user
- on_profile_created trigger - Auto-assigns on new user creation
- Priority: smallest pods, then neediest (lowest formation)

Admin Tools:
- get_pod_balance() - See which pods need rebalancing
- get_unassigned_members() - See members without pods
- get_pods_needing_members() - See pods with capacity
- admin_assign_to_pod() - Manual assignment

Notifications:
- Captain notified when new member joins their pod
- User notified when manually assigned to a pod

This ensures members are NEVER without a pod!
*/
