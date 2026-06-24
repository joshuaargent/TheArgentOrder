# The Argent Order - Setup Guide

## Complete Setup Instructions

### Prerequisites
- Node.js 20+
- npm (comes with Node.js)
- Supabase account
- Discord developer account
- Beehiiv account (for newsletter)

---

## Step 0: Create Beehiiv Account (Newsletter)

Beehiiv handles email capture, lead magnets, and the welcome email sequence.

### 0.1: Sign Up for Beehiiv

1. Go to **https://www.beehiiv.com**
2. Click **"Start for free"**
3. Sign up with Google or email
4. Complete onboarding wizard

### 0.2: Create Your Publication

1. In Beehiiv dashboard, click **"Create Publication"**
2. Name it: `The Argent Order`
3. Set your niche: `Catholic Formation for Men`
4. Choose a template or skip

### 0.3: Get Your Publication ID

1. Go to **Settings** (gear icon) → **Publication**
2. Copy the **Publication ID** (starts with `pub_...`)
3. This becomes: `NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID`

### 0.4: Generate API Key

1. Go to **Settings** → **API Keys**
2. Click **"Create new API key"**
3. Name it: `The Argent Order App`
4. Copy the key immediately (you won't see it again)
5. This becomes: `BEEHIIV_API_KEY`

### 0.5: Create Your Lead Magnet (The "Catholic Builder Starter Kit")

Beehiiv handles delivering the lead magnet automatically.

1. Go to **Audience** → **Drive Traffic** → **Recommendation**
2. Click **"Create recommendation"**
3. Set up your lead magnet:

| Field | Value |
|-------|-------|
| Name | Catholic Builder Starter Kit |
| Description | Everything you need to start building a Rule of Life |
| Delivery Method | Direct Download |

4. Upload these files (create them yourself or use placeholders):
   - Rule of Life Blueprint (PDF)
   - 90-Day Campaign Planner (PDF)
   - Morning Protocol Guide (PDF)
   - Catholic Man's Oath (PDF)

### 0.6: Create Your Welcome Email Sequence

Beehiiv automations handle the 7-day sequence from the docs.

1. Go to **Audience** → **Automations** → **Create Automation**
2. Name it: `Welcome Sequence`
3. Set trigger: **Subscribes to recommendation** → Select your lead magnet

4. **Email 1** (Day 0 - Immediate):
   - Subject: "Your Catholic Builder Starter Kit is ready"
   - Include the recommendation embed

5. **Email 2** (Day 1):
   - Subject: "Why you're not where you should be"
   - Identity content - call out the problem

6. **Email 3** (Day 2):
   - Subject: "The system that builds discipline"
   - Introduce the 5 pillars

7. **Email 4** (Day 4):
   - Subject: "The brotherhood that doesn't let you quit"
   - Brotherhood stories, then Discord invitation

8. **Email 5** (Day 6):
   - Subject: "Last step before you start"
   - Commitment CTA - if serious, act now

### 0.7: Get Your Discord Invite Link

1. Create a Discord invite with **max age: never, max uses: unlimited**
2. Include this link in Email 4 of your sequence

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
   - ✅ `identify` (for OAuth - to get user info)
   - ✅ `email` (for OAuth - to get user email)
6. In **Bot** section:
   - Click **"Reset Token"** to get `DISCORD_TOKEN`
   - Copy the token (you won't see it again!)
7. Copy the **Application ID** as `DISCORD_CLIENT_ID`
8. In **General Information** section:
   - Copy the **Client Secret** as `DISCORD_CLIENT_SECRET`
9. In **OAuth2 Settings**:
   - Add redirect URL: `https://your-portal-url.com/api/auth/discord/callback`
   - (Replace with your actual portal URL)

---

## Step 4: Add Discord Bot to Server

1. In Discord Developer Portal, go to your app → **OAuth2** → **URL Generator**
2. Check scope: `bot`
3. Under **Bot Permissions**, check:
   - ✅ Send Messages
   - ✅ Use Slash Commands
   - ✅ Embed Links
   - ✅ Manage Roles
   - ✅ Administrator (for setup command)
4. Copy the generated URL and open it in browser
5. Select your Discord server and authorize

---

## Step 5: Setup Local Environment

```bash
# Clone the repo
git clone https://github.com/joshuaargent/TheArgentOrder.git
cd TheArgentOrder

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
```

---

## Step 6: Fill in .env.local

```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Discord Bot (from Step 3)
DISCORD_TOKEN=MTIz...your-bot-token
DISCORD_CLIENT_ID=123456789012345678

# Beehiiv Newsletter (from Step 0)
BEEHIIV_API_KEY=your-beehiiv-api-key
NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID=pub_xxxxxxxxxxxx
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
# Start web app (in one terminal)
npm run dev

# In another terminal, start bot
cd apps/bot && npm run dev
```

Visit **http://localhost:3000**

---

## Step 10: Deploy to Vercel

### Web App Deployment

1. Go to **https://vercel.com**
2. Click **"Add New..."** → **Project**
3. Import your GitHub repo: `joshuaargent/TheArgentOrder`
4. **Important**: Set **Root Directory** to `apps/web`
5. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `BEEHIIV_API_KEY` | Your Beehiiv API key (private) |
| `NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID` | Your Beehiiv publication ID |

6. Click **Deploy**

After deployment, update Supabase Auth:
- Set **Site URL** to your Vercel URL (e.g., `https://your-app.vercel.app`)
- Add redirect URLs for Vercel

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

| Service | Key | Location |
|---------|-----|----------|
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| Supabase Anon | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public |
| Supabase Service | `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role |
| Discord Token | `DISCORD_TOKEN` | Bot → Token |
| Discord App ID | `DISCORD_CLIENT_ID` | General → Application ID |
| Beehiiv API Key | `BEEHIIV_API_KEY` | Settings → API Keys |
| Beehiiv Pub ID | `NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID` | Settings → Publication |

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
| Newsletter not working | Verify BEEHIIV_API_KEY and NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID are set |
| Email capture fails silently | The app gracefully falls back - check Beehiiv dashboard for subscriber count |
| Lead magnet not sending | Check Beehiiv automations are active and connected to recommendation |

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
   - (Optional) Create a "New Member" role in your Discord server
3. **What it does**:
   - Sends welcome DM with portal activation link
   - Assigns "New Member" role automatically
   - Portal URL button makes it easy to activate

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
