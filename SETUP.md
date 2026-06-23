# The Argent Order - Setup Guide

## Complete Setup Instructions

### Prerequisites
- Node.js 20+
- pnpm 9.0+
- Supabase account
- Discord developer account

---

## Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Connect with GitHub or email
4. Create new project:
   - Name: `the-argent-order` (or your choice)
   - Database Password: **Save this somewhere!**
   - Region: Pick closest to your users
5. Wait for project to provision (~2 minutes)

---

## Step 2: Get Supabase Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:

| Variable | Where to find |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Config** → `Project URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Config** → `anon public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | **API Settings** → `service_role` key |

⚠️ **Important**: The `SUPABASE_SERVICE_ROLE_KEY` is a secret key - never expose it to the client!

---

## Step 3: Create Discord Application

1. Go to **https://discord.com/developers/applications**
2. Click **"New Application"**
3. Name it `The Argent Order`
4. Go to **OAuth2** → **URL Generator**
5. Check these scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
6. In **Bot** section:
   - Click **"Reset Token"** to get `DISCORD_TOKEN`
   - Copy the token (you won't see it again!)
7. Copy the **Application ID** as `DISCORD_CLIENT_ID`

---

## Step 4: Add Discord Bot to Server

1. In Discord Developer Portal, go to your app → **OAuth2** → **URL Generator**
2. Check scope: `bot`
3. Under **Bot Permissions**, check:
   - ✅ Send Messages
   - ✅ Use Slash Commands
   - ✅ Embed Links
4. Copy the generated URL and open it in browser
5. Select your Discord server and authorize

---

## Step 5: Setup Local Environment

```bash
# Clone the repo
git clone https://github.com/joshuaargent/TheArgentOrder.git
cd TheArgentOrder

# Install pnpm
npm install -g pnpm@9.0.0

# Install dependencies
pnpm install

# Copy env file
cp .env.example .env.local
```

---

## Step 6: Fill in .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
DISCORD_TOKEN=MTIz...your-bot-token
DISCORD_CLIENT_ID=123456789012345678
```

---

## Step 7: Push Database to Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (get project-ref from Supabase URL)
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
supabase db push
```

**To find your Project Ref**: Look at your Supabase URL - it will be `https://supabase.com/dashboard/project/YOUR_PROJECT_REF/...`

---

## Step 8: Configure Supabase Auth

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**`
3. Under **Providers** → **Email**:
   - Enable **Email confirmations** (or disable for testing)

---

## Step 9: Run It!

```bash
# Start web app
pnpm dev:web

# In another terminal, start bot
pnpm dev:bot
```

Visit **http://localhost:3000**

---

## Quick Reference

| Service | Key | Location |
|---------|-----|----------|
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| Supabase Anon | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public |
| Supabase Service | `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role |
| Discord Token | `DISCORD_TOKEN` | Bot → Token |
| Discord App ID | `DISCORD_CLIENT_ID` | General → Application ID |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Project not found" | Check your Project Ref is correct |
| Auth redirect loop | Set Site URL to `http://localhost:3000` in Supabase |
| Bot not responding | Make sure slash commands are registered |
| Migration failed | Check SUPABASE_SERVICE_ROLE_KEY is correct |
| CORS error | Ensure Supabase allowed domains includes localhost |
