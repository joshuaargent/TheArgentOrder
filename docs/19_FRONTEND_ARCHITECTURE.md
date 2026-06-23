# The Argent Order

## Frontend Architecture

Version: 1.0

Status: Canonical Portal Architecture

---

# Purpose

The Portal is not a social network.

The Portal is not a content platform.

The Portal is not a forum.

Discord handles conversation.

The Portal handles transformation.

The purpose of the Portal is to help a man become:

* More faithful
* More disciplined
* More capable
* More accountable
* More useful

Every screen should push a man toward action.

Not consumption.

Action.

---

# Core Design Principles

## Principle 1

Direction Over Information

Bad Dashboard:

```text id="bad1"
17 Widgets

12 Charts

3 News Feeds

Endless Data
```

Good Dashboard:

```text id="good1"
Today's Rule

Today's Campaign Task

Today's Pod Commitment

Current Formation Score

Next Action
```

A man should know what to do within 5 seconds.

---

## Principle 2

Action Before Content

Every page answers:

```text id="actionq"
What should I do next?
```

before:

```text id="contentq"
What should I read next?
```

---

## Principle 3

Progress Must Be Visible

Humans continue what they can measure.

The platform should continuously show:

* Streaks
* Campaign Progress
* Rule Completion
* Formation Growth
* Pod Accountability
* Builder Progress

---

# Technical Stack

Framework

```text id="stack1"
Next.js App Router
```

Language

```text id="stack2"
TypeScript
```

UI

```text id="stack3"
shadcn/ui
```

Styling

```text id="stack4"
Tailwind CSS
```

State

```text id="stack5"
TanStack Query
```

Forms

```text id="stack6"
React Hook Form
```

Validation

```text id="stack7"
Zod
```

Charts

```text id="stack8"
Recharts
```

Authentication

```text id="stack9"
Supabase Auth
```

---

# Navigation Structure

```text id="nav1"
Dashboard

Formation

Rule Of Life

Campaigns

Brotherhood

Builder Hall

Journal

Reviews

Achievements

Leadership

Settings
```

---

# Application Layout

Desktop

```text id="layout1"
---------------------------------

Sidebar

Main Content

Right Action Panel

---------------------------------
```

---

Mobile

```text id="layout2"
------------------

Header

Content

Bottom Navigation

------------------
```

---

# Sidebar

Permanent

Collapsed Option

Contains

```text id="sidebar"
Dashboard

Formation

Rule Of Life

Campaigns

Brotherhood

Builder Hall

Journal

Reviews

Achievements

Settings
```

---

# Global Header

Contains

```text id="header"
Current Rank

Formation Score

Notifications

Profile Menu
```

---

# Dashboard

Purpose

Show exactly what matters today.

---

Sections

## Mission Today

```text id="mission"
Primary Action

Current Campaign Task

Current Rule Item
```

---

## Formation Snapshot

```text id="formation"
Faith

Discipline

Brotherhood

Building

Truth
```

---

## Current Streaks

```text id="streaks"
Prayer

Rule Of Life

Reviews

Campaign
```

---

## Pod Status

```text id="podstatus"
Next Meeting

Pod Goal

Prayer Requests
```

---

## Builder Status

```text id="builderstatus"
Current Project

Next Milestone

Recent Progress
```

---

# Formation Module

Purpose

Track spiritual and personal growth.

---

Pages

```text id="formationpages"
Formation Overview

Faith

Discipline

Brotherhood

Building

Truth
```

---

Formation Overview

Shows

```text id="overview"
Current Score

Historical Progress

Milestones

Level
```

---

Faith Page

Actions

```text id="faithactions"
Log Prayer

Log Rosary

Log Mass

Log Scripture

Examen
```

---

Discipline Page

Actions

```text id="disciplineactions"
Wake Time

Exercise

Cold Shower

Rule Completion

Habit Tracking
```

---

Building Page

Actions

```text id="buildingactions"
Project Progress

Milestones

Learning

Creation
```

---

# Rule Of Life Module

Purpose

Daily execution system.

---

Main Screen

```text id="rulemain"
Today's Rule

Completed

Remaining

Completion %
```

---

Sections

```text id="rulesections"
Prayer

Work

Health

Learning

Brotherhood
```

---

User Actions

```text id="ruleactions"
Complete

Skip

Edit

Create
```

---

# Campaigns Module

Purpose

Structured formation journeys.

---

Campaign List

```text id="campaignlist"
Foundation

Discipline

Work

Brotherhood

Leadership
```

---

Campaign Detail

Contains

```text id="campaigndetail"
Description

Tasks

Resources

Progress

Discussion Link
```

---

Campaign Dashboard

```text id="campaigndash"
Current Campaign

Progress %

Days Remaining

Next Task
```

---

# Brotherhood Module

Purpose

Accountability and relationships.

---

Pages

```text id="brotherhoodpages"
My Pod

Members

Meetings

Prayer Requests

Mentorship
```

---

My Pod

Displays

```text id="mypod"
Members

Goals

Wins

Attendance

Prayer Requests
```

---

Mentorship

Displays

```text id="mentor"
Mentor

Meeting Notes

Recommendations

Growth Areas
```

---

# Builder Hall

Purpose

Turn members into builders.

This is the major differentiator.

---

Pages

```text id="builderpages"
Projects

Showcase

Milestones

Learning
```

---

Projects Dashboard

Displays

```text id="projectsdash"
Active Projects

Completed Projects

Milestones

Launches
```

---

Project Detail

Contains

```text id="projectdetail"
Overview

Milestones

Updates

Links

Progress
```

---

Showcase

Displays

```text id="showcase"
Member Projects

Launches

Wins

Case Studies
```

---

# Journal Module

Purpose

Reflection.

---

Pages

```text id="journalpages"
Journal

Examen

Gratitude
```

---

Journal Entry

```text id="journalentry"
Title

Content

Tags

Private/Public
```

---

# Reviews Module

Purpose

Periodic reflection.

---

Pages

```text id="reviewpages"
Weekly

Monthly

Quarterly

Annual
```

---

Review Structure

```text id="reviewstructure"
Wins

Failures

Lessons

Goals
```

---

# Achievements Module

Purpose

Recognition.

---

Pages

```text id="achievementpages"
Achievements

Certifications

Milestones
```

---

Achievements

Display

```text id="achievementdisplay"
Unlocked

Locked

Progress
```

---

# Leadership Module

Permission Required

```text id="leadershipperm"
Captain+
```

---

Pages

```text id="leadershippages"
Community Health

Pod Health

Promotions

Reviews

Analytics
```

---

Community Health

Displays

```text id="communityhealth"
Active Users

Campaign Completion

Retention

Formation Growth
```

---

# Notifications

Types

```text id="notificationtypes"
Achievement

Campaign

Reminder

Leadership

Pod
```

---

# Search

Global Search

Can Search

```text id="search"
Projects

Campaigns

Achievements

Members

Resources
```

---

# Mobile Experience

Critical.

Most members will use mobile.

---

Bottom Navigation

```text id="mobilenav"
Dashboard

Formation

Campaigns

Brotherhood

Builder Hall
```

---

Quick Actions

```text id="mobileactions"
Log Prayer

Complete Rule

Update Project

Submit Review
```

---

# Gamification Layer

Purpose

Reinforce behavior.

Never replace purpose.

---

Visible Systems

```text id="gamification"
Formation Score

Levels

Achievements

Certifications

Streaks

Campaign Progress
```

---

# AI Integration

Future Layer

---

AI Formation Coach

```text id="ai1"
Review formation data

Suggest improvements

Recommend next actions
```

---

AI Rule Builder

```text id="ai2"
Generate custom rule of life
```

---

AI Review Assistant

```text id="ai3"
Analyze reviews

Identify patterns
```

---

AI Builder Coach

```text id="ai4"
Help members launch projects
```

---

# Design Language

Visual Style

```text id="design1"
Clean

Strong

Masculine

Structured

Minimal
```

---

Avoid

```text id="avoid"
Bright Colors

Playful UI

Social Media Design

Infinite Feeds

Vanity Metrics
```

---

Emphasize

```text id="emphasize"
Direction

Progress

Clarity

Action

Brotherhood
```

---

# Final Principle

A member should never log into The Argent Order and wonder:

```text id="question"
What should I do today?
```

The platform should answer that question immediately.

Every page should move a man toward:

Faith

Discipline

Brotherhood

Building

Truth

and ultimately toward holiness, responsibility, and service.
