# The Argent Order

## Discord Bot Architecture

Version: 1.0

Status: Canonical Discord Architecture

---

# Purpose

The Discord Bot is not a moderation bot.

The Discord Bot is not a utility bot.

The Discord Bot is not a fun bot.

The Discord Bot is the operational layer of The Argent Order.

Its purpose is to connect:

Portal

↓

Formation

↓

Brotherhood

↓

Discord

↓

Leadership

Every major member action should eventually flow through either:

The Portal

or

The Bot

---

# Core Principles

## Principle 1

Discord is the Brotherhood Layer.

Portal is the Formation Layer.

---

Discord handles:

Conversation

Brotherhood

Accountability

Discussion

Events

Prayer Requests

Community

---

Portal handles:

Campaigns

Rule Of Life

Formation

Reviews

Progress

Projects

Analytics

---

The bot synchronizes both worlds.

---

## Principle 2

Discord is not the source of truth.

The database is.

The bot reads and writes to the platform.

---

Portal Database

↓

API

↓

Discord Bot

↓

Discord

---

Never allow Discord state to become the primary source.

---

## Principle 3

The bot exists to create action.

Not engagement.

Not activity.

Action.

---

# Technical Stack

Language

TypeScript

---

Framework

Discord.js

---

Database

Supabase

---

Hosting

Railway

or

Fly.io

or

VPS

---

Logging

Sentry

---

Monitoring

PostHog

---

# Architecture

Discord

↓

Discord Bot

↓

Internal API

↓

Supabase

↓

Portal

---

# Bot Modules

The bot consists of 10 major modules.

Authentication

Role Sync

Formation

Campaigns

Pods

Projects

Events

Prayer

Leadership

Administration

---

Purpose:

Link Discord account to Portal account.

---

Flow

Member joins Discord

↓

Runs

/link

↓

Receives secure code

↓

Portal verifies code

↓

Discord account linked

↓

Roles synchronized

---

Commands

/link

/unlink

/profile

---

Database

discord_accounts

discord_sync_events

---

Purpose:

Keep Discord roles synchronized with portal state.

---

Portal Rank

↓

Discord Role

---

Examples

Initiate

Brother

Veteran

Captain

Officer

Mentor

Steward

---

Events

Promotion

Demotion

Certification

Campaign Completion

---

Commands

/sync

---

Automations

Role updates

Nickname updates

Welcome assignment

---

Purpose

Track formation actions directly from Discord.

---

Commands

/pray

/scripture

/mass

/rosary

/checkin

/examen

---

Example

/pray

Duration: 20

Type: Mental Prayer

---

Creates

formation_event

analytics_event

xp_event

---

Portal updates instantly.

---

Purpose

Campaign participation through Discord.

---

Commands

/campaign list

/campaign join

/campaign leave

/campaign progress

/campaign complete

---

Example

/campaign join foundation

↓

campaign_enrollment created

↓

progress tracking begins

---

Campaign reminders

Automatic

---

Purpose

Run accountability pods.

---

Commands

/pod

/pod goals

/pod wins

/pod meeting

/pod attendance

/pod prayer

---

Features

Weekly reminders

Attendance tracking

Meeting scheduling

Goal tracking

Prayer requests

---

Automations

Meeting reminders

Missed meeting alerts

Captain notifications

---

Purpose

Builder Hall integration.

---

Commands

/project create

/project update

/project milestone

/project launch

/project showcase

---

Example

/project milestone

MVP Completed

↓

project milestone created

↓

formation points awarded

↓

announcement generated

---

Purpose

Support spiritual life.

---

Commands

/prayer request

/prayer answered

/prayer list

---

Features

Prayer Wall

Prayer Tracking

Answered Prayer Archive

Pod Prayer Requests

---

Purpose

Manage community events.

---

Commands

/event create

/event join

/event leave

/event attendance

---

Event Types

Rosary

Bible Study

Pod Meeting

Workshop

Builder Session

Q&A

Guest Speaker

---

Purpose

Leadership operations.

---

Commands

/leaderboard

/member review

/recommend promotion

/pod health

/community health

---

Officer Only

Mentor Only

Steward Only

Permissions enforced.

---

Purpose

Moderation and operational control.

---

Commands

/warn

/mute

/kick

/ban

/lockdown

/announcement

---

Audit logs required.

Every action recorded.

---

Automatic announcements.

---

Examples

Campaign completed

Achievement earned

Certification earned

Project launched

Promotion granted

Pod formed

---

Channels

#announcements

#victories

#builder-hall

---

Purpose

Drive consistency.

---

Reminder Types

Daily Rule Of Life

Prayer

Campaign Tasks

Weekly Review

Pod Meeting

Project Updates

---

Examples

Brother Joshua

You have not completed your weekly review.

---

Brother Joshua

Your pod meeting begins in 2 hours.

---

Bot actions generate formation events.

---

Example

/pray

↓

formation_event

↓

formation_scores update

↓

xp_event

↓

achievement checks

---

Everything flows through formation_events.

---

Purpose

Award recognition.

---

Examples

7 Day Prayer Streak

30 Day Rule Of Life

Campaign Completion

Project Launch

Mentor Certification

---

Triggered automatically.

---

Track:

Commands Used

Campaign Participation

Pod Attendance

Project Creation

Prayer Activity

Review Completion

Retention

---

Stored in:

analytics_events

---

Required Channels

#welcome

#rules

#announcements

#roll-call

#general

#faith-and-truth

#prayer-requests

#formation

#campaigns

#builder-hall

#project-showcase

#wins

#resources

#pod-lobbies

#events

#leadership

#officer-hq

---

Private Categories

Officer HQ

Mentor HQ

Steward HQ

Pod Voice Channels

---

Deployment

Railway

Preferred

---

Required Secrets

DISCORD_TOKEN

DISCORD_CLIENT_ID

SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY

OPENAI_API_KEY

SENTRY_DSN

POSTHOG_API_KEY

---

AI Review Assistant

AI Formation Coach

AI Accountability Assistant

AI Project Coach

AI Rule Of Life Builder

AI Mentor Assistant

---

AI assists.

Leaders lead.

Brothers support brothers.

The Order remains fundamentally human.

---

# Final Principle

The Discord Bot is not a chatbot.

It is the operational nervous system of The Argent Order.

Its job is to create:

Prayer

Discipline

Brotherhood

Building

Leadership

Action

at scale.

# /*

THE ARGENT ORDER
ROW LEVEL SECURITY
Version: 1.0

Purpose:
Protect member data while enabling
brotherhood, mentorship, leadership,
and administrative functions.

Security Model:

Member
→ Pod Captain
→ Mentor
→ Officer
→ Steward

Principle:
Least Privilege

# Nobody sees data they do not need.

*/

---

## -- ENABLE RLS

alter table profiles enable row level security;
alter table user_ranks enable row level security;

alter table formation_events enable row level security;
alter table formation_scores enable row level security;
alter table formation_milestones enable row level security;
alter table user_formation_milestones enable row level security;

alter table rule_of_life enable row level security;
alter table rule_items enable row level security;
alter table rule_logs enable row level security;

alter table campaigns enable row level security;
alter table campaign_phases enable row level security;
alter table campaign_tasks enable row level security;
alter table campaign_enrollments enable row level security;
alter table campaign_progress enable row level security;
alter table campaign_reviews enable row level security;

alter table pods enable row level security;
alter table pod_members enable row level security;
alter table pod_meetings enable row level security;
alter table pod_attendance enable row level security;
alter table mentorships enable row level security;

alter table projects enable row level security;
alter table project_milestones enable row level security;
alter table project_updates enable row level security;
alter table project_showcases enable row level security;

alter table journal_entries enable row level security;
alter table examen_entries enable row level security;
alter table gratitude_entries enable row level security;

alter table weekly_reviews enable row level security;
alter table monthly_reviews enable row level security;
alter table quarterly_reviews enable row level security;
alter table annual_reviews enable row level security;

alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table certifications enable row level security;
alter table user_certifications enable row level security;

alter table leadership_appointments enable row level security;
alter table leadership_reviews enable row level security;
alter table promotion_recommendations enable row level security;

alter table discord_accounts enable row level security;
alter table discord_roles enable row level security;
alter table discord_sync_events enable row level security;

alter table notifications enable row level security;

alter table analytics_events enable row level security;
alter table daily_snapshots enable row level security;
alter table weekly_snapshots enable row level security;
alter table monthly_snapshots enable row level security;

---

## -- HELPER FUNCTIONS

create or replace function current_user_id()
returns uuid
language sql
stable
as $$
select auth.uid();
$$;

---

## -- PROFILES

create policy "users_read_own_profile"
on profiles
for select
using (
user_id = auth.uid()
);

create policy "users_update_own_profile"
on profiles
for update
using (
user_id = auth.uid()
);

create policy "users_insert_own_profile"
on profiles
for insert
with check (
user_id = auth.uid()
);

---

## -- FORMATION EVENTS

create policy "users_read_own_formation_events"
on formation_events
for select
using (
user_id = auth.uid()
);

create policy "users_insert_own_formation_events"
on formation_events
for insert
with check (
user_id = auth.uid()
);

---

## -- FORMATION SCORES

create policy "users_read_own_scores"
on formation_scores
for select
using (
user_id = auth.uid()
);

---

## -- RULE OF LIFE

create policy "users_manage_own_rules"
on rule_of_life
for all
using (
user_id = auth.uid()
);

create policy "users_manage_own_rule_logs"
on rule_logs
for all
using (
user_id = auth.uid()
);

---

## -- CAMPAIGNS

create policy "campaigns_public_read"
on campaigns
for select
using (true);

create policy "campaign_tasks_public_read"
on campaign_tasks
for select
using (true);

create policy "users_manage_campaign_enrollment"
on campaign_enrollments
for all
using (
user_id = auth.uid()
);

create policy "users_manage_campaign_progress"
on campaign_progress
for all
using (
enrollment_id in (
select ce.id
from campaign_enrollments ce
where ce.user_id = auth.uid()
)
);

---

## -- POD MEMBERSHIP

create policy "users_view_own_pod_membership"
on pod_members
for select
using (
user_id = auth.uid()
);

---

## -- POD VISIBILITY

create policy "members_view_same_pod_members"
on pod_members
for select
using (
pod_id in (
select pod_id
from pod_members
where user_id = auth.uid()
)
);

---

## -- POD MEETINGS

create policy "members_view_pod_meetings"
on pod_meetings
for select
using (
pod_id in (
select pod_id
from pod_members
where user_id = auth.uid()
)
);

---

## -- POD ATTENDANCE

create policy "members_view_pod_attendance"
on pod_attendance
for select
using (
meeting_id in (
select pm.id
from pod_meetings pm
join pod_members p
on p.pod_id = pm.pod_id
where p.user_id = auth.uid()
)
);

---

## -- MENTORSHIPS

create policy "mentor_or_mentee_access"
on mentorships
for select
using (
mentor_id = auth.uid()
or
mentee_id = auth.uid()
);

---

## -- PROJECTS

create policy "users_manage_own_projects"
on projects
for all
using (
user_id = auth.uid()
);

create policy "users_manage_own_project_updates"
on project_updates
for all
using (
project_id in (
select id
from projects
where user_id = auth.uid()
)
);

---

## -- JOURNAL

create policy "users_manage_own_journal"
on journal_entries
for all
using (
user_id = auth.uid()
);

create policy "users_manage_own_examen"
on examen_entries
for all
using (
user_id = auth.uid()
);

create policy "users_manage_own_gratitude"
on gratitude_entries
for all
using (
user_id = auth.uid()
);

---

## -- REVIEWS

create policy "users_manage_own_weekly_reviews"
on weekly_reviews
for all
using (
user_id = auth.uid()
);

create policy "users_manage_own_monthly_reviews"
on monthly_reviews
for all
using (
user_id = auth.uid()
);

create policy "users_manage_own_quarterly_reviews"
on quarterly_reviews
for all
using (
user_id = auth.uid()
);

create policy "users_manage_own_annual_reviews"
on annual_reviews
for all
using (
user_id = auth.uid()
);

---

## -- ACHIEVEMENTS

create policy "users_view_own_achievements"
on user_achievements
for select
using (
user_id = auth.uid()
);

create policy "achievements_public_read"
on achievements
for select
using (true);

---

## -- CERTIFICATIONS

create policy "users_view_own_certifications"
on user_certifications
for select
using (
user_id = auth.uid()
);

---

## -- NOTIFICATIONS

create policy "users_manage_notifications"
on notifications
for all
using (
user_id = auth.uid()
);

---

## -- DISCORD

create policy "users_manage_discord_account"
on discord_accounts
for all
using (
user_id = auth.uid()
);

---

## -- ANALYTICS

create policy "users_view_own_daily_snapshots"
on daily_snapshots
for select
using (
user_id = auth.uid()
);

create policy "users_view_own_weekly_snapshots"
on weekly_snapshots
for select
using (
user_id = auth.uid()
);

create policy "users_view_own_monthly_snapshots"
on monthly_snapshots
for select
using (
user_id = auth.uid()
);

---

## -- SERVICE ROLE OVERRIDE

create policy "service_role_all_profiles"
on profiles
for all
using (
auth.role() = 'service_role'
);

create policy "service_role_all_formation_events"
on formation_events
for all
using (
auth.role() = 'service_role'
);

create policy "service_role_all_projects"
on projects
for all
using (
auth.role() = 'service_role'
);

create policy "service_role_all_reviews"
on weekly_reviews
for all
using (
auth.role() = 'service_role'
);

create policy "service_role_all_notifications"
on notifications
for all
using (
auth.role() = 'service_role'
);

---

## -- FUTURE ROLE SYSTEM

/*
Future hierarchy:

Brother
Captain
Officer
Mentor
Steward

Will be implemented through:

user_roles
role_permissions

and custom postgres functions:

is_captain()
is_mentor()
is_officer()
is_steward()

These functions will later power:

* Pod moderation
* Leadership dashboards
* Formation oversight
* Community management
* Analytics visibility

without rewriting policies.
*/

---

## -- FINAL SECURITY PRINCIPLE

/*
Members own their data.

Mentors only see assigned members.

Captains only see pod data.

Officers see operational data.

Stewards see institutional data.

Service role powers automation.

No member should ever gain access
to another member's private data
without a legitimate formation,
leadership, or administrative reason.
*/
