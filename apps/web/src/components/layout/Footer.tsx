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
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="50%" stop-color="#d6d6d6"/>
                    <stop offset="100%" stop-color="#7a7a7a"/>
                  </linearGradient>
                  <linearGradient id="footerFuller" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#cfcfcf"/>
                    <stop offset="100%" stop-color="#6a6a6a"/>
                  </linearGradient>
                  <linearGradient id="footerGuard" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#4a4a4f"/>
                    <stop offset="100%" stop-color="#1a1a1d"/>
                  </linearGradient>
                  <linearGradient id="footerGrip" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#2c2c30"/>
                    <stop offset="100%" stop-color="#141417"/>
                  </linearGradient>
                  <radialGradient id="footerPommel" cx="40%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#f5f5f5"/>
                    <stop offset="100%" stop-color="#7a7a7a"/>
                  </radialGradient>
                </defs>
                <path d="M24 2 L27 32 Q24 34 21 32 Z" fill="url(#footerBlade)"/>
                <path d="M24 4 L25 30 Q24 31 23 30 Z" fill="url(#footerFuller)" opacity="0.55"/>
                <path d="M14 32 Q18 30 22 31 H26 Q30 30 34 32 Q30 34 26 33 H22 Q18 34 14 32 Z" fill="url(#footerGuard)"/>
                <rect x="21" y="33" width="6" height="8" rx="1" fill="url(#footerGrip)"/>
                <circle cx="24" cy="43" r="3.5" fill="url(#footerPommel)"/>
                <circle cx="24" cy="43" r="2" fill="#ffffff"/>
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
