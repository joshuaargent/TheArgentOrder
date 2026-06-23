# The Argent Order

## Deployment Architecture

Version: 1.0

Status: Production Infrastructure Blueprint

---

# Purpose

This document defines how The Argent Order runs in production.

The objective is:

* Reliability
* Security
* Scalability
* Maintainability

A member should never think about infrastructure.

The platform should simply work.

---

# Infrastructure Philosophy

## Principle 1

Buy simplicity.

Do not build infrastructure for 100,000 users.

Build infrastructure that can easily reach 10,000 users.

Scale later.

---

## Principle 2

Managed services first.

Self-host only when there is a compelling reason.

Time spent managing servers is time not spent building formation.

---

## Principle 3

Every component must have:

* Monitoring
* Logging
* Backups
* Recovery procedures

---

# Production Architecture

```text
Users

↓

Cloudflare

↓

Vercel

↓

Next.js Portal

↓

Internal API Layer

↓

Supabase

├── Postgres
├── Auth
├── Storage
└── Realtime

↓

Discord Bot

↓

Discord
```

---

# Frontend Hosting

Platform

```text
Vercel
```

---

Responsibilities

```text
Portal

Marketing Website

API Routes

Server Components

Authentication Flows
```

---

Benefits

```text
Automatic Deployments

Preview Deployments

Edge Network

Easy Rollbacks
```

---

# Database Infrastructure

Platform

```text
Supabase
```

---

Responsibilities

```text
Authentication

Postgres

Storage

Realtime

RLS
```

---

Production Requirements

```text
Daily Backups

Point In Time Recovery

Database Monitoring

Connection Monitoring
```

---

# Discord Bot Hosting

Platform

```text
Railway
```

Preferred

---

Alternative

```text
Fly.io

VPS

DigitalOcean
```

---

Responsibilities

```text
Slash Commands

Role Synchronization

Notifications

Reminders

Analytics Events
```

---

Deployment Requirements

```text
Always On

Auto Restart

Health Checks

Crash Recovery
```

---

# Domain Architecture

Primary Domain

```text
joshuaargent.com
```

---

Subdomains

```text
app.joshuaargent.com

Portal
```

---

```text
api.joshuaargent.com

API
```

---

```text
join.joshuaargent.com

Lead Capture
```

---

```text
docs.joshuaargent.com

Public Documentation
```

---

# Cloudflare Layer

Purpose

Protect infrastructure.

---

Features

```text
DNS

Caching

DDoS Protection

SSL

Rate Limiting
```

---

Required Rules

```text
Protect API

Protect Login

Protect Admin Endpoints
```

---

# Environment Separation

Never use one environment.

---

Development

```text
Local Machine
```

---

Staging

```text
Preview Environment
```

---

Production

```text
Live Environment
```

---

Separate:

```text
Database

Storage

Secrets

Discord Applications
```

---

# Secrets Management

Never store secrets in source control.

---

Required Secrets

```env
SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

DISCORD_TOKEN=

DISCORD_CLIENT_ID=

DISCORD_PUBLIC_KEY=

OPENAI_API_KEY=

POSTHOG_API_KEY=

SENTRY_DSN=
```

---

Storage Location

```text
Vercel Environment Variables

Railway Environment Variables
```

---

# CI/CD Pipeline

Source Control

```text
GitHub
```

---

Flow

```text
Push

↓

GitHub

↓

Tests

↓

Build

↓

Deploy

↓

Health Check

↓

Production
```

---

# Pull Request Workflow

Every PR must:

```text
Pass Linting

Pass Type Check

Pass Tests

Build Successfully
```

---

Required Commands

```bash
pnpm lint

pnpm typecheck

pnpm test

pnpm build
```

---

# Database Migrations

Never modify production manually.

---

Flow

```text
Migration

↓

Review

↓

Git

↓

Deploy

↓

Apply
```

---

Structure

```text
supabase/migrations
```

---

Examples

```text
202607010001_initial_schema.sql

202607020001_add_campaigns.sql
```

---

# Observability Stack

Purpose

Know problems before members do.

---

# Error Monitoring

Platform

```text
Sentry
```

Track

```text
Frontend Errors

Backend Errors

Discord Bot Errors

API Failures
```

---

# Product Analytics

Platform

```text
PostHog
```

Track

```text
Signups

Retention

Campaign Participation

Project Creation

Review Completion

Conversion Rates
```

---

# Logging

Structured Logging

```text
JSON Logs
```

---

Log Categories

```text
Auth

Formation

Campaigns

Discord

Leadership

Admin
```

---

# Health Monitoring

Every service must expose:

```text
/health
```

---

Example

```json
{
  "status": "healthy"
}
```

---

Checks

```text
Database

API

Discord

Storage
```

---

# Backup Strategy

Database

```text
Daily
```

---

Retention

```text
30 Days Minimum
```

---

Critical Exports

```text
Users

Formation Events

Campaign Data

Projects

Achievements
```

---

# Recovery Procedures

Scenario

Database Failure

---

Response

```text
Freeze Writes

Restore Backup

Validate Data

Reopen System
```

---

Scenario

Discord Bot Failure

---

Response

```text
Restart Container

Review Logs

Restore Service
```

---

Scenario

API Failure

---

Response

```text
Rollback Deployment

Restore Previous Build
```

---

# Security Architecture

## Authentication

Supabase Auth

---

## Authorization

RLS

API Checks

Leadership Permissions

---

## Admin Protection

Requirements

```text
Officer+

MFA Recommended

Audit Logs
```

---

# Audit Logging

Every sensitive action recorded.

Examples

```text
Promotion

Ban

Role Change

Achievement Grant

Certification Grant
```

---

Stored In

```text
audit_logs
```

---

# Rate Limiting

Required

---

Protect

```text
Authentication

Discord Sync

AI Endpoints

Admin Endpoints
```

---

# Future Scaling

Current Target

```text
100–1,000 active members
```

---

Next Stage

```text
1,000–10,000 members
```

Changes

```text
Redis

Queues

Background Workers

Caching Layer
```

---

Large Scale

```text
10,000+ members
```

Add

```text
Dedicated API

Dedicated Worker Cluster

Read Replicas

Advanced Analytics Pipeline
```

---

# Launch Checklist

Infrastructure

```text
✓ Domain

✓ SSL

✓ DNS

✓ Database

✓ Bot

✓ Monitoring
```

---

Application

```text
✓ Authentication

✓ Dashboard

✓ Formation

✓ Campaigns

✓ Builder Hall

✓ Brotherhood
```

---

Operations

```text
✓ Discord

✓ Email

✓ Analytics

✓ Moderation
```

---

# Final Principle

The platform must be able to survive:

* Founder absence
* Bot failure
* Deployment failure
* Traffic spikes
* Growth

without losing data, trust, or momentum.

Infrastructure exists to support formation.

Formation exists to serve the mission.
