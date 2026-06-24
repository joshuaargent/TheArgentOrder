# Database Reference Guide

## Overview

The Argent Order uses PostgreSQL via Supabase. The database is designed around an **event-driven formation system** where all progression originates from logged events.

## Design Principles

1. **Formation is Event-Driven** - All scores and achievements originate from formation events
2. **Brotherhood is Structural** - Pods and mentorship are mandatory for engagement
3. **Building is First-Class** - The Builder system is a core differentiator
4. **Everything is Auditable** - All state changes are tracked
5. **No Silent State Changes** - Changes are made through functions/triggers

## Migration Files

| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | Core tables, enums, basic indexes |
| `002_rls_policies.sql` | Row Level Security policies |
| `003_seed_data.sql` | Achievements, campaigns seed data |
| `004_add_discord_link_codes.sql` | Discord account linking |
| `005_add_missing_tables.sql` | Additional tables, expanded seed data |
| `006_certifications.sql` | Certification system |
| `007_database_improvements.sql` | Views, helper functions, indexes |

## Enums (Global Types)

### formation_pillar
- `faith` - Prayer, sacraments, scripture
- `discipline` - Habits, fitness, execution
- `brotherhood` - Community, accountability
- `building` - Projects, businesses, creation
- `truth` - Learning, apologetics, reason

### campaign_status
- `not_started` - Campaign not yet started
- `active` - Campaign in progress
- `completed` - Campaign finished
- `abandoned` - User abandoned the campaign

### pod_role
- `member` - Regular pod member
- `captain` - Pod leader
- `mentor` - Pod mentor

### project_status
- `idea` - Project conceived but not started
- `building` - Project in development
- `launched` - Project live
- `scaled` - Project at scale
- `abandoned` - Project discontinued

### leadership_level
- `initiate` - New member
- `brother` - Full member
- `veteran` - Proven member
- `captain` - Pod leader
- `officer` - Guardian of culture
- `mentor` - Leadership developer
- `steward` - Custodian of the Order

## Core Tables

### Identity Domain

#### profiles
User accounts and basic information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Auth user ID (unique) |
| email | text | User email |
| display_name | text | Display name |
| bio | text | User biography |
| avatar_url | text | Profile image URL |
| timezone | text | User timezone |
| vocation | vocation_state | Single, dating, engaged, married, father |

#### ranks
The 8 formation ranks.

| Name | Order | Description |
|------|-------|-------------|
| Visitor | 1 | Exploring, no commitments |
| Initiate | 2 | Beginning formation |
| Brother | 3 | Active member |
| Veteran | 4 | Proven member |
| Captain | 5 | Pod leader |
| Officer | 6 | Guardian of culture |
| Mentor | 7 | Leadership developer |
| Steward | 8 | Custodian of the Order |

#### user_ranks
Tracks user's rank history.

#### formation_levels
Gamification levels (Foundation, Discipline, Brotherhood, Leadership, Stewardship).

---

## Formation System

### formation_events
**The source of truth.** All formation activity is logged here.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User reference |
| pillar | formation_pillar | Which pillar |
| points | int | Points earned |
| reason | text | Description |
| metadata | jsonb | Additional data |
| created_at | timestamp | When it happened |

### formation_scores
**Denormalized scores** for fast reads. Automatically updated via trigger.

| Column | Type |
|--------|------|
| user_id | uuid |
| faith_score | int |
| discipline_score | int |
| brotherhood_score | int |
| building_score | int |
| truth_score | int |
| overall_score | int (computed) |

### formation_pillars
Metadata for each pillar.

### formation_milestones
Trackable milestones per pillar.

---

## Rule of Life

### rules_of_life
User's Rule of Life configuration.

### rule_categories
Categories for rule items (Prayer, Fitness, Work, Learning, Family, Rest).

### rule_items
Individual rules within a Rule of Life.

### rule_logs
Daily completion logs for rule items.

---

## Campaigns

### campaigns
Seasonal challenges and sprints.

| Column | Type |
|--------|------|
| slug | text (unique) |
| title | text |
| description | text |
| campaign_type | text (lent, advent, sprint, permanent) |
| difficulty | text (beginner, intermediate, advanced) |
| duration_days | int |
| active | boolean |

### campaign_tasks
Tasks within a campaign.

### campaign_enrollments
User enrollment in campaigns.

### campaign_progress
Per-task progress tracking.

---

## Brotherhood

### pods
Small groups for accountability.

| Column | Type |
|--------|------|
| name | text |
| description | text |
| captain_id | uuid |
| mentor_id | uuid |

### pod_members
Membership in pods.

### pod_meetings
Scheduled pod meetings.

### pod_attendance
Attendance tracking.

### mentorships
Mentor-mentee relationships.

---

## Builder System

### projects
User projects and ventures.

| Column | Type |
|--------|------|
| title | text |
| description | text |
| status | project_status |
| repo_url | text |
| live_url | text |

### project_milestones
Project milestones.

### project_updates
Progress updates.

### project_showcases
Featured projects.

---

## Journal & Reviews

### journal_entries
Personal reflections. Has visibility (private, pod, public).

### examens / examen_entries
Daily spiritual examination (Examen of Consciousness).

### weekly_reviews / monthly_reviews / quarterly_reviews / annual_reviews
Periodic reflection system.

### gratitude_entries
Gratitude logging.

---

## Achievements & Certifications

### achievements
Gamification achievements.

| Column | Type |
|--------|------|
| slug | text (unique) |
| name | text |
| description | text |
| icon | text |
| category | text |
| points | int |
| criteria | jsonb |

### certifications
Advanced track certifications with requirements.

| Column | Type |
|--------|------|
| slug | text (unique) |
| name | text |
| category | text |
| requirements | jsonb |
| points_required | int |

---

## Discord Integration

### discord_accounts
Links Discord users to portal accounts.

### discord_link_codes
Temporary codes for linking.

### discord_roles
Discord role mapping.

### discord_sync_events
Sync audit log.

---

## Admin & Analytics

### notifications
User notifications.

### moderation_actions
Moderation action log.

### audit_logs
System audit trail.

### leadership_reviews
Leadership feedback.

### promotion_recommendations
Rank promotion recommendations.

### analytics_events / formation_snapshots
Analytics tracking.

---

## Useful Views

### v_user_formation_summary
User profile + scores + rank.

### v_leaderboard
Top 100 by formation score.

### v_campaigns_with_tasks
Campaigns with task counts.

### v_user_pods
User pod membership details.

### v_project_progress
Project completion tracking.

---

## Useful Functions

### calculate_formation_scores(p_user_id)
Recalculates scores from events. Triggered automatically.

### get_pillar_streak(p_user_id, p_pillar)
Returns current streak for a pillar.

### get_overall_streak(p_user_id)
Returns overall formation streak.

### assign_rank_if_eligible(p_user_id)
Auto-assigns rank based on score thresholds.

### check_user_certifications(user_id)
Checks and awards eligible certifications.

### create_daily_formation_snapshot(p_user_id, p_date)
Creates daily snapshot for analytics.

---

## RLS Policy Overview

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| profiles | Everyone | - | Own | - |
| formation_events | Everyone | Own | - | - |
| formation_scores | Own | Via trigger | - | - |
| rules_of_life | Own | Own | Own | Own |
| campaigns | Active only | - | - | - |
| pods | Everyone | - | Captains | - |
| projects | Own | Own | Own | Own |
| achievements | Everyone | - | - | - |
| discord_accounts | Own | Own | Own | Own |

---

## Indexes

Key indexes for performance:

```sql
-- Formation events (critical for leaderboards)
idx_formation_events_user_pillar_created
idx_formation_events_recent

-- Profiles
idx_profiles_user_id
idx_profiles_email

-- Formation scores
idx_formation_scores_overall

-- Campaign
idx_campaign_enrollments_user_status
idx_campaign_tasks_campaign

-- Pods
idx_pod_members_user_pod
```

---

## Score Calculation

Formation scores are calculated as **sum of points from last 90 days**:

```sql
faith_score = SUM(points) WHERE pillar = 'faith' AND created_at > now() - 90 days
```

Rank thresholds:
- Initiate: 0+
- Brother: 100+
- Veteran: 300+
- Captain: 600+
- Officer: 1000+
- Mentor: 1500+
- Steward: 2500+

---

## Seed Data

### 8 Ranks
Visitor → Initiate → Brother → Veteran → Captain → Officer → Mentor → Steward

### 5 Formation Levels
Foundation → Discipline → Brotherhood → Leadership → Stewardship

### 6 Rule Categories
Prayer, Fitness, Work, Learning, Family, Rest

### Sample Campaigns
- Lent 2026 (40 days)
- Advent 2026 (24 days)
- 30 Days of Examen
- Q1 Deep Work Sprint
- Prayer Warrior Challenge
- St. Joseph Novena
- 90-Day Fitness
- 2026 Reading Challenge

### Certifications
- Builder Foundation → Apprentice → Master
- Discipline Week Warrior → Month of Steel → Champion
- Brotherhood Foundation, Pod Leader, Mentor
- Faith Walker → Warrior
- Leadership Veteran → Captain → Officer
