# The Argent Order - API Index

Complete API documentation based on canonical specifications.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All protected routes require a Supabase auth token in the Authorization header:

```
Authorization: Bearer <supabase_token>
```

---

## Core Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/callback` | Auth callback |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile with formation data |
| PATCH | `/api/profile` | Update profile |

### Formation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/formation` | Get formation scores and recent events |
| POST | `/api/formation` | Log a formation event |

---

## Rule of Life

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rule-of-life` | Get user's rule of life |
| POST | `/api/rule-of-life` | Create new rule of life |
| POST | `/api/rule-of-life/items` | Add rule item |
| POST | `/api/rule-of-life/complete` | Complete rule item for today |

---

## Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create campaign (admin) |
| GET | `/api/campaigns/[slug]` | Get campaign details |
| POST | `/api/campaigns/[slug]/join` | Join a campaign |
| POST | `/api/campaigns/[slug]/leave` | Leave a campaign |
| POST | `/api/campaigns/task/complete` | Complete a campaign task |

---

## Brotherhood / Pods

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pods` | Get user's pod |
| POST | `/api/pods` | Create pod or join request |

---

## Mentorship

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mentorship` | Get current mentorship |
| POST | `/api/mentorship` | Request mentorship |

---

## Journal

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journal` | List journal entries |
| POST | `/api/journal` | Create journal entry |

---

## Examen

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/examen` | Get today's examen |
| POST | `/api/examen` | Complete daily examen |

---

## Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/weekly` | List weekly reviews |
| POST | `/api/reviews/weekly` | Create weekly review |
| GET | `/api/reviews/monthly` | List monthly reviews |
| POST | `/api/reviews/monthly` | Create monthly review |
| GET | `/api/reviews/quarterly` | List quarterly reviews |
| POST | `/api/reviews/quarterly` | Create quarterly review |

---

## Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create new project |

---

## Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/achievements` | List all achievements and user progress |

---

## Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| POST | `/api/notifications` | Mark notifications as read |

---

## Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get formation leaderboard |
| GET | `/api/leaderboard?pillar=faith` | Get by pillar |

---

## Discord

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/discord/link` | Link Discord account |
| POST | `/api/discord/verify` | Verify linking code |

---

## Response Formats

### Success Response

```json
{
  "data": { ... },
  "message": "Success"
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Pagination

List endpoints support pagination:

```
GET /api/resource?limit=20&offset=0
```

---

## Rate Limits

- General API: 100 requests/minute
- Auth endpoints: 10 requests/minute
- Write operations: 30 requests/minute

---

## Webhook Events

Subscribe to events for real-time updates:

- `formation.updated` - Formation scores changed
- `campaign.joined` - User joined campaign
- `campaign.completed` - Campaign completed
- `achievement.earned` - Achievement unlocked
- `rank.promoted` - User was promoted
