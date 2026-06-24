# The Argent Order - Changes Needed

This document lists all changes required to bring the codebase and documentation into alignment.

---

## 1. DOCUMENTATION INCONSISTENCIES

### 🔴 HIGH PRIORITY

#### 1.1 Formation Level Names Mismatch
**Files Affected:**
- `docs/07_FORMATION_SYSTEM.md` (lines ~126-328)
- `infra/supabase/supabase/migrations/003_seed_data.sql`

**Issue:**
- Documentation defines: Foundation, Discipline, Brotherhood, Leadership, Stewardship
- Database has: Novice, Builder, Established, Mature, Exemplar

**Fix Required:**
Update `003_seed_data.sql` to match documentation:
```sql
INSERT INTO formation_levels (name, order_index, description) VALUES
('Foundation', 1, 'Awaken responsibility. Establish prayer, structure, and accountability.'),
('Discipline', 2, 'Create consistency. Build habits, reduce excuses, increase execution.'),
('Brotherhood', 3, 'Move beyond self-improvement. Serve others, develop relationships.'),
('Leadership', 4, 'Guide others. Lead, serve, protect culture.'),
('Stewardship', 5, 'Build institutions. Long-term responsibility, legacy, mission protection.');
```

---

### 🟡 MEDIUM PRIORITY

#### 1.2 Discord Bot Command Prefix
**Files Affected:**
- `docs/04_DISCORD.md` (lines ~1469-1577)

**Issue:**
- Documentation now shows `/` prefix (correct)
- Some old references still show `!` prefix in places

**Fix Required:**
- Verify all bot commands use `/` slash commands consistently
- Remove any legacy `!command` references

#### 1.3 File Reference Updates After Renumbering
**Files Affected:**
- `docs/09_TECHNICAL_ARCHITECTURE.md` (may reference old file numbers)
- `docs/10_DATA_MODEL.md` (may reference old file numbers)
- `docs/27_DATABASE_REFERENCE.md` (may reference old file numbers)

**Issue:**
- After renumbering from 38→27 files, cross-references may be broken

**Fix Required:**
- Search all docs for patterns like `\d{2}_` or "file X" references
- Update to new numbering

---

## 2. DATABASE CHANGES NEEDED

### 🔴 HIGH PRIORITY

#### 2.1 Fix Formation Level Seed Data
**File:** `infra/supabase/supabase/migrations/003_seed_data.sql`

**Current (WRONG):**
```sql
('Novice', 1, 'Beginning formation...'),
('Builder', 2, 'Active in all pillars...'),
```

**Should Be (CORRECT):**
```sql
('Foundation', 1, 'Awaken responsibility...'),
('Discipline', 2, 'Create consistency...'),
```

#### 2.2 Add Missing Tables
**File:** `infra/supabase/supabase/migrations/`

**Missing Tables:**
- `formation_milestones` - Documented but not created
- `user_formation_milestones` - Documented but not created

**Fix Required:**
Create migration to add:
```sql
create table formation_milestones (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  pillar formation_pillar not null,
  threshold int not null,
  description text
);

create table user_formation_milestones (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  milestone_id uuid references formation_milestones(id),
  achieved_at timestamp default now()
);
```

---

### 🟡 MEDIUM PRIORITY

#### 2.3 Enhance Achievement Logic
**File:** `infra/supabase/supabase/migrations/001_initial_schema.sql`

**Current:** `check_achievements()` function is a placeholder

**Fix Required:**
Implement actual achievement checking logic based on criteria in achievements table

#### 2.4 Add Vocation Tracking UI
**Files:** `apps/web/src/app/(portal)/profile/page.tsx`

**Issue:** `vocation_state` enum exists but not displayed to users

**Fix Required:**
Add vocation selection to profile page

---

## 3. DISCORD BOT CHANGES NEEDED

### 🔴 HIGH PRIORITY

#### 3.1 Missing Prayer Module
**File:** `apps/bot/src/commands/`

**Missing Commands:**
- `/prayer request` - Submit prayer requests
- `/prayer answered` - Mark prayers as answered
- `/prayer list` - View prayer wall

**Implementation Required:**
Create `prayer.ts` command file with:
- Prayer request submission
- Prayer wall viewing
- Answered prayer tracking

#### 3.2 Missing Events Module
**File:** `apps/bot/src/commands/`

**Missing Commands:**
- `/event create` - Create community event
- `/event join` - Join an event
- `/event leave` - Leave an event
- `/event attendance` - View attendance

**Implementation Required:**
Create `event.ts` command file with event management

#### 3.3 Missing Leadership Module
**File:** `apps/bot/src/commands/`

**Missing Commands:**
- `/leaderboard` - View formation leaderboard
- `/member review` - Review member progress
- `/recommend promotion` - Recommend member for promotion
- `/pod health` - View pod health metrics
- `/community health` - View community health

**Implementation Required:**
Create `leadership.ts` command file (Officer+ only)

#### 3.4 Missing Administration Module
**File:** `apps/bot/src/commands/`

**Missing Commands:**
- `/warn` - Issue warning
- `/mute` - Mute member
- `/kick` - Kick member
- `/ban` - Ban member
- `/lockdown` - Lock channels
- `/announcement` - Post announcement

**Implementation Required:**
Create `admin.ts` command file with moderation tools

---

### 🟡 MEDIUM PRIORITY

#### 3.5 Complete Formation Module
**File:** `apps/bot/src/commands/checkin.ts`

**Current:** Only `/checkin` implemented
**Missing:** `/pray`, `/scripture`, `/mass`, `/rosary`, `/examen`

**Fix Required:**
Create separate command files or extend checkin with additional options

#### 3.6 Enhance Discord Sync
**File:** `apps/bot/src/commands/sync.ts`

**Current:** Basic role sync only
**Missing:** 
- Formation score sync to Discord roles
- Achievement announcements
- Rank-based channel access

**Fix Required:**
Extend sync to handle more complex Discord-Portal synchronization

---

## 4. WEB APP CHANGES NEEDED

### 🔴 HIGH PRIORITY

#### 4.1 Implement Notifications Page
**File:** `apps/web/src/app/(portal)/notifications/page.tsx`

**Current:** Stub or missing
**Required:** Full notifications system

**Implementation Required:**
```tsx
// Features needed:
- List all user notifications
- Mark as read/unread
- Notification preferences
- Push notifications (optional)
```

#### 4.2 Complete Rule of Life Builder
**File:** `apps/web/src/app/(portal)/rule-of-life/`

**Current:** Viewing only
**Required:** Full creation and editing

**Implementation Required:**
```tsx
// Features needed:
- Template selection (Universal, Student, Builder, etc.)
- Category customization
- Frequency settings
- Active/inactive toggling
- Version history
```

---

### 🟡 MEDIUM PRIORITY

#### 4.3 Complete Review System
**File:** `apps/web/src/app/(portal)/reviews/page.tsx`

**Current:** Basic structure
**Required:** Full weekly/monthly/quarterly/annual reviews

**Implementation Required:**
```tsx
// Features needed:
- Weekly review form (wins, failures, lessons, goals)
- Monthly review form
- Quarterly review form  
- Annual review form
- Historical view
- AI assistance (as documented)
```

#### 4.4 Complete Admin Dashboard
**File:** `apps/web/src/app/(portal)/admin/page.tsx`

**Current:** Stub page
**Required:** Full admin functionality

**Implementation Required:**
```tsx
// Features needed:
- Campaign management
- Certification management
- User management
- Analytics dashboard
- Content management
```

#### 4.5 Complete Projects Page
**File:** `apps/web/src/app/(portal)/projects/page.tsx`

**Current:** Basic structure
**Required:** Full project tracking

**Implementation Required:**
```tsx
// Features needed:
- Project creation
- Milestone tracking
- Progress updates
- Launch board/showcase
- Project templates
```

---

## 5. DOCUMENTATION COMPLETION

### 🟡 MEDIUM PRIORITY

#### 5.1 Add Discord Server Setup Guide
**File:** Create `docs/XX_DISCORD_SETUP.md`

**Issue:** Documentation describes Discord structure but not actual server setup

**Content Needed:**
- Step-by-step channel creation
- Role creation and permissions
- Category organization
- Bot setup instructions
- Verification flow

#### 5.2 Add API Documentation
**File:** `docs/13_API_SPECIFICATION.md`

**Issue:** Only describes endpoints, doesn't document:
- Authentication flows
- Error handling
- Rate limits
- Webhook configurations

**Fix Required:**
Expand API spec with complete documentation

#### 5.3 Add Deployment Guide
**File:** Create `docs/XX_DEPLOYMENT.md` or expand `docs/15_IMPLEMENTATION_ROADMAP.md`

**Content Needed:**
- Environment setup
- Database migrations
- Bot deployment (Railway/Fly.io)
- Web deployment (Vercel)
- CI/CD configuration
- Monitoring setup

#### 5.4 Update File References After Renumbering
**Files:** Multiple docs

**Issue:** Cross-references may be broken after 38→27 file renumbering

**Fix Required:**
Search and update all references:
```bash
grep -rn "\d{2}_[A-Z]" docs/
grep -rn "docs/\d" docs/
```

---

## 6. INTEGRATION CHANGES NEEDED

### 🟡 MEDIUM PRIORITY

#### 6.1 Supabase Realtime Integration
**Files:** 
- `apps/web/src/lib/supabase/client.ts`
- `apps/web/src/lib/supabase/server.ts`

**Issue:** Supabase Realtime available but unused

**Implementation Required:**
- Enable realtime subscriptions for notifications
- Live formation score updates
- Pod meeting reminders

#### 6.2 AI Features Implementation
**Files:** Multiple (documented but not implemented)

**Missing AI Features:**
- AI Rule Of Life Builder
- AI Weekly Review Assistant
- AI Formation Coach
- AI Journal Reflection Assistant
- AI Project Coach
- AI Accountability Assistant
- AI Mentor Assistant

**Implementation Required:**
Create AI service layer with OpenAI integration

---

## 7. TESTING GAPS

### 🟡 MEDIUM PRIORITY

#### 7.1 Add Database Tests
**Files:** Create `apps/web/src/__tests__/`

**Needed:**
- Formation event calculations
- Score aggregations
- RLS policy tests
- Trigger functionality tests

#### 7.2 Add Bot Tests
**Files:** Create `apps/bot/src/__tests__/`

**Needed:**
- Command parsing tests
- Database interaction tests
- Role sync tests

#### 7.3 Add E2E Tests
**Files:** Create `apps/e2e/` or use Playwright

**Needed:**
- User journey tests
- Discord-Portal integration tests
- Formation flow tests

---

## 8. PERFORMANCE & SECURITY

### 🟡 MEDIUM PRIORITY

#### 8.1 Add Database Connection Pooling
**File:** `infra/supabase/supabase/config.toml`

**Optimization:**
```toml
[server]
max_connections = 20
```

#### 8.2 Add Rate Limiting to Bot
**File:** `apps/bot/src/`

**Implementation Required:**
```typescript
// Add rate limiting middleware
// Prevent spam commands
// Add cooldown periods
```

#### 8.3 Add Input Validation
**Files:** All bot commands

**Implementation Required:**
- Sanitize all user inputs
- Validate data types
- Add error boundaries

---

## SUMMARY CHECKLIST

### Quick Wins (Do First)
- [ ] Fix formation level seed data in database
- [ ] Update any remaining `!` command references to `/`
- [ ] Search for broken cross-references after renumbering

### High Priority
- [ ] Implement Prayer module in bot
- [ ] Implement Events module in bot  
- [ ] Implement Leadership module in bot
- [ ] Implement Admin module in bot
- [ ] Implement Notifications page in web app
- [ ] Complete Rule of Life builder

### Medium Priority
- [ ] Add formation_milestones tables
- [ ] Complete Review system
- [ ] Complete Admin dashboard
- [ ] Add Discord server setup guide
- [ ] Add deployment guide
- [ ] Enable Supabase Realtime

### Nice to Have
- [ ] Implement AI features
- [ ] Add comprehensive tests
- [ ] Add rate limiting to bot
- [ ] Add vocation tracking UI

---

## FILE MANIFEST

### Files to CREATE:
1. `docs/XX_DISCORD_SETUP.md` - Server setup guide
2. `docs/XX_DEPLOYMENT.md` - Deployment instructions
3. `apps/bot/src/commands/prayer.ts` - Prayer module
4. `apps/bot/src/commands/event.ts` - Events module
5. `apps/bot/src/commands/leadership.ts` - Leadership module
6. `apps/bot/src/commands/admin.ts` - Admin module

### Files to MODIFY:
1. `infra/supabase/supabase/migrations/003_seed_data.sql` - Fix formation levels
2. `infra/supabase/supabase/migrations/XX_add_milestones.sql` - Add milestone tables
3. `docs/XX_IMPLEMENTATION_ROADMAP.md` - Add deployment section
4. `docs/13_API_SPECIFICATION.md` - Expand API docs
5. `apps/web/src/app/(portal)/notifications/page.tsx` - Complete notifications
6. `apps/web/src/app/(portal)/rule-of-life/page.tsx` - Complete rule builder

### Files to DELETE:
(None recommended at this time)

---

*Document created: 2024*
*Last updated: 2024*
