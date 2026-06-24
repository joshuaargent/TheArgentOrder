# The Argent Order - Setup Guide

## Complete Setup Instructions

### Prerequisites
- Node.js 20+
- npm (comes with Node.js)
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
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

After deployment, update Supabase Auth:
- Set **Site URL** to your Vercel URL (e.g., `https://your-app.vercel.app`)
- Add redirect URLs for Vercel

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
