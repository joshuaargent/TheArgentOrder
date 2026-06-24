# The Argent Order

## Implementation Roadmap

Version: 1.0

Status: Master Build Order

---

# Purpose

This document defines the exact build sequence for the entire system.

Not ideas.

Not architecture.

Execution order.

If you follow this incorrectly, the system will break structurally.

---

# Core Rule

You do NOT build features first.

You build the foundation first.

Order of operations is non-negotiable.

---

# PHASE 0 — FOUNDATION SETUP

## 0.1 Repository Initialization

```text id="repo1"
/argent-order
  /apps
    /web (Next.js portal)
    /bot (Discord bot)
  /packages
    /shared
    /ui
    /types
  /infra
    /supabase
    /docker
```

---

## 0.2 Tooling Setup

Install:

```text id="tools1"
Node.js
TypeScript
npm (comes with Node.js)
Supabase CLI
Docker
```

---

## 0.3 Environment Setup

```env id="env1"
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
OPENAI_API_KEY=
```

---

# PHASE 1 — DATABASE (CRITICAL PATH)

## 1.1 Deploy Schema

Execute:

```text id="db1"
11_DATABASE_SCHEMA.sql
```

---

## 1.2 Enable RLS

Execute:

```text id="db2"
12_RLS_POLICIES.sql
```

---

## 1.3 Seed Core Data

Insert:

```text id="seed1"
Ranks
Formation Levels
Achievements (starter set)
Campaign templates
```

---

## 1.4 Validate

Ensure:

* User creation works
* Formation events insert correctly
* RLS blocks cross-user access
* Campaign tables accessible

---

# PHASE 2 — AUTH SYSTEM

## 2.1 Supabase Auth Setup

* Email login
* OAuth optional later

---

## 2.2 Profile Creation Hook

On signup:

```text id="auth1"
Create profiles row
Create formation_scores row
Assign Initiate rank
```

---

## 2.3 Middleware Protection

Protect all routes:

```text id="auth2"
/dashboard
/formation
/campaigns
```

---

# PHASE 3 — CORE API LAYER

## 3.1 Implement Base API Structure

Build:

```text id="api1"
Controllers
Services
Repositories
```

---

## 3.2 Formation Engine

Implement:

```text id="formation1"
POST /formation/prayer
POST /formation/scripture
POST /formation/examen
```

Must:

* Insert formation_event
* Update formation_scores
* Trigger achievements
* Emit analytics event

---

## 3.3 Rule Of Life Engine

* CRUD rules
* Completion tracking
* Streak calculation

---

## 3.4 Campaign Engine

* Join campaign
* Track tasks
* Progress calculation
* Completion rewards

---

# PHASE 4 — DISCORD BOT (CORE OPERATIONS)

## 4.1 Bot Bootstrap

```text id="bot1"
discord.js client
event handlers
command registry
```

---

## 4.2 Authentication Link Flow

```text id="bot2"
/link → generate code → verify → bind discord_id
```

---

## 4.3 Role Sync System

Sync:

* Rank
* Formation level
* Achievements
* Campaign status

---

## 4.4 Formation Commands

```text id="bot3"
/pray
/examen
/scripture
/checkin
```

All must:

→ Call API
→ Not write directly to DB

---

## 4.5 Pod System

* Meetings
* Attendance
* Goals
* Prayer requests

---

# PHASE 5 — FRONTEND PORTAL

## 5.1 App Router Setup

Pages:

```text id="fe1"
/dashboard
/formation
/campaigns
/brotherhood
/builder
/journal
/reviews
```

---

## 5.2 Dashboard (FIRST PRIORITY)

Must show:

* Today’s rule
* Campaign task
* Pod obligation
* Formation score
* Next action

---

## 5.3 Formation UI

* Quick logging
* Score breakdown
* Streak tracking

---

## 5.4 Rule Of Life UI

* Daily checklist
* Completion toggle
* Streak display

---

## 5.5 Campaign UI

* Progress bar
* Tasks list
* Join/leave

---

## 5.6 Builder Hall UI

* Projects
* Milestones
* Launch tracking

---

# PHASE 6 — DISCORD ↔ PORTAL SYNC

## 6.1 Event Sync Pipeline

```text id="sync1"
Discord Bot → API → Database → Portal
```

---

## 6.2 Role Sync Worker

Runs every:

```text id="sync2"
5–15 minutes
```

---

## 6.3 Notification Bridge

* Portal event → Discord message
* Discord action → Portal update

---

# PHASE 7 — ANALYTICS ENGINE

Track:

* Prayer activity
* Rule completion
* Campaign participation
* Project launches
* Retention

---

Store in:

* analytics_events
* snapshots tables

---

# PHASE 8 — GAMIFICATION LAYER

## 8.1 Formation Score Engine

Weighted system:

* Faith
* Discipline
* Brotherhood
* Building
* Truth

---

## 8.2 Achievements

Auto-triggered:

* 7-day streaks
* Campaign completion
* Project launch
* Pod attendance

---

## 8.3 Rankings

* Initiate → Steward ladder

---

# PHASE 9 — LEADERSHIP SYSTEM

Unlocks:

* Pod oversight
* Member reviews
* Promotion system

---

Permissions:

* Captain
* Officer
* Mentor
* Steward

---

# PHASE 10 — AI LAYER (OPTIONAL BUT POWERFUL)

## 10.1 Formation Coach

* Suggest actions
* Detect inactivity
* Recommend discipline resets

---

## 10.2 Rule Builder

* Generates personalized Rule of Life

---

## 10.3 Project Coach

* Helps members ship faster

---

# PHASE 11 — POLISH + LAUNCH

## 11.1 UX Hardening

* Mobile optimization
* Performance tuning
* Error handling

---

## 11.2 Security Audit

* RLS validation
* API abuse prevention
* Discord token safety

---

## 11.3 Beta Launch

* Invite-only onboarding
* Feedback loop

---

# FINAL PRINCIPLE

This system is not built by features.

It is built by dependency order.

If Phase 1 is weak, everything collapses.

If Phase 1 is strong, everything scales.

The goal is not a platform.

The goal is a formation engine that produces disciplined men who act.

---

# DEPLOYMENT ARCHITECTURE

Version: 1.0

Status: Production Infrastructure Blueprint

---

## Infrastructure Philosophy

### Principle 1: Buy Simplicity

Build infrastructure that can easily reach 10,000 users. Scale later.

### Principle 2: Managed Services First

Self-host only when there is a compelling reason. Time spent managing servers is time not spent building formation.

### Principle 3: Operational Requirements

Every component must have: Monitoring, Logging, Backups, Recovery procedures

---

## Production Architecture

```
Users → Cloudflare → Vercel → Next.js Portal → Internal API Layer → Supabase (Postgres, Auth, Storage, Realtime) → Discord Bot → Discord
```

---

## Hosting Platforms

### Frontend: Vercel

Benefits: Automatic Deployments, Preview Deployments, Edge Network, Easy Rollbacks

### Database: Supabase

Responsibilities: Authentication, Postgres, Storage, Realtime, RLS

Requirements: Daily Backups, Point In Time Recovery, Database Monitoring, Connection Monitoring

### Discord Bot: Railway (Preferred)

Alternatives: Fly.io, VPS, DigitalOcean

Requirements: Always On, Auto Restart, Health Checks, Crash Recovery

---

## Domain Architecture

Primary: joshuaargent.com

Subdomains:
* app.joshuaargent.com - Portal
* api.joshuaargent.com - API
* join.joshuaargent.com - Lead Capture
* docs.joshuaargent.com - Public Documentation

---

## Cloudflare Layer

Features: DNS, Caching, DDoS Protection, SSL, Rate Limiting

Required Rules: Protect API, Protect Login, Protect Admin Endpoints

---

## Environment Separation

Development: Local Machine

Staging: Preview Environment

Production: Live Environment

Separate: Database, Storage, Secrets, Discord Applications

---

## Secrets Management

Never store secrets in source control.

Required Secrets:
```
SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_PUBLIC_KEY,
OPENAI_API_KEY, POSTHOG_API_KEY, SENTRY_DSN
```

Storage: Vercel Environment Variables, Railway Environment Variables

---

## CI/CD Pipeline

Flow: Push → GitHub → Tests → Build → Deploy → Health Check → Production

Every PR must: Pass Linting, Pass Type Check, Pass Tests, Build Successfully

---

## Database Migrations

Never modify production manually.

Structure: supabase/migrations/

Examples: 202607010001_initial_schema.sql, 202607020001_add_campaigns.sql

---

## Observability Stack

### Error Monitoring: Sentry

Track: Frontend Errors, Backend Errors, Discord Bot Errors, API Failures

### Product Analytics: PostHog

Track: Signups, Retention, Campaign Participation, Project Creation, Review Completion, Conversion Rates

### Logging: Structured JSON Logs

Categories: Auth, Formation, Campaigns, Discord, Leadership, Admin

---

## Health Monitoring

Every service must expose: /health

Checks: Database, API, Discord, Storage

---

## Backup Strategy

Database: Daily

Retention: 30 Days Minimum

Critical Exports: Users, Formation Events, Campaign Data, Projects, Achievements

---

## Recovery Procedures

Database Failure: Freeze Writes → Restore Backup → Validate Data → Reopen System

Discord Bot Failure: Restart Container → Review Logs → Restore Service

API Failure: Rollback Deployment → Restore Previous Build

---

## Security Architecture

Authentication: Supabase Auth

Authorization: RLS, API Checks, Leadership Permissions

Admin Protection: Officer+ required, MFA Recommended, Audit Logs

Audit Logging: Every sensitive action recorded (Promotion, Ban, Role Change, Achievement Grant, Certification Grant)

---

## Rate Limiting

Required for: Authentication, Discord Sync, AI Endpoints, Admin Endpoints

---

## Future Scaling

Current Target: 100–1,000 active members

Next Stage (1,000–10,000): Redis, Queues, Background Workers, Caching Layer

Large Scale (10,000+): Dedicated API, Dedicated Worker Cluster, Read Replicas, Advanced Analytics Pipeline

---

## Launch Checklist

Infrastructure: Domain, SSL, DNS, Database, Bot, Monitoring

Application: Authentication, Dashboard, Formation, Campaigns, Builder Hall, Brotherhood

Operations: Discord, Email, Analytics, Moderation

---

## Final Principle

The platform must survive: Founder absence, Bot failure, Deployment failure, Traffic spikes, Growth

without losing data, trust, or momentum.

Infrastructure exists to support formation. Formation exists to serve the mission.
