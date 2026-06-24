# The Argent Order

## API Specification

Version: 2.0

Status: Canonical API Architecture

---

# Purpose

The API is the central nervous system of The Argent Order.

Everything connects through the API.

Portal

↓

API

↓

Database

↓

Discord Bot

↓

Automation

↓

Analytics

---

The API owns business logic.

Not the frontend.

Not Discord.

Not cron jobs.

Not AI systems.

---

# Core Principles

## Principle 1

Database stores data.

API enforces rules.

Frontend displays state.

---

Never allow:

```text
Frontend
↓
Database
```

for business operations.

Always:

```text
Frontend
↓
API
↓
Database
```

---

## Principle 2

Every meaningful action becomes an event.

Examples:

Prayer Logged

Campaign Completed

Project Launched

Pod Meeting Attended

Review Submitted

Promotion Granted

---

Events create:

Formation Points

Achievements

Notifications

Analytics

Progress

---

## Principle 3

One source of truth.

Portal and Discord consume the same API.

---

# Technology

Framework

```text
Next.js Route Handlers
```

or

```text
Express
```

---

Language

```text
TypeScript
```

---

Validation

```text
Zod
```

---

Authentication

```text
Supabase Auth
```

---

Authorization

```text
RLS + API Role Checks
```

---

# API Structure

```text
/api

/auth

/profile

/formation

/campaigns

/rule-of-life

/pods

/projects

/reviews

/journal

/achievements

/certifications

/leadership

/discord

/notifications

/analytics

/admin
```

---

# Authentication Endpoints

## Get Current User

```http
GET /api/auth/me
```

Response

```json
{
  "id": "...",
  "displayName": "Joshua",
  "rank": "Brother"
}
```

---

# Profile Endpoints

## Get Profile

```http
GET /api/profile
```

---

## Update Profile

```http
PATCH /api/profile
```

Request

```json
{
  "displayName": "Joshua",
  "bio": "Builder"
}
```

---

## Get Dashboard

```http
GET /api/profile/dashboard
```

Returns

```json
{
  "formation": {},
  "campaigns": [],
  "projects": [],
  "notifications": []
}
```

---

# Formation Endpoints

## Log Prayer

```http
POST /api/formation/prayer
```

Request

```json
{
  "minutes": 20,
  "type": "Mental Prayer"
}
```

Creates

```text
formation_event
xp_event
analytics_event
```

---

## Log Rosary

```http
POST /api/formation/rosary
```

---

## Log Scripture

```http
POST /api/formation/scripture
```

---

## Log Mass

```http
POST /api/formation/mass
```

---

## Submit Examen

```http
POST /api/formation/examen
```

---

## Get Formation Dashboard

```http
GET /api/formation
```

Returns

```json
{
  "overall": 500,
  "faith": 150,
  "discipline": 120,
  "brotherhood": 80,
  "building": 100,
  "truth": 50
}
```

---

# Rule Of Life Endpoints

## Get Rule

```http
GET /api/rule-of-life
```

---

## Create Rule

```http
POST /api/rule-of-life
```

---

## Add Rule Item

```http
POST /api/rule-of-life/items
```

---

## Complete Rule Item

```http
POST /api/rule-of-life/complete
```

---

## Rule Statistics

```http
GET /api/rule-of-life/stats
```

---

# Campaign Endpoints

## List Campaigns

```http
GET /api/campaigns
```

---

## Get Campaign

```http
GET /api/campaigns/:slug
```

---

## Join Campaign

```http
POST /api/campaigns/:slug/join
```

---

## Leave Campaign

```http
POST /api/campaigns/:slug/leave
```

---

## Complete Task

```http
POST /api/campaigns/task/complete
```

---

## Campaign Progress

```http
GET /api/campaigns/progress
```

---

# Brotherhood Endpoints

## Get Pod

```http
GET /api/pods/current
```

---

## Pod Members

```http
GET /api/pods/members
```

---

## Create Pod Goal

```http
POST /api/pods/goals
```

---

## Create Meeting

```http
POST /api/pods/meetings
```

---

## Attendance

```http
POST /api/pods/attendance
```

---

## Prayer Request

```http
POST /api/pods/prayer
```

---

# Mentorship Endpoints

## Get Mentor

```http
GET /api/mentorship/current
```

---

## Request Mentor

```http
POST /api/mentorship/request
```

---

## Submit Mentorship Review

```http
POST /api/mentorship/review
```

---

# 🛠️ WORKSHOP Endpoints

## Create Project

```http
POST /api/projects
```

---

## Update Project

```http
PATCH /api/projects/:id
```

---

## Create Milestone

```http
POST /api/projects/:id/milestones
```

---

## Complete Milestone

```http
POST /api/projects/milestones/:id/complete
```

---

## Project Showcase

```http
POST /api/projects/:id/showcase
```

---

## Project Feed

```http
GET /api/projects/feed
```

---

# Journal Endpoints

## Create Entry

```http
POST /api/journal
```

---

## List Entries

```http
GET /api/journal
```

---

## Delete Entry

```http
DELETE /api/journal/:id
```

---

# Review Endpoints

## Weekly Review

```http
POST /api/reviews/weekly
```

---

## Monthly Review

```http
POST /api/reviews/monthly
```

---

## Quarterly Review

```http
POST /api/reviews/quarterly
```

---

## Annual Review

```http
POST /api/reviews/annual
```

---

## Review History

```http
GET /api/reviews
```

---

# Achievement Endpoints

## List Achievements

```http
GET /api/achievements
```

---

## My Achievements

```http
GET /api/achievements/me
```

---

## Achievement Detail

```http
GET /api/achievements/:slug
```

---

# Certification Endpoints

## Available Certifications

```http
GET /api/certifications
```

---

## Earned Certifications

```http
GET /api/certifications/me
```

---

# Leadership Endpoints

## Leadership Dashboard

```http
GET /api/leadership
```

Permission Required

```text
Captain+
```

---

## Promotion Recommendation

```http
POST /api/leadership/recommend
```

---

## Community Health

```http
GET /api/leadership/health
```

---

## Pod Health

```http
GET /api/leadership/pods
```

---

# Discord Endpoints

## Link Discord

```http
POST /api/discord/link
```

---

## Verify Link

```http
POST /api/discord/verify
```

---

## Sync Roles

```http
POST /api/discord/sync
```

---

## Discord Profile

```http
GET /api/discord
```

---

# Notification Endpoints

## My Notifications

```http
GET /api/notifications
```

---

## Mark Read

```http
POST /api/notifications/read
```

---

# Analytics Endpoints

## Personal Analytics

```http
GET /api/analytics/me
```

---

## Formation Analytics

```http
GET /api/analytics/formation
```

---

## Project Analytics

```http
GET /api/analytics/projects
```

---

# Administration Endpoints

Permission

```text
Officer+
```

---

## User Search

```http
GET /api/admin/users
```

---

## User Detail

```http
GET /api/admin/users/:id
```

---

## Create Announcement

```http
POST /api/admin/announcement
```

---

## Grant Achievement

```http
POST /api/admin/achievement
```

---

## Grant Certification

```http
POST /api/admin/certification
```

---

## Promote User

```http
POST /api/admin/promote
```

---

# Event Pipeline

Every meaningful action generates events.

Example

```text
POST /formation/prayer

↓

formation_event

↓

xp_event

↓

analytics_event

↓

achievement_check

↓

notification
```

---

# Service Layer Architecture

```text
Controllers

↓

Services

↓

Repositories

↓

Database
```

Never:

```text
Controller

↓

Database
```

---

# Future AI Services

## Formation Coach

```http
POST /api/ai/formation-coach
```

---

## Rule Builder

```http
POST /api/ai/rule-builder
```

---

## Project Coach

```http
POST /api/ai/project-coach
```

---

## Accountability Coach

```http
POST /api/ai/accountability
```

---

## Review Assistant

```http
POST /api/ai/review
```

---

# Final Principle

The API is the authority of the system.

The Portal displays.

The Discord Bot executes.

The Database stores.

The API governs.

All formation, brotherhood, leadership, and builder systems ultimately flow through the API.
