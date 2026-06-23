# The Argent Order
## Data Model

Version: 1.0

Status: Canonical System Design

---

# Purpose

This document defines every major domain, entity, relationship, ownership rule, and data flow within The Argent Order.

This is the bridge between:

Vision

↓

Product

↓

Database

↓

Software

No SQL should be written until this document is approved.

---

# Core Design Philosophy

The Order is not:

A social network

A course platform

A productivity app

A habit tracker

---

The Order is:

A Catholic Formation Operating System

Every entity must support formation.

Every relationship must support brotherhood.

Every event must support transformation.

---

# System Domains

The platform consists of twelve major domains.

Identity

Formation

Rule Of Life

Campaigns

Brotherhood

Builder

Journal

Reviews

Achievements

Leadership

Discord

Analytics

---

====================================================
IDENTITY DOMAIN
====================================================

# Purpose

Defines who a member is.

Tracks identity, progression, permissions, and lifecycle.

---

# Entities

Profile

Rank

Formation Level

Role

Settings

---

# Profile

Represents a member.

One profile per user.

---

Attributes

Display Name

Avatar

Biography

Timezone

Country

Join Date

Status

---

Relationships

User -> Profile

Profile -> Rank

Profile -> Formation Level

Profile -> Pod Membership

Profile -> Campaign Enrollment

Profile -> Reviews

Profile -> Projects

---

# Rank

Represents responsibility.

Not spiritual maturity.

Not worth.

---

Examples

Initiate

Brother

Veteran

Captain

Officer

Mentor

Steward

---

# Formation Level

Represents development.

Independent from rank.

---

Examples

Foundation

Discipline

Brotherhood

Leadership

Stewardship

---

====================================================
FORMATION DOMAIN
====================================================

# Purpose

Tracks transformation.

This is the heart of the platform.

---

# Core Principle

Formation is event-driven.

Nothing is updated manually.

Everything originates from events.

---

# Entity

Formation Event

---

Examples

Prayer Logged

Mass Attended

Workout Completed

Campaign Finished

Review Submitted

Project Launched

Mentorship Session

---

Each event contains:

User

Pillar

Points

Reason

Timestamp

Metadata

---

# Formation Score

Derived entity.

Never manually edited.

Calculated from events.

---

Pillars

Faith

Discipline

Brotherhood

Building

Truth

---

Output

Faith Score

Discipline Score

Brotherhood Score

Building Score

Truth Score

Overall Score

---

====================================================
RULE OF LIFE DOMAIN
====================================================

# Purpose

Provides structure.

Every member should possess a Rule Of Life.

---

# Rule Of Life

Versioned document.

Historical records preserved.

---

# Categories

Prayer

Fitness

Work

Learning

Family

Rest

Builder

---

# Rule Item

Represents one commitment.

Examples

Morning Prayer

Rosary

Workout

Deep Work

Reading

Evening Review

---

# Rule Log

Represents completion.

Creates formation events.

---

====================================================
CAMPAIGN DOMAIN
====================================================

# Purpose

Primary transformation engine.

---

# Campaign

A structured challenge.

Examples

Foundation Campaign

Discipline Campaign

Saint Joseph Campaign

Builder Sprint

Lent Campaign

---

# Campaign Components

Campaign

↓

Phases

↓

Tasks

↓

Progress

↓

Completion

---

# Campaign Enrollment

Represents participation.

One user.

One campaign.

One progress record.

---

# Campaign Task

Represents actionable work.

Examples

Read Scripture

Workout

Launch MVP

Attend Meeting

Complete Reflection

---

====================================================
BROTHERHOOD DOMAIN
====================================================

# Purpose

Creates accountability.

Retention engine of the Order.

---

# Pod

Primary brotherhood unit.

Target Size

6 Men

Maximum

10 Men

---

# Pod Membership

Tracks membership.

History preserved.

---

# Pod Meeting

Weekly gathering.

---

Tracks

Attendance

Notes

Goals

Prayer Requests

---

# Mentorship

Relationship between mentor and member.

---

Tracks

Meetings

Notes

Goals

Progress

---

====================================================
BUILDER DOMAIN
====================================================

# Purpose

Develop builders.

Primary differentiator of the Order.

---

# Project

Represents value creation.

Examples

Website

Business

App

Book

Course

Agency

Ministry

---

# Project Milestone

Major progress marker.

Examples

MVP Complete

First User

Launch

Revenue

Version 2

---

# Project Update

Progress log.

Creates formation events.

---

# Builder Showcase

Public project display.

Visible to community.

---

====================================================
JOURNAL DOMAIN
====================================================

# Purpose

Reflection.

Self-awareness.

Spiritual growth.

---

# Journal Entry

Free-form reflection.

---

# Examen Entry

Structured spiritual review.

---

Questions

What went well?

What failed?

Where did I encounter God?

What needs improvement?

---

# Gratitude Entry

Blessings recorded.

---

====================================================
REVIEWS DOMAIN
====================================================

# Purpose

Periodic evaluation.

---

# Review Types

Weekly

Monthly

Quarterly

Annual

---

# Review Components

Wins

Failures

Lessons

Goals

Reflection

---

Review completion generates formation events.

---

====================================================
ACHIEVEMENT DOMAIN
====================================================

# Purpose

Recognition.

Not vanity.

---

# Achievement

Permanent milestone.

Examples

30 Days Prayer

Campaign Completion

Project Launch

Pod Leadership

Mentor Certification

---

# Certification

Demonstrates competence.

Examples

Rule Of Life Certified

Mentor Certified

Builder Certified

Pod Leader Certified

---

# Streak

Measures consistency.

Examples

Prayer

Workout

Deep Work

Scripture

Rule Of Life

---

====================================================
LEADERSHIP DOMAIN
====================================================

# Purpose

Scale culture.

Develop future leaders.

---

# Leadership Appointment

Records promotion.

---

Tracks

Who promoted

Why

Evidence

Date

---

# Leadership Review

Periodic evaluation.

---

# Promotion Recommendation

Recommendation for advancement.

---

====================================================
DISCORD DOMAIN
====================================================

# Purpose

Integrate portal and community.

---

# Discord Account

Linked identity.

Portal ↔ Discord

---

# Discord Role Mapping

Synchronizes ranks.

---

Examples

Brother

Captain

Mentor

Steward

---

# Discord Event

Tracks synchronization.

Auditable.

---

====================================================
ANALYTICS DOMAIN
====================================================

# Purpose

Measure formation effectiveness.

---

# Analytics Event

Tracks user actions.

Examples

Campaign Joined

Campaign Completed

Review Submitted

Project Created

Pod Attended

---

# Snapshot

Daily

Weekly

Monthly

---

Stores

Formation Trends

Retention Trends

Campaign Trends

Growth Trends

---

====================================================
OWNERSHIP RULES
====================================================

# Member Owns

Profile

Rule Of Life

Journal

Reviews

Projects

Formation History

---

# Pod Leaders Access

Pod Data

Pod Attendance

Pod Reviews

Pod Metrics

---

# Mentors Access

Assigned Members

Mentorship Records

Formation Progress

---

# Officers Access

Operational Data

Moderation Data

Community Metrics

---

# Stewards Access

Institution-Level Data

Leadership Systems

Strategic Metrics

---

====================================================
SYSTEM OF RECORD
====================================================

Identity

Profiles

---

Formation

Formation Events

---

Brotherhood

Pod Memberships

---

Projects

Projects

---

Reviews

Review Records

---

Achievements

Achievement Records

---

Never duplicate the source of truth.

---

# Final Principle

Every entity in the system exists to answer one question:

"Is this helping a man become more faithful, disciplined, brotherly, capable, truthful, and holy?"

If the answer is no, the entity should not exist.
