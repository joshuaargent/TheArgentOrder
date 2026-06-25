// ============================================
// Site Configuration - The Argent Order
// ============================================

export const siteConfig = {
  name: 'The Argent Order',
  description: 'Catholic men forged in discipline. Build. Ship. Lead. Not a community. A forge.',
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
  title: 'The Argent Order - Catholic Formation for Builders',
  description: 'Catholic men forged in discipline. Build. Ship. Lead. Not a community. A forge.',
  keywords: ['catholic', 'formation', 'discipleship', 'brotherhood', 'builders', 'faith', 'discipline'] as string[],
  siteName: 'The Argent Order',
};

// ============================================
// Navigation - Simplified for Better UX
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const mainNavGroups: NavGroup[] = [
  {
    label: 'Execute',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'home', description: 'Command Center' },
      { label: 'Formation', href: '/formation', icon: 'flame', description: 'Track your growth' },
      { label: 'Rule of Life', href: '/rule-of-life', icon: 'check-square', description: 'Daily execution' },
    ],
  },
  {
    label: 'Build',
    items: [
      { label: 'WORKSHOP', href: '/workshop', icon: 'briefcase', description: 'Ship or be shipped' },
      { label: 'Campaigns', href: '/campaigns', icon: 'target', description: '90-day transformations' },
      { label: 'Achievements', href: '/achievements', icon: 'trophy', description: 'Earn your stripes' },
    ],
  },
  {
    label: 'Brotherhood',
    items: [
      { label: 'Pods', href: '/brotherhood', icon: 'users', description: 'Accountability units' },
      { label: 'Journal', href: '/journal', icon: 'book-open', description: 'Daily examen' },
      { label: 'Reviews', href: '/reviews', icon: 'calendar', description: 'Weekly & monthly' },
    ],
  },
  {
    label: 'Lead',
    items: [
      { label: 'Leaderboard', href: '/leaderboard', icon: 'bar-chart', description: 'Rankings' },
      { label: 'Certifications', href: '/certifications', icon: 'award', description: 'Credentials' },
    ],
  },
];

// Flat navigation for simple display (dropdown items)
export const mainNav = mainNavGroups.flatMap(group => group.items);

// Quick actions for dashboard
export const quickActions = [
  { label: 'Log Prayer', href: '/formation', icon: 'cross', points: '+10' },
  { label: 'Complete Rule', href: '/rule-of-life', icon: 'check', points: '+15' },
  { label: 'Add Journal Entry', href: '/journal', icon: 'pen', points: '+5' },
  { label: 'Submit Review', href: '/reviews', icon: 'calendar', points: '+20' },
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
    icon: 'cross',
    description: 'Prayer, Mass, Scripture, Rosary',
    color: '#6366f1',
  },
  {
    id: 'discipline',
    name: 'Discipline',
    icon: 'cross',
    description: 'Habits, Execution, Fitness',
    color: '#f97316',
  },
  {
    id: 'brotherhood',
    name: 'Brotherhood',
    icon: 'users',
    description: 'Community, Mentorship, Pods',
    color: '#22c55e',
  },
  {
    id: 'building',
    name: 'Building',
    icon: 'hammer',
    description: 'Projects, Creation, Launch',
    color: '#eab308',
  },
  {
    id: 'truth',
    name: 'Truth',
    icon: 'book',
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
