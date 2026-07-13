# The Argent Order
## Technical Architecture

Version: 1.0

Status: Canonical Architecture

---

# Purpose

This document defines the complete technical architecture of The Argent Order.

It translates the mission, formation system, campaigns, brotherhood model, and growth engine into software.

The primary goal is not building features.

The primary goal is enabling transformation at scale.

Every table, API, page, and service must support:

Faith

Discipline

Brotherhood

Building

Truth

---

# Technology Stack

Frontend

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- React Query
- React Hook Form
- Zod

Backend

- Supabase

Services

- Postgres
- Auth
- Storage
- Realtime
- Edge Functions

Infrastructure

- Vercel
- Supabase

Email

- Beehiiv (for email campaigns)
- Supabase (for subscriber storage)

Discord

- Custom TypeScript Bot

Analytics

- PostHog

Monitoring

- Sentry

AI

- OpenAI
- Future Provider Abstraction Layer

---

# System Architecture

Website

↓

Auth

↓

Portal

↓

Campaign Engine

↓

Formation Engine

↓

Brotherhood Engine

↓

Achievement Engine

↓

Analytics Engine

↓

Discord Integration

---

# Core Domains

The platform consists of 12 domains.

Identity

Formation

Campaigns

Brotherhood

Reviews

Achievements

Projects

Notifications

Content

Administration

Analytics

Leadership

---

# Authentication

Provider:

Supabase Auth

Methods:

- Email
- Google
- Discord (future)

---

# User Lifecycle

Visitor

↓

Email Subscriber

↓

Portal User

↓

Discord Member

↓

Initiate

↓

Brother

↓

Veteran

↓

Captain

↓

Officer

↓

Mentor

↓

Steward

---

# Database Design Principles

Never store calculated values unnecessarily.

Use event-driven updates.

Track historical data.

Everything important is auditable.

Soft delete where appropriate.

Never lose formation history.

---

====================================================
IDENTITY DOMAIN
====================================================

# profiles

id uuid pk

user_id uuid

email

display_name

bio

avatar_url

timezone

country

created_at

updated_at

---

# ranks

id

name

order

description

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

# user_ranks

id

user_id

rank_id

assigned_by

assigned_at

---

====================================================
FORMATION DOMAIN
====================================================

# formation_pillars

id

name

slug

---

Faith

Discipline

Brotherhood

Building

Truth

---

# formation_scores

id

user_id

faith_score

discipline_score

brotherhood_score

building_score

truth_score

overall_score

updated_at

---

# formation_events

id

user_id

pillar

points

reason

metadata

created_at

---

This table powers all progression.

Never directly edit scores.

Always generate events.

---

# formation_levels

id

level

name

description

---

Foundation

Discipline

Brotherhood

Leadership

Stewardship

---

# user_formation_levels

id

user_id

formation_level_id

assigned_at

---

====================================================
RULE OF LIFE DOMAIN
====================================================

# rules_of_life

id

user_id

version

active

created_at

updated_at

---

# formation_pillars

id

name

slug

description

icon

color

sort_order

---

# formation_milestones

id

name

slug

description

pillar

requirement_type

requirement_value

points

icon

---

# user_formation_milestones

id

user_id

milestone_id

achieved_at

---

# examen_entries

id

user_id

went_well

failed

saw_god

improve_tomorrow

created_at

---

# formation_snapshots

id

user_id

snapshot_date

data

---

# rule_categories

id

name

order

---

Prayer

Fitness

Work

Learning

Family

Rest

---

# rule_items

id

rule_id

category_id

title

description

frequency

target

---

# rule_logs

id

user_id

rule_item_id

completed

logged_at

---

====================================================
CAMPAIGN DOMAIN
====================================================

# campaigns

id

slug

title

description

campaign_type

difficulty

duration_days

active

created_at

---

# campaign_tasks

id

campaign_id

title

description

task_type

points

required

---

# campaign_enrollments

id

user_id

campaign_id

status

started_at

completed_at

completion_percent

---

# campaign_progress

id

enrollment_id

task_id

completed

completed_at

---

# campaign_reviews

id

campaign_id

user_id

reflection

rating

created_at

---

====================================================
BROTHERHOOD DOMAIN
====================================================

# pods

id

name

description

captain_id

mentor_id

created_at

---

# pod_members

id

pod_id

user_id

joined_at

---

# pod_meetings

id

pod_id

scheduled_at

notes

attendance_count

---

# pod_attendance

id

meeting_id

user_id

attended

---

# mentorships

id

mentor_id

mentee_id

started_at

ended_at

---

# leadership_reviews

id

reviewer_id

reviewee_id

period_start

period_end

strengths

areas_for_growth

rating

created_at

---

# promotion_recommendations

id

recommender_id

candidate_id

current_rank

recommended_rank

reason

status

reviewed_by

reviewed_at

created_at

---

====================================================
JOURNAL DOMAIN
====================================================

# journal_entries

id

user_id

title

content

visibility

created_at

---

# examens

id

user_id

went_well

failed

saw_god

improve_tomorrow

created_at

---

# gratitude_entries

id

user_id

content

created_at

---

====================================================
REVIEWS DOMAIN
====================================================

# weekly_reviews

id

user_id

wins

failures

lessons

goals

created_at

---

# monthly_reviews

id

user_id

content

created_at

---

# quarterly_reviews

id

user_id

content

created_at

---

# annual_reviews

id

user_id

content

created_at

---

====================================================
ACHIEVEMENTS DOMAIN
====================================================

# achievements

id

name

slug

description

icon

category

points

---

# user_achievements

id

user_id

achievement_id

earned_at

---

# certifications

id

name

slug

description

---

# user_certifications

id

user_id

certification_id

earned_at

---

====================================================
BUILDER DOMAIN
====================================================

# projects

id

user_id

title

description

status

repository_url

website_url

started_at

completed_at

---

# project_updates

id

project_id

content

created_at

---

# project_milestones

id

project_id

title

completed

completed_at

---

# project_showcases

id

user_id

title

description

image_url

demo_url

repo_url

created_at

---

====================================================
XP DOMAIN
====================================================

# xp_events

id

user_id

amount

reason

metadata

created_at

---

# user_levels

id

user_id

level

total_xp

updated_at

---

====================================================
NOTIFICATIONS DOMAIN
====================================================

# notifications

id

user_id

title

message

type

read

created_at

---

====================================================
CONTENT DOMAIN
====================================================

# articles

id

title

slug

content

status

published_at

---

# newsletters

id

title

issue_number

published_at

---

====================================================
ADMIN DOMAIN
====================================================

# moderation_actions

id

target_user

actor_user

action

reason

created_at

---

# audit_logs

id

actor_id

entity

entity_id

action

metadata

created_at

---

====================================================
DISCORD DOMAIN
====================================================

# discord_accounts

id

user_id

discord_id

username

linked_at

---

# discord_roles

id

discord_role_id

name

---

# discord_sync_events

id

user_id

event_type

payload

processed

created_at

---

# discord_link_codes

id

code

user_id

expires_at

used

created_at

---

====================================================
ANALYTICS DOMAIN
====================================================

# analytics_events

id

user_id

event_name

properties

created_at

---

Examples

campaign_joined

campaign_completed

pod_attended

review_completed

project_launched

achievement_earned

---

# API STRUCTURE

/api

/auth

/campaigns

/formation

/rule-of-life

/pods

/projects

/reviews

/journal

/achievements

/admin

/analytics

/discord

---

# Next.js App Structure

/app

/(marketing)

    page.tsx

    /join

    /mission

    /testimonies

/(portal)

    /dashboard

    /campaigns

    /formation

    /rule-of-life

    /builder-hall

    /journal

    /reviews

    /brotherhood

    /achievements

    /profile

/admin

---

# Discord Bot Architecture

Features

Role Sync

Campaign Sync

Pod Reminders

Prayer Reminders

Roll Call Tracking

Event Scheduling

Achievement Announcements

Leaderboard Updates

---

Commands

/pray

/grind

/checkin

/streak

/profile

/pod

/campaign

/review

---

# AI Layer

Future Services

AI Rule Of Life Builder

AI Weekly Review Assistant

AI Formation Coach

AI Journal Reflection Assistant

AI Project Coach

AI Accountability Assistant

---

Important:

AI never replaces

Mentors

Pods

Brotherhood

Leadership

AI assists.

Humans lead.

---

# RLS Philosophy

Users can access:

Their own records.

Captains can access:

Pod-related records.

Mentors can access:

Assigned mentees.

Admins can access:

Operational data.

System roles only access what is required.

Least privilege everywhere.

---

# Non-Negotiable Technical Principles

1. Event Driven

Track actions as events.

2. Auditable

Every important action logged.

3. Historical

Never destroy formation history.

4. Mobile First

Most usage will be mobile.

5. Fast

Dashboard under 1 second.

6. Scalable

Designed for 10,000+ members.

7. Formation First

Every feature must support transformation.

---

# Final Principle

The Portal is not a productivity app.

The Portal is not a social network.

The Portal is not a course platform.

The Portal is a Catholic Formation Operating System for Builders.

Every technical decision must support that purpose.
