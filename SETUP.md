# The Argent Order - Setup Guide

## Complete Setup Instructions

### Prerequisites
- Node.js 20+
- npm (comes with Node.js)
- Supabase account
- Discord developer account
- ConvertKit account (for newsletter)

---

## Step 0: Create ConvertKit Account (Newsletter)

ConvertKit handles email capture, lead magnets, and the welcome email sequence.

### 0.1: Sign Up for ConvertKit

1. Go to **https://kit.com**
2. Click **"Get Started"**
3. Sign up with Google or email
4. Complete onboarding wizard

### 0.2: Get Your API Secret

1. In ConvertKit dashboard, click **Settings** (bottom left)
2. Click **Advanced** tab
3. Click **API** section
4. Copy the **API Secret** → `CONVERTKIT_API_SECRET`

### 0.3: Create a Form

1. Click **Forms** in the sidebar
2. Click **Create New Form**
3. Choose **Embedded Form** style
4. Name it: `The Argent Order Signup`
5. Customize as needed (or use defaults)
6. Publish the form
7. Copy the **Form ID** from the URL (e.g., `https://app.convertkit.com/forms/YOUR_FORM_ID/edit`) → `CONVERTKIT_FORM_ID`

### 0.4: Configure Welcome Email

1. In your form settings, click **Email Settings**
2. Enable **Send confirmation email** 
3. Customize the welcome email content
4. Add your **Discord invite link** in this email (IMMEDIATE access!)

### 0.5: Create Your Lead Magnet (Optional)

If you want to deliver a lead magnet:

1. Go to **Landing Pages** or **Sequences**
2. Create a sequence for your lead magnet
3. In the welcome email, include the lead magnet download link

### 0.6: Get Your Discord Invite Link

1. Create a Discord invite with **max age: never, max uses: unlimited**
2. Include this link in your ConvertKit welcome email (SEND IMMEDIATELY!)

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

### 3a: Get OAuth Credentials

1. Go to **General Information** section
2. Copy **Application ID** → `DISCORD_CLIENT_ID`
3. Copy **Client Secret** → `DISCORD_CLIENT_SECRET`

### 3b: Configure OAuth2

1. Go to **OAuth2** → **OAuth2 Settings**
2. In **Redirects**, click **Add Redirect**:
   - For local dev: `http://localhost:3000/api/auth/discord/callback`
   - For production: `https://your-domain.com/api/auth/discord/callback`

### 3c: Get Bot Token

1. Go to **Bot** section (in left sidebar)
2. Click **Reset Token** to get `DISCORD_TOKEN`
3. Copy the token (you won't see it again!)
4. Under **Privileged Gateway Intents**, enable:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent

### 3d: Generate OAuth URL for Bot Installation

1. Go to **OAuth2** → **URL Generator**
2. Check these scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
   - ✅ `identify` (for OAuth - to get user info)
   - ✅ `email` (for OAuth - to get user email)
3. Under **Bot Permissions**, check:
   - ✅ Administrator (or specific permissions below)
   - Or individually: Send Messages, Use Slash Commands, Embed Links, Manage Roles

### 3e: Add Bot to Server

1. Copy the generated OAuth URL from step 3d
2. Open in browser
3. Select your Discord server
4. Authorize the bot

---

## Step 4: Setup Local Environment

```bash
# Clone the repo
git clone https://github.com/joshuaargent/TheArgentOrder.git
cd TheArgentOrder

# Install dependencies
npm install

# Copy env file
cp apps/web/.env.example apps/web/.env.local
```

---

## Step 5: Fill in .env.local

```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Discord OAuth (from Step 3)
DISCORD_CLIENT_ID=123456789012345678
DISCORD_CLIENT_SECRET=your-client-secret-here
NEXT_PUBLIC_DISCORD_CLIENT_ID=123456789012345678

# Discord Bot (from Step 3)
DISCORD_TOKEN=MTIz...your-bot-token

# App URLs (set to your deployment URL)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ConvertKit Newsletter (from Step 0)
CONVERTKIT_API_SECRET=your-convertkit-api-secret
CONVERTKIT_FORM_ID=your-convertkit-form-id
```

### Environment Variables Explained

| Variable | Required For | Public? | Description |
|----------|-------------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Web App | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web App | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | No | Supabase admin key (never expose to client) |
| `DISCORD_CLIENT_ID` | OAuth Server | No | Discord application ID |
| `DISCORD_CLIENT_SECRET` | OAuth Server | No | Discord OAuth secret |
| `NEXT_PUBLIC_DISCORD_CLIENT_ID` | Login Button | Yes | Public Discord client ID for login button |
| `DISCORD_TOKEN` | Discord Bot | No | Bot token for slash commands |
| `CONVERTKIT_API_SECRET` | Newsletter API | No | ConvertKit private API key |
| `CONVERTKIT_FORM_ID` | Join Form | Yes | ConvertKit publication ID |
| `NEXT_PUBLIC_APP_URL` | OAuth Redirect | Yes | Full URL of your app (for redirect URIs) |
| `NEXT_PUBLIC_SITE_URL` | Meta Tags | Yes | Canonical URL for SEO |

---

## Step 6: Push Database to Supabase

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

## Step 7: Configure Supabase Auth

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**`
3. Under **Providers** → **Email**:
   - Enable **Email confirmations** (or disable for testing)

---

## Step 8: Run It!

```bash
# Start web app (in one terminal)
npm run dev

# In another terminal, start bot
cd apps/bot && npm run dev
```

Visit **http://localhost:3000**

---

## Step 9: Deploy to Vercel

### Web App Deployment

1. Go to **https://vercel.com**
2. Click **"Add New..."** → **Project**
3. Import your GitHub repo: `joshuaargent/TheArgentOrder`
4. **Important**: Set **Root Directory** to `apps/web`
5. Add Environment Variables (mark as "Secret" for private ones):

| Variable | Public? | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon key |
| `DISCORD_CLIENT_ID` | Secret | Discord application ID |
| `DISCORD_CLIENT_SECRET` | Secret | Discord OAuth secret |
| `NEXT_PUBLIC_DISCORD_CLIENT_ID` | Yes | Public Discord client ID |
| `NEXT_PUBLIC_APP_URL` | Yes | Full URL of deployed app (e.g., `https://your-app.vercel.app`) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL for SEO |
| `CONVERTKIT_API_SECRET` | Secret | ConvertKit API key |
| `CONVERTKIT_FORM_ID` | Yes | ConvertKit publication ID |

6. Click **Deploy**

### After Deployment - Update Redirect URIs

1. **Supabase Auth**: Go to Authentication → URL Configuration
   - Set **Site URL** to your Vercel URL
   - Add **Redirect URLs**: `https://your-app.vercel.app/**`

2. **Discord Developer Portal**: Go to your app → OAuth2 Settings
   - Add redirect URL: `https://your-app.vercel.app/api/auth/discord/callback`

### Discord Bot - Vercel Serverless (Alternative to Linux PC)

Instead of running on your Linux PC 24/7, you can host the Discord bot as a serverless function on Vercel.

**Note**: Discord bots typically need to stay online 24/7. Serverless functions have cold starts and timeouts. For production, a Linux PC with PM2 is more reliable. However, for testing/development:

1. Create a separate Vercel project for the bot:
   - Root Directory: `apps/bot`
   - Build Command: `npm run build`
   - Install Command: `npm install`

2. Add environment variables in Vercel:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Important**: Set a cron job or use Uptime Robot to ping your bot URL every 5 minutes to prevent cold starts

---

## Discord Bot - Running on Your Linux PC

The Discord bot needs to run 24/7. Here's how to run it on your Linux PC:

### Option A: tmux (Recommended for Beginners)

```bash
# Install tmux if not installed
sudo apt update && sudo apt install tmux

# Create a new tmux session
tmux new -s argent-bot

# Navigate to bot folder
cd TheArgentOrder/apps/bot

# Start the bot
npm run dev

# Detach from tmux: press Ctrl+B, then D

# To come back later:
tmux attach -s argent-bot

# To stop the bot:
tmux kill-session -s argent-bot
```

### Option B: PM2 (Recommended for Production)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Navigate to bot folder
cd TheArgentOrder/apps/bot

# Start bot with PM2
pm2 start npm --name "argent-bot" -- start

# Save PM2 process list (auto-restart on reboot)
pm2 save

# Setup PM2 startup script
pm2 startup

# Useful PM2 commands:
pm2 status          # Check if bot is running
pm2 logs            # View bot logs
pm2 restart argent-bot   # Restart bot
pm2 stop argent-bot     # Stop bot
pm2 delete argent-bot   # Remove from PM2
```

### Option C: Systemd Service (Runs on Boot)

Create a service file:

```bash
sudo nano /etc/systemd/system/argent-bot.service
```

Add this content:

```ini
[Unit]
Description=The Argent Order Discord Bot
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/home/YOUR_USERNAME/TheArgentOrder/apps/bot
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start the bot
sudo systemctl start argent-bot

# Enable on boot
sudo systemctl enable argent-bot

# Check status
sudo systemctl status argent-bot
```

### Bot Commands

Once the bot is running, use these slash commands in Discord:

| Command | Description |
|---------|-------------|
| `/setup` | Set up server structure (Admin only - idempotent) |
| `/sync` | Sync your Discord role with portal rank |
| `/link` | Connect Discord to portal account |
| `/profile` | View your formation profile |
| `/pray` | Log prayer session |
| `/scripture` | Log scripture reading |
| `/mass` | Log Mass attendance |
| `/checkin` | Daily formation check-in |
| `/grind` | Log deep work session |
| `/streak` | View your formation streaks |
| `/project list/update` | Builder Hall project commands |
| `/pod info/members/wins` | Pod accountability |
| `/campaign list/join/progress` | Campaign management |

---

## Quick Reference

### Environment Variables

| Variable | Where to Find |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `DISCORD_CLIENT_ID` | Discord Developer → General → Application ID |
| `DISCORD_CLIENT_SECRET` | Discord Developer → General → Client Secret |
| `NEXT_PUBLIC_DISCORD_CLIENT_ID` | Same as DISCORD_CLIENT_ID |
| `DISCORD_TOKEN` | Discord Developer → Bot → Token (Reset Token) |
| `CONVERTKIT_API_SECRET` | ConvertKit → Settings → API Keys |
| `CONVERTKIT_FORM_ID` | ConvertKit → Settings → Publication → Publication ID |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL |
| `NEXT_PUBLIC_SITE_URL` | Your deployed app URL |

### OAuth Redirect URLs to Configure

| Service | Redirect URL |
|---------|--------------|
| Supabase Auth | `http://localhost:3000/**` (dev), `https://your-app.vercel.app/**` (prod) |
| Discord OAuth | `http://localhost:3000/api/auth/discord/callback` (dev), `https://your-app.vercel.app/api/auth/discord/callback` (prod) |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Project not found" | Check your Project Ref is correct |
| Auth redirect loop | Set Site URL to `http://localhost:3000` in Supabase |
| Bot not responding | Make sure slash commands are registered - run `/setup` |
| Migration failed | Check SUPABASE_SERVICE_ROLE_KEY is correct |
| CORS error | Ensure Supabase allowed domains includes localhost |
| Bot goes offline | Use tmux/PM2 to keep it running |
| Bot won't start | Check .env.local has correct DISCORD_TOKEN |
| Newsletter not working | Verify CONVERTKIT_API_SECRET and CONVERTKIT_FORM_ID are set |
| Email capture fails silently | The app gracefully falls back - check ConvertKit dashboard for subscriber count |
| Lead magnet not sending | Check ConvertKit automations are active and connected to recommendation |
| Discord OAuth not working | Verify NEXT_PUBLIC_APP_URL matches your deployment URL exactly |
| Discord login button missing | Check NEXT_PUBLIC_DISCORD_CLIENT_ID is set |
| "invalid redirect_uri" error | Add callback URL to Discord OAuth2 settings in Developer Portal |
| Discord callback fails | Ensure DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET match Discord app settings |

---

## Discord Bot - Detailed Setup

### Required Bot Permissions

When adding the bot to your server, use these permissions:

**Text Permissions**:
- Send Messages
- Embed Links
- Use Slash Commands
- Add Reactions
- Read Message History

**Admin Permissions** (required for `/setup` command):
- Manage Roles
- Manage Channels
- Manage Server

**OAuth2 URL Generator Settings**:
```
Scopes: bot, applications.commands
Bot Permissions: Administrator (easiest) or specific permissions above
```

### The `/setup` Command (Creates Server Structure)

When you first run `/setup` in Discord, it creates:

| Channel Category | Purpose |
|-----------------|---------|
| 🏛️ FORMATION | Prayer requests, scripture, daily check-in |
| 🔨 BUILDER HALL | Project showcase, accountability |
| 👥 POD LOUNGE | Pod-specific discussions |
| 📋 CAMPAIGNS | Active campaign channels |
| 📊 FORMATION TRACKING | Weekly review, stats |
| ⚡ ACCOUNTABILITY | Check-ins, wins, streaks |
| 🏆 LEADERSHIP | Officer discussions |

### Available Slash Commands

| Command | Description | Access |
|---------|-------------|--------|
| `/setup` | Creates all server channels and roles | Admin only |
| `/sync` | Sync Discord role with portal rank | All members |
| `/link` | Connect Discord to portal account | All members |
| `/profile` | View your formation profile | All members |
| `/prayer` | Prayer request/answered/list/mine | All members |
| `/event` | Create/join/leave/list events | All members |
| `/leadership` | Leaderboard, pod-health, community-health | All members |
| `/admin` | Warn, mute, kick, ban, lockdown, announce | Admin only |
| `/examen` | Daily examen reflection | All members |
| `/formation` | View formation scores and streaks | All members |
| `/campaign` | List, join, progress campaigns | All members |
| `/pod` | Pod info, members, wins | All members |
| `/project` | List, update projects | All members |

### Setting Up Bot Commands (for development)

The bot auto-registers slash commands on startup. To manually sync:

```bash
cd apps/bot
npm run dev
```

Commands will register automatically. If you add new commands, restart the bot.

### Auto-Welcome DM for New Members

The bot automatically sends a welcome DM when someone joins your Discord server:

1. **DM Content**: Welcome message with portal activation link
2. **Setup Required**:
   - Set `PORTAL_URL` environment variable to your portal URL
   - Run `/setup` command (creates all roles including **Visitor**)
3. **What it does**:
   - Sends welcome DM with portal activation link
   - Assigns **Visitor** role automatically (entry-level role per docs)
   - Portal URL button makes it easy to activate

**Note on Roles**: Per docs, the role progression is:
- **Visitor** → assigned on join
- **Initiate** → after portal setup and /link
- **Brother** → after 30 days + campaigns + pod participation

**DM Message**:
> Welcome to The Argent Order, Brother.
> 
> You've taken the first step. Now finish it.
> 
> Activate your portal to begin your formation tracking.
> 
> It takes 60 seconds. You'll connect your Discord account and get access to your personal dashboard.

### Keeping the Bot Online (Free Options)

1. **Your Own PC** (using tmux/PM2 - see above)
2. **Railway** (has free tier): `https://railway.app`
   - Connect GitHub repo
   - Set environment variables
   - Deploy
3. **Render** (free tier available): `https://render.com`
   - Create Web Service
   - Connect GitHub
   - Use a persistent disk for state
4. **Oracle Cloud Free** (permanent free tier): `https://oracle.com/cloud/free`
   - Create always-free VM
   - Ubuntu + Node.js
   - Install PM2
   - Run 24/7 for free

---

## Creating Your Lead Magnet PDFs

The lead magnet kit includes 4 PDFs. Here's what each should contain:

### 1. Rule of Life Blueprint ($97 value)
**Purpose**: Core framework for daily formation

**Contents**:
- Introduction: Why every man needs a Rule of Life
- The 5 Pillars: Faith, Discipline, Brotherhood, Building, Truth
- Daily Structure template (morning, midday, evening)
- Weekly Review template
- Monthly Assessment template
- 12 categories to fill in

### 2. 90-Day Campaign Planner ($67 value)
**Purpose**: Turn intention into action

**Contents**:
- Campaign concept explanation
- Goal setting framework
- 90-day calendar template
- Weekly milestones
- Monthly checkpoints
- Progress tracking sheets

### 3. Morning Protocol Guide ($47 value)
**Purpose**: Compound daily habits

**Contents**:
- Why morning routine matters
- The 30-minute protocol:
  - 5 min: Prayer/Meditation
  - 10 min: Exercise
  - 10 min: Learning (reading/study)
  - 5 min: Planning the day
- Cold shower protocol
- Troubleshooting common obstacles

### 4. Catholic Man's Oath ($36 value)
**Purpose**: Identity declaration

**Contents**:
- The Oath text (memorable, punchy)
- Daily recitation reminder
- Wall poster version
- Wallet card version

**Example Oath**:
> I am a Catholic man.
> I seek discipline over comfort.
> I build instead of consuming.
> I pursue truth over convenience.
> I serve my brothers as they serve me.
> I will not waste this day.

---

**Tip**: You can use free tools like Canva or Google Docs to create these PDFs. Keep them simple but professional.
