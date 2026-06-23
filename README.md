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
├── docs/                 # System documentation
└── docs/                 # System documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase CLI
- Discord Developer Account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase and Discord credentials
   ```

4. Set up Supabase:
   ```bash
   # Link your Supabase project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

5. Start development:
   ```bash
   pnpm dev
   ```

## Documentation

Full documentation is available in the `/docs` directory:

- [00_VISION.md](docs/00_VISION.md) - Mission and vision
- [01_CONSTITUTION.md](docs/01_CONSTITUTION.md) - Core principles
- [05_ROLES_AND_PERMISSIONS.md](docs/05_ROLES_AND_PERMISSIONS.md) - Role definitions
- [08_FORMATION_SYSTEM.md](docs/08_FORMATION_SYSTEM.md) - Formation pillars
- [17_IMPLEMENTATION_ROADMAP.md](docs/17_IMPLEMENTATION_ROADMAP.md) - Build order

## Features

### Formation System
- 5 Pillars: Faith, Discipline, Brotherhood, Building, Truth
- Event-driven progress tracking
- Formation scores and levels

### Brotherhood
- Pod-based community structure
- Mentorship programs
- Brotherhood events

### Campaigns
- Seasonal campaigns (Lent, Advent)
- Sprint challenges
- Progress tracking

### Gamification
- Achievements and certifications
- XP and levels
- Streak tracking

### Discord Integration
- Role sync
- Formation commands (/pray, /grind, /checkin)
- Pod management

## License

Private - All rights reserved
