'use client';

import './globals.css';
import Link from 'next/link';
import MobileSidebar from '@/components/MobileSidebar';
import ThemeToggle from '@/components/ThemeToggle';
import { Analytics } from '@vercel/analytics/next';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const links = [
  { href: '/', label: 'Home', icon: 'ph ph-house' },
  { href: '/players', label: 'Players', icon: 'ph ph-users-three' },
  { href: '/leaderboards', label: 'Leaderboards', icon: 'ph ph-chart-bar' },
  { href: '/familia', label: 'Familia', icon: 'ph ph-shield-star' },
  // { href: '/allcards', label: 'Cards', icon: 'ph ph-cards' }
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const mainContainerClasses = isHomePage ? "w-full" : "mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8";
  const navBarVisibility = isHomePage && !hasScrolled ? '-translate-y-full' : 'translate-y-0';
  const headerClasses = `fixed top-0 w-full z-40 backdrop-blur-lg transition-all duration-300 ${hasScrolled ? 'border-b border-slate-200 bg-white/50 dark:border-white/10 dark:bg-slate-900/30' : isHomePage ? 'bg-slate-900/30' : 'bg-transparent'} ${navBarVisibility}`;


  return (
    <html lang="en" className="dark">
      <head>
        <title>ZEN</title>
        <link rel="icon" href="/favicon.ico?v=2" />
        <script src="https://cdn.tailwindcss.com" />
        <script dangerouslySetInnerHTML={{ __html: `tailwind.config = { darkMode: 'class' }` }} />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@600;700&family=Bricolage+Grotesque:wght@500;700&family=Google+Sans+Flex:wght@500&family=Inter:wght@400;600;700&family=Manrope:wght@500;700;800&family=Poppins:wght@500;700&family=DM+Serif+Display&family=Caveat:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#c7d2fe_0%,#f8fafc_45%,#e2e8f0_100%)] dark:bg-[radial-gradient(circle_at_top,#303a6a_0%,#05070f_55%,#03040a_100%)]" />
        <header className={headerClasses}>
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <img src="/zen-logo.svg" alt="ZEN Logo" className="h-12 w-auto dark:invert" />
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 font-metric text-sm text-slate-700 transition hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-white/10">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <MobileSidebar links={links} />
            </div>
          </div>
        </header>
        <div className={mainContainerClasses}>{children}</div>
        <Analytics />
        <footer className="bg-transparent p-4 text-center border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-center gap-4">
            <img src="/z-logo.svg" alt="ZEN Logo" className="h-6 w-auto dark:invert" />
            <p className="font-metric text-sm text-slate-500 dark:text-slate-400">ZEN &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
