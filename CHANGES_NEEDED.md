# The Argent Order - Changes Needed

This document lists all changes required to bring the codebase and documentation into alignment.

---

## ✅ COMPLETED FIXES

| Fix | Status | Commit |
|-----|--------|--------|
| Documentation cross-references | Fixed all broken refs | e0515b3 |
| README outdated file list | Fixed | e0515b3 |
| Bot command prefix (! → /) | Fixed | a408293 |
| Pod size consistency (5-8) | Fixed | a408293 |
| Database tables (55) | All documented | 458118d |
| Table naming | Fixed `rule_of_life` → `rules_of_life` | 458118d |

---

## ✅ DATABASE AUDIT - COMPLETE

| Component | Status |
|-----------|--------|
| Schema files | 2 files (11_DATABASE_SCHEMA.sql, 12_RLS_POLICIES.sql) |
| Total tables | 55 |
| Tables documented | 55 (100%) |
| RLS policies | 49 tables (6 intentional: analytics_events, articles, newsletters, leadership_reviews, promotion_recommendations, rule_categories) |
| Seed data | Implemented |

---

## 🔴 HIGH PRIORITY - Discord Bot

### Missing Commands to Implement

| Module | Commands | File to Create |
|--------|----------|----------------|
| Prayer | `/prayer request`, `/prayer answered`, `/prayer list` | `apps/bot/src/commands/prayer.ts` |
| Events | `/event create`, `/event join`, `/event leave`, `/event attendance` | `apps/bot/src/commands/event.ts` |
| Leadership | `/leaderboard`, `/member review`, `/recommend promotion`, `/pod health`, `/community health` | `apps/bot/src/commands/leadership.ts` |
| Admin | `/warn`, `/mute`, `/kick`, `/ban`, `/lockdown`, `/announcement` | `apps/bot/src/commands/admin.ts` |

### Current Bot Commands (Working)
- `/link`, `/unlink`, `/profile` - Authentication
- `/sync` - Role sync
- `/checkin` - Formation tracking
- `/campaign` - Campaign management
- `/pod` - Pod management
- `/project` - Project tracking
- `/grind`, `/pray`, `/mass`, `/scripture`, `/streak` - Additional formation

---

## 🔴 HIGH PRIORITY - Web App

### Missing/Incomplete Pages

| Page | File | Status |
|------|------|--------|
| Notifications | `apps/web/src/app/(portal)/notifications/page.tsx` | Not implemented |
| Rule of Life Builder | `apps/web/src/app/(portal)/rule-of-life/` | View only, no creation |
| Review System | `apps/web/src/app/(portal)/reviews/page.tsx` | Basic structure only |
| Admin Dashboard | `apps/web/src/app/(portal)/admin/page.tsx` | Stub page only |

---

## 🟡 MEDIUM PRIORITY

### Database

| Item | Status | Notes |
|------|--------|-------|
| Achievement logic | Placeholder | `check_achievements()` needs implementation |
| Vocation tracking UI | Missing | Profile page needs vocation selector |
| Supabase Realtime | Unused | Notifications, live updates not enabled |

### Discord Bot

| Item | Status | Notes |
|------|--------|-------|
| Formation module | Partial | Only `/checkin` done, need separate `/pray`, `/scripture`, `/mass`, `/rosary`, `/examen` |
| Discord sync | Basic | Needs formation score sync, achievement announcements, rank-based channels |

### Web App

| Item | Status | Notes |
|------|--------|-------|
| Projects page | Basic | Needs full creation, milestones, progress tracking |
| Brotherhood page | Basic | Needs pod dashboard, accountability features |
| Profile page | Basic | Needs vocation tracking, builder showcase |

---

## 🟢 LOW PRIORITY

### Documentation

| Item | Status |
|------|--------|
| Discord Server Setup Guide | Needs to be created |
| Deployment Guide | Needs to be created |
| AI Features | Documented but not implemented (6 AI assistants) |

### Testing

| Item | Status |
|------|--------|
| Database tests | None |
| Bot tests | None |
| E2E tests | None |

### Performance

| Item | Status |
|------|--------|
| Bot rate limiting | Not implemented |
| Input validation | Basic |
| Connection pooling | Default |

---

## SUMMARY

| Category | Complete | Remaining |
|----------|----------|-----------|
| Documentation | 100% | ✅ |
| Database Schema | 100% | ✅ |
| Discord Bot | 50% | 4 modules |
| Web App | 70% | 4 pages |
| **Overall** | **~80%** | - |

---

*Last updated: June 2024*
*Committed to: main (458118d)*
