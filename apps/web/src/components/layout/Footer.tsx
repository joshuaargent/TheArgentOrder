import Link from 'next/link';
import { siteConfig, footerNav } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <svg className="h-8 w-8" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="footerBlade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fafafa"/>
                    <stop offset="15%" stop-color="#e5e5e5"/>
                    <stop offset="50%" stop-color="#f5f5f5"/>
                    <stop offset="85%" stop-color="#71717a"/>
                    <stop offset="100%" stop-color="#52525b"/>
                  </linearGradient>
                  <linearGradient id="footerGuard" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e5e5e5"/>
                    <stop offset="50%" stop-color="#a3a3a3"/>
                    <stop offset="100%" stop-color="#525252"/>
                  </linearGradient>
                  <linearGradient id="footerHandle" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#52525b"/>
                    <stop offset="100%" stop-color="#27272a"/>
                  </linearGradient>
                </defs>
                <path d="M24 2L28 36H20L24 2Z" fill="url(#footerBlade)"/>
                <path d="M24 5L24.5 30" stroke="#71717a" stroke-width="1" stroke-linecap="round" stroke-opacity="0.6"/>
                <rect x="8" y="36" width="32" height="5" rx="1" fill="url(#footerGuard)"/>
                <rect x="8" y="36" width="32" height="1.5" rx="0.5" fill="#f5f5f5" fill-opacity="0.5"/>
                <rect x="20" y="41" width="8" height="5" rx="1" fill="url(#footerHandle)"/>
                <ellipse cx="24" cy="47" rx="5" ry="2" fill="url(#footerGuard)"/>
              </svg>
              <span className="font-bold text-lg">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Catholic Men. Forged in Discipline.
            </p>
            <p className="text-sm text-primary/80 font-medium">
              Build. Ship. Lead.
            </p>
          </div>

          {/* Main Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Portal</h3>
            <ul className="space-y-2">
              {footerNav.main.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Formation */}
          <div>
            <h3 className="font-semibold mb-4">Formation</h3>
            <ul className="space-y-2">
              {footerNav.formation.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerNav.resources.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Forged in Faith, Discipline, and Brotherhood.
            </p>
          </div>
          <div className="flex gap-6">
            {footerNav.legal.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
