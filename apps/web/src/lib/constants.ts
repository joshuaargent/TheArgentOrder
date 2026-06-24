// ============================================
// Site Configuration - The Argent Order
// ============================================

export const siteConfig = {
  name: 'The Argent Order',
  description: 'Catholic Formation Operating System for Builders',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://argentorder.com',
  ogImage: '/og-image.png',
  author: {
    name: 'The Argent Order',
    bio: 'Catholic Formation Operating System for Builders',
  },
};

// ============================================
// Metadata
// ============================================

export const meta = {
  title: 'The Argent Order - Catholic Formation Operating System',
  description: 'Catholic Formation Operating System for Builders. Build faith, discipline, brotherhood, and projects.',
  keywords: ['catholic', 'formation', 'discipleship', 'brotherhood', 'builders', 'faith', 'discipline'] as string[],
  siteName: 'The Argent Order',
};

// ============================================
// Navigation
// ============================================

export const mainNav = [
  { label: 'Dashboard', href: '/dashboard', icon: 'home' },
  { label: 'Formation', href: '/formation', icon: 'flame' },
  { label: 'Rule of Life', href: '/rule-of-life', icon: 'check-square' },
  { label: 'Campaigns', href: '/campaigns', icon: 'target' },
  { label: 'Brotherhood', href: '/brotherhood', icon: 'users' },
  { label: 'Journal', href: '/journal', icon: 'book-open' },
  { label: 'Reviews', href: '/reviews', icon: 'calendar' },
  { label: 'Projects', href: '/projects', icon: 'briefcase' },
  { label: 'Achievements', href: '/achievements', icon: 'trophy' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'bar-chart' },
];

export const footerNav = {
  main: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Formation', href: '/formation' },
    { label: 'Rule of Life', href: '/rule-of-life' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Brotherhood', href: '/brotherhood' },
    { label: 'Journal', href: '/journal' },
  ],
  formation: [
    { label: 'Formation Overview', href: '/formation' },
    { label: 'Faith', href: '/formation/faith' },
    { label: 'Discipline', href: '/formation/discipline' },
    { label: 'Brotherhood', href: '/formation/brotherhood' },
    { label: 'Building', href: '/formation/building' },
    { label: 'Truth', href: '/formation/truth' },
  ],
  resources: [
    { label: 'Reviews', href: '/reviews' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Settings', href: '/settings' },
  ],
};

// ============================================
// Five Pillars
// ============================================

export const pillars = [
  {
    id: 'faith',
    name: 'Faith',
    icon: '✝️',
    description: 'Prayer, Mass, Scripture, Rosary',
    color: '#6366f1',
  },
  {
    id: 'discipline',
    name: 'Discipline',
    icon: '⚔️',
    description: 'Habits, Execution, Fitness',
    color: '#f97316',
  },
  {
    id: 'brotherhood',
    name: 'Brotherhood',
    icon: '🤝',
    description: 'Community, Mentorship, Pods',
    color: '#22c55e',
  },
  {
    id: 'building',
    name: 'Building',
    icon: '🏗️',
    description: 'Projects, Creation, Launch',
    color: '#eab308',
  },
  {
    id: 'truth',
    name: 'Truth',
    icon: '📖',
    description: 'Learning, Apologetics, Wisdom',
    color: '#8b5cf6',
  },
];

// ============================================
// Role Hierarchy
// ============================================

export const roles = {
  initiate: { name: 'Initiate', level: 1, description: 'New member in onboarding' },
  brother: { name: 'Brother', level: 2, description: 'Full member of the Order' },
  veteran: { name: 'Veteran', level: 3, description: 'Established member with tenure' },
  captain: { name: 'Captain', level: 4, description: 'Pod leader' },
  officer: { name: 'Officer', level: 5, description: 'Community leadership' },
  mentor: { name: 'Mentor', level: 6, description: 'Formation mentor' },
  steward: { name: 'Steward', level: 7, description: 'Institutional steward' },
};
