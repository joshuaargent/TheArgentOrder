# The Argent Order

Catholic Formation Operating System for Builders

## Overview

The Argent Order is a comprehensive platform for Catholic men's formation, combining a web portal with Discord integration to support spiritual growth, brotherhood, and building.

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, Edge Functions)
- **Discord**: discord.js v14
- **State Management**: Zustand, TanStack Query
- **Validation**: Zod, React Hook Form

## Project Structure

```
argent-order/
├── apps/
│   ├── web/              # Next.js portal application
│   └── bot/              # Discord bot
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── shared/           # Shared utilities
├── infra/
│   └── supabase/         # Supabase migrations
├── docs/                 # System documentation (37 files)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** - [Install](https://nodejs.org/)
- **npm** - Comes with Node.js (no separate install needed)
- **Supabase CLI** - `npm install -g supabase`
- **Git**
- Discord Developer Account (for bot)

### Step 1: Clone & Install

```bash
git clone https://github.com/joshuaargent/TheArgentOrder.git
cd TheArgentOrder
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Copy your **Project URL** and both **API keys** from Settings > API

### Step 3: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase (from Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Discord Bot (create at discord.com/developers)
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-client-id
```

### Step 4: Push Database Schema

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
npm run db:migrate
```

This creates:
- 50+ tables with optimized indexes
- Row Level Security policies
- Seed data (ranks, achievements, campaigns)

### Step 5: Configure Supabase Auth

1. In Supabase Dashboard, go to **Authentication > URL Configuration**
2. Add your site URL (e.g., `http://localhost:3000`)
3. Add redirect URLs: `http://localhost:3000/**`

### Step 6: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🎮 Discord Bot Setup

### Step 1: Create Discord Application

1. Go to [discord.com/developers](https://discord.com/developers)
2. Click **New Application**
3. Name it "The Argent Order"
4. Go to **Bot** section
5. Click **Reset Token** and copy the token
6. Enable **Message Content Intent** under Privileged Gateway Intents

### Step 2: Add Bot to Server

1. In Discord Developer Portal, go to **OAuth2 > URL Generator**
2. Check scopes: `bot`, `applications.commands`
3. Copy the generated URL
4. Visit the URL and add bot to your server

### Step 3: Start Bot

```bash
cd apps/bot
npm run dev
```

Available commands:
- `/profile` - View your formation profile
- `/pray` - Log a prayer session
- `/checkin` - Daily check-in
- `/grind` - Log deep work session
- `/streak` - Check your streaks

---

## 📁 Project Overview

### Apps

| App | Location | Description |
|-----|----------|-------------|
| Web | `apps/web/` | Next.js portal with authentication |
| Bot | `apps/bot/` | Discord bot with slash commands |

### Packages

| Package | Location | Description |
|---------|----------|-------------|
| Types | `packages/types/` | Shared TypeScript definitions |
| Shared | `packages/shared/` | Shared utilities |

### Infrastructure

| Component | Location | Description |
|-----------|----------|-------------|
| Migrations | `infra/supabase/` | Database schema & seed data |

---

## 📊 Database Schema

### Core Tables

| Domain | Tables | Purpose |
|--------|--------|---------|
| Identity | `profiles`, `ranks`, `user_ranks` | User accounts & progression |
| Formation | `formation_events`, `formation_scores` | Event tracking & scoring |
| Campaigns | `campaigns`, `campaign_tasks`, `campaign_enrollments` | Seasonal challenges |
| Brotherhood | `pods`, `pod_members`, `mentorships` | Community structure |
| Journal | `journal_entries`, `examens` | Personal reflection |
| Achievements | `achievements`, `user_achievements` | Gamification |
| Projects | `projects`, `project_milestones` | Builder Hall |
| Analytics | `analytics_events`, `formation_snapshots` | Tracking |

### Seed Data Included

- **8 Ranks**: Visitor → Initiate → Brother → Veteran → Captain → Officer → Mentor → Steward
- **50+ Achievements**: Across all 5 pillars
- **8 Campaigns**: Lent, Advent, Sprints
- **8 Certifications**: For advanced milestones

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Run all apps in parallel
npm run dev:web          # Run only web app
npm run dev:bot          # Run only Discord bot

# Building
npm run build            # Build all apps
npm run build:web        # Build web app

# Database
npm run db:migrate       # Push migrations to Supabase
npm run db:generate      # Generate Supabase types

# Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
```

---

## 🌐 Deployment

### Deploy Web to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables from `.env.local`
4. Deploy

### Deploy Bot to Railway/Render

1. Push to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Set start command: `npm run start:bot`

---

## 📚 Documentation

Full documentation in `/docs`:

| Doc | Topic |
|-----|-------|
| 00_VISION.md | Mission and vision |
| 01_CONSTITUTION.md | Core principles |
| 02_PHILOSOPHY.md | Formation philosophy |
| 03_MEMBER_JOURNEY.md | User lifecycle |
| 05_ROLES_AND_PERMISSIONS.md | Rank system |
| 08_FORMATION_SYSTEM.md | 5 pillars |
| 17_IMPLEMENTATION_ROADMAP.md | Build order |

---

## ⚠️ Common Issues

### "RLS policy denied"

Make sure you're authenticated. Check the browser console for auth errors.

### Bot not responding

1. Verify DISCORD_TOKEN is correct
2. Make sure bot has proper intents enabled
3. Check bot is in the server with correct permissions

### Database connection failed

1. Verify SUPABASE_URL and keys are correct
2. Check if Supabase project is running
3. Ensure IP allowlist includes your IP (if applicable)

---

## License

Private - All rights reserved
