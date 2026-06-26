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
              <svg className="h-8 w-8 text-primary" viewBox="0 0 36 36" fill="none">
                <rect x="15" y="4" width="6" height="28" rx="1" fill="currentColor"/>
                <rect x="6" y="12" width="24" height="6" rx="1" fill="currentColor"/>
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
