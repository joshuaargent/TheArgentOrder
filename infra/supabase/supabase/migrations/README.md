# Database Setup

## Remote Supabase (Production)

Schema changes must be applied manually via Supabase Dashboard:
1. Go to https://app.supabase.com → your project → SQL Editor
2. Copy/paste SQL from files in `sql/` folder
3. Run in order: 001 → 002 → 003 → etc.

## Local Development

The `migrations/` folder is for local Supabase only:
```bash
supabase db reset  # Applies migrations/ locally
```

## Important

Supabase CLI cannot push migrations to remote projects.
Always use the SQL Editor for production database changes.
