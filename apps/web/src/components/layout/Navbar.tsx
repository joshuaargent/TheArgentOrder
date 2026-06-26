"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mainNavGroups, siteConfig } from '@/lib/constants';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  Settings,
  Home,
  Flame,
  CheckSquare,
  Target,
  Users,
  BookOpen,
  Calendar,
  Briefcase,
  Trophy,
  BarChart3,
  Award
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  flame: Flame,
  'check-square': CheckSquare,
  target: Target,
  users: Users,
  'book-open': BookOpen,
  calendar: Calendar,
  briefcase: Briefcase,
  trophy: Trophy,
  'bar-chart': BarChart3,
  award: Award,
};

// ============================================
// Navbar Component - Premium Redesign
// ============================================

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { avatar_url?: string; full_name?: string } } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-[50] transition-all duration-300',
          isScrolled 
            ? 'bg-background/80 border-b border-border/50 backdrop-blur-xl shadow-lg shadow-black/5' 
            : 'bg-transparent'
        )}
        style={{ transform: 'translateZ(0)' }}
      >
        <nav className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2.5 group"
            >
              <div className="relative">
                <svg className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none">
                  <rect x="21" y="4" width="6" height="40" rx="1" className="fill-primary"/>
                  <rect x="8" y="14" width="32" height="6" rx="1" className="fill-primary"/>
                </svg>
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
            </Link>

            {/* Desktop Navigation - Grouped Dropdowns */}
            <div className="hidden items-center gap-1 lg:flex" ref={dropdownRef}>
              {mainNavGroups.map((group) => (
                <div key={group.label} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === group.label ? null : group.label)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      activeDropdown === group.label
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    {group.label}
                    <ChevronDown className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      activeDropdown === group.label && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-64 glass-strong rounded-xl shadow-xl shadow-black/20 overflow-hidden"
                      >
                        <div className="p-2">
                          {group.items.map((item) => {
                            const Icon = item.icon ? iconMap[item.icon] : null;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className={cn(
                                  'flex items-start gap-3 p-3 rounded-lg transition-all duration-150 group/item',
                                  isActive(item.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-accent/50'
                                )}
                              >
                                {Icon && (
                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                                    <Icon className="h-4 w-4 text-primary" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    'text-sm font-medium',
                                    isActive(item.href) ? 'text-primary' : 'text-foreground'
                                  )}>
                                    {item.label}
                                  </p>
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="ml-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Avatar
                      src={user.user_metadata?.avatar_url}
                      alt={user.email || 'User'}
                      fallback={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-foreground hidden xl:block">
                      {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={cn(
                      'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                      isUserMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl shadow-xl shadow-black/20 overflow-hidden"
                      >
                        <div className="p-2">
                          <div className="px-3 py-2 mb-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {user.user_metadata?.full_name || user.email?.split('@')[0]}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <div className="h-px bg-border/50 mx-2 my-1" />
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                          >
                            <User className="h-4 w-4 text-muted-foreground" />
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                          >
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            Settings
                          </Link>
                          <div className="h-px bg-border/50 mx-2 my-1" />
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-accent/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Full Screen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45] pt-20 lg:hidden overflow-y-auto"
          >
            <div className="absolute inset-0 mobile-menu-overlay backdrop-blur-md" />
            <nav className="relative container py-6">
              <div className="space-y-6">
                {mainNavGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                      {group.label}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon ? iconMap[item.icon] : null;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-150',
                              isActive(item.href)
                                ? 'bg-primary/10 text-primary'
                                : 'text-foreground hover:bg-accent/50'
                            )}
                          >
                            {Icon && (
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold">{item.label}</p>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile User Section */}
              <div className="mt-8 pt-6 border-t border-border/50">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors"
                    >
                      <Avatar
                        src={user.user_metadata?.avatar_url}
                        alt={user.email || 'User'}
                        fallback={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        size="md"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                        <p className="text-sm text-muted-foreground">View Profile</p>
                      </div>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors"
                    >
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5 text-destructive" />
                      <span className="text-destructive font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4">
                    <Link href="/login">
                      <Button variant="outline" className="w-full h-12">Sign In</Button>
                    </Link>
                  </div>
                )}

                {/* Theme Toggle for Mobile */}
                <div className="mt-6 px-4">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-medium transition-all duration-200 border border-border bg-card text-foreground hover:bg-accent/50"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-4 w-4" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
