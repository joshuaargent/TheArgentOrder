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
              <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="footerCrossVert" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#525252"/>
                    <stop offset="50%" stop-color="#d4d4d4"/>
                    <stop offset="100%" stop-color="#525252"/>
                  </linearGradient>
                  <linearGradient id="footerCrossHoriz" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f5f5f5"/>
                    <stop offset="50%" stop-color="#a3a3a3"/>
                    <stop offset="100%" stop-color="#525252"/>
                  </linearGradient>
                </defs>
                <rect x="20" y="6" width="8" height="36" rx="1" fill="#27272a" opacity="0.3"/>
                <rect x="8" y="14" width="32" height="8" rx="1" fill="#27272a" opacity="0.3"/>
                <rect x="19" y="4" width="10" height="38" rx="2" fill="url(#footerCrossVert)"/>
                <rect x="6" y="12" width="36" height="10" rx="2" fill="url(#footerCrossHoriz)"/>
                <rect x="6" y="12" width="36" height="3" rx="1" fill="#ffffff" opacity="0.4"/>
                <rect x="19" y="4" width="3" height="38" rx="1" fill="#ffffff" opacity="0.25"/>
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
