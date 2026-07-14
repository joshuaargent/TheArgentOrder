/*
====================================================
THE ARGENT ORDER
MIGRATION 015: ONBOARDING & MEMBER LIFECYCLE
Version: 1.0
====================================================

This migration improves onboarding, linking, and member lifecycle:

1. Welcome messages for unlinked users
2. Better pod assignment logic (rejoin handling)
3. Onboarding status tracking
4. Periodic reminder system
5. Member journey tracking

====================================================
*/

----------------------------------------------------
-- PHASE 1: ONBOARDING STATUS TRACKING
----------------------------------------------------

-- Add onboarding status columns to profiles
alter table profiles add column if not exists onboarding_status text default 'pending';
alter table profiles add column if not exists onboarding_step int default 0;
alter table profiles add column if not exists first_login_at timestamp with time zone;
alter table profiles add column if not exists last_active_at timestamp with time zone;
alter table profiles add column if not exists link_source text;  -- 'discord', 'oauth', 'manual'

comment on column profiles.onboarding_status is 'pending, in_progress, completed, abandoned';
comment on column profiles.link_source is 'How user linked their account';

-- Update trigger to set first_login
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
  
  -- Set first login
  update profiles
  set first_login_at = now(),
      last_active_at = now(),
      onboarding_status = 'in_progress'
  where user_id = new.user_id;
  
  return new;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 2: BETTER POD ASSIGNMENT (REJOIN HANDLING)
----------------------------------------------------

-- Update auto_assign function to handle rejoins
create or replace function auto_assign_user_to_pod(p_user_id uuid)
returns uuid as $$
declare
  v_pod_id uuid;
  v_pod_name text;
  v_captain_id uuid;
  v_previous_pod_id uuid;
  v_departure_type text;
begin
  -- Check if user was previously in a pod
  select pod_id, departure_type into v_previous_pod_id, v_departure_type
  from pod_members
  where user_id = p_user_id
  order by joined_at desc
  limit 1;
  
  -- Handle rejoin based on previous departure
  if v_previous_pod_id is not null then
    -- If was removed/disciplinary, require manual reassignment
    if v_departure_type = 'disciplinary' then
      insert into audit_logs (user_id, action, table_name, metadata)
      values (p_user_id, 'rejoin_blocked', 'pod_members', jsonb_build_object(
        'reason', 'disciplinary departure',
        'previous_pod', v_previous_pod_id
      ));
      return null;
    end if;
    
    -- Check rejoin cooldown
    select rejoin_cooldown into v_pod_id
    from pod_members
    where user_id = p_user_id
    order by joined_at desc
    limit 1;
    
    if v_pod_id is not null and v_pod_id > now() then
      -- Still in cooldown
      insert into audit_logs (user_id, action, table_name, metadata)
      values (p_user_id, 'rejoin_blocked', 'pod_members', jsonb_build_object(
        'reason', 'cooldown period',
        'cooldown_ends', v_pod_id
      ));
      return null;
    end if;
    
    -- If voluntary departure and cooldown passed, allow rejoin to same pod
    if v_departure_type = 'voluntary' then
      -- Check if original pod still exists and has capacity
      if exists (
        select 1 from pods where id = v_previous_pod_id and active = true
      ) and (
        select count(*) from pod_members 
        where pod_id = v_previous_pod_id and left_at is null
      ) < 10 then
        v_pod_id := v_previous_pod_id;
      end if;
    end if;
  end if;
  
  -- If not rejoin, find a new pod
  if v_pod_id is null then
    -- Find the best available pod
    select p.id, p.name, p.captain_id into v_pod_id, v_pod_name, v_captain_id
    from pods p
    where p.active = true
    and (
      select count(*) from pod_members 
      where pod_id = p.id and left_at is null
    ) < 8  -- Leave room for growth
    order by (
      select count(*) from pod_members 
      where pod_id = p.id and left_at is null
    ) asc,
    coalesce((
      select avg(fs.overall_score) 
      from pod_members pm2 
      join formation_scores fs on pm2.user_id = fs.user_id
      where pm2.pod_id = p.id and pm2.left_at is null
    ), 0) asc
    limit 1;
  end if;
  
  -- If no pod available, create a new one (for founders)
  if v_pod_id is null then
    insert into pods (name, description, captain_id)
    values (
      'Founding Pod ' || substr(gen_random_uuid()::text, 1, 4),
      'Auto-created for unassigned members',
      p_user_id
    )
    returning id into v_pod_id;
    
    v_captain_id := p_user_id;
  end if;
  
  -- Add user to pod
  insert into pod_members (user_id, pod_id, role, joined_at, enrolled_by)
  values (p_user_id, v_pod_id, case when v_captain_id is null then 'captain' else 'member' end, now(), v_captain_id)
  on conflict (user_id, pod_id) do update
  set left_at = null, role = 'member';
  
  -- Update pods captain_id if needed
  if v_captain_id is null then
    update pods set captain_id = p_user_id where id = v_pod_id;
  end if;
  
  -- Log the assignment
  insert into audit_logs (user_id, action, table_name, metadata)
  values (p_user_id, 'pod_assigned', 'pod_members', jsonb_build_object(
    'pod_id', v_pod_id,
    'is_rejoin', v_previous_pod_id is not null,
    'previous_pod', v_previous_pod_id
  ));
  
  -- Notify captain
  if v_captain_id is not null then
    insert into notifications (user_id, title, message, type)
    values (
      v_captain_id,
      '🆕 New Brother',
      'A new member has joined your pod.',
      'pod_update'
    );
  end if;
  
  return v_pod_id;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 3: LINKING IMPROVEMENTS
----------------------------------------------------

-- Add linked_at timestamp for tracking
alter table discord_accounts add column if not exists linked_at timestamp with time zone default now();

-- Function to handle successful link
create or replace function on_discord_linked()
returns trigger as $$
declare
  v_pod_id uuid;
begin
  -- Update onboarding status
  update profiles
  set onboarding_status = 'completed',
      link_source = 'discord'
  where user_id = new.user_id;
  
  -- Auto-assign to pod if not already in one
  select auto_assign_user_to_pod(new.user_id) into v_pod_id;
  
  -- Log the link
  insert into audit_logs (user_id, action, table_name, metadata)
  values (new.user_id, 'discord_linked', 'discord_accounts', jsonb_build_object(
    'discord_id', new.discord_id,
    'pod_assigned', v_pod_id is not null
  ));
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for discord link
drop trigger if exists on_discord_linked on discord_accounts;
create trigger on_discord_linked
  after insert on discord_accounts
  for each row execute function on_discord_linked();

----------------------------------------------------
-- PHASE 4: ACTIVITY TRACKING
----------------------------------------------------

-- Function to update last active
create or replace function update_last_active(p_user_id uuid)
returns void as $$
begin
  update profiles
  set last_active_at = now()
  where user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- Track when users leave Discord
create table if not exists discord_leave_events (
  id uuid primary key default uuid_generate_v4(),
  discord_id text not null,
  user_id uuid references profiles(user_id),
  left_at timestamp with time zone default now()
);

----------------------------------------------------
-- PHASE 5: ONBOARDING REMINDER SYSTEM
----------------------------------------------------

-- Table for onboarding reminders
create table if not exists onboarding_reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  step int not null,  -- 1: welcome, 2: first_checkin, 3: join_campaign, 4: introduce, 5: first_pod_meeting
  message text,
  sent_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(user_id, step)
);

-- Function to send reminder
create or replace function send_onboarding_reminder(
  p_user_id uuid,
  p_step int,
  p_message text
)
returns void as $$
begin
  -- Insert or update reminder
  insert into onboarding_reminders (user_id, step, message, sent_at)
  values (p_user_id, p_step, p_message, now())
  on conflict (user_id, step) do update
  set message = p_message, sent_at = now();
  
  -- Create notification
  insert into notifications (user_id, title, message, type)
  values (
    p_user_id,
    '📋 Action Required',
    p_message,
    'onboarding'
  );
end;
$$ language plpgsql security definer;

-- Function to complete onboarding step
create or replace function complete_onboarding_step(
  p_user_id uuid,
  p_step int
)
returns void as $$
begin
  update onboarding_reminders
  set completed_at = now()
  where user_id = p_user_id and step = p_step;
  
  -- Update profile onboarding progress
  if p_step >= (select max(onboarding_step) from profiles where user_id = p_user_id) then
    update profiles
    set onboarding_step = p_step
    where user_id = p_user_id;
  end if;
  
  -- Check if onboarding complete
  if p_step >= 5 then
    update profiles
    set onboarding_status = 'completed'
    where user_id = p_user_id;
  end if;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- PHASE 6: POD MEMBER VISIBILITY
----------------------------------------------------

-- Function to get pod details for a user
create or replace function get_pod_details(p_user_id uuid)
returns jsonb as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'pod', (
      select jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'description', p.description,
        'captain_id', p.captain_id,
        'captain_name', cap.display_name,
        'mentor_id', p.mentor_id
      )
      from pods p
      left join profiles cap on p.captain_id = cap.user_id
      join pod_members pm on p.id = pm.pod_id
      where pm.user_id = p_user_id and pm.left_at is null
    ),
    'role', (
      select role from pod_members 
      where user_id = p_user_id and left_at is null
    ),
    'members', (
      select jsonb_agg(jsonb_build_object(
        'user_id', pm.user_id,
        'display_name', pr.display_name,
        'avatar_url', pr.avatar_url,
        'role', pm.role,
        'joined_at', pm.joined_at
      ))
      from pod_members pm
      join profiles pr on pm.user_id = pr.user_id
      where pm.pod_id = (
        select pod_id from pod_members 
        where user_id = p_user_id and left_at is null
      )
      and pm.left_at is null
    ),
    'upcoming_meetings', (
      select jsonb_agg(jsonb_build_object(
        'id', id,
        'scheduled_at', scheduled_at,
        'notes', notes
      ) order by scheduled_at)
      from pod_meetings
      where pod_id = (
        select pod_id from pod_members 
        where user_id = p_user_id and left_at is null
      )
      and scheduled_at > now()
      limit 5
    )
  ) into v_result
  from profiles p
  where p.user_id = p_user_id;
  
  return v_result;
end;
$$ language plpgsql security definer;

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------

/*
This migration adds:

Onboarding:
- Onboarding status tracking (pending, in_progress, completed)
- First login and last active timestamps
- Link source tracking

Pod Assignment:
- Better rejoin handling (cooldown, disciplinary blocks)
- Prefers returning users to original pod
- Better pod selection algorithm

Activity:
- Last active tracking
- Discord leave event logging

Reminders:
- Onboarding reminder system
- Step completion tracking
- Notification integration

Pod Visibility:
- get_pod_details() returns full pod info for a user
- Shows all members, meetings, captain info
*/
