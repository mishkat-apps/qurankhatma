'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { initials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const { user, sessionState, signOutToGuest } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isOrganizer = sessionState === 'organizer';
  const displayName = user?.displayName || user?.email || 'User';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'glass-header w-full transition-all duration-300',
      scrolled ? 'scrolled' : 'py-2'
    )}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size={32} className="transition-transform group-hover:scale-110" />
          <span className="font-[var(--font-heading)] text-xl font-bold leading-none text-[var(--foreground)]">Quran Khatma</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted transition-colors hover:text-[var(--accent)]">Home</Link>
            {isOrganizer && (
              <Link href="/dashboard" className="text-muted transition-colors hover:text-[var(--accent)]">Dashboard</Link>
            )}
          </nav>

          <div className="h-4 w-px bg-[var(--line)]" />

          {isOrganizer ? (
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent-strong)] ring-2 ring-white ring-offset-1">
                {initials(displayName)}
              </span>
              <Button tone="ghost" className="h-9 px-3" onClick={() => void signOutToGuest()}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <Link href={'/auth/signin' as any}>
              <Button tone="primary" className="h-10 px-6 shadow-md">Sign In / Sign Up</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="relative z-50 rounded-full p-2 text-muted transition-colors hover:bg-white/60 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden" 
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed right-0 top-0 z-50 h-[100dvh] w-72 bg-[var(--surface)] p-6 shadow-2xl md:hidden animate-modal-in flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <Logo size={32} />
                <span className="font-[var(--font-heading)] text-xl font-bold">Quran Khatma</span>
              </div>
              
              <Link href="/how-it-works" className="link-hover text-sm font-semibold tracking-tight text-muted">
                How it works
              </Link>
              <Link href="/about" className="link-hover text-sm font-semibold tracking-tight text-muted">
                About Us
              </Link>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-muted transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
                {isOrganizer && (
                  <Link href="/dashboard" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-muted transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <div className="my-2 h-px bg-[var(--line)]" />
                {isOrganizer ? (
                  <button
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-muted transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
                    onClick={() => { void signOutToGuest(); setMobileOpen(false); }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                ) : (
                  <Link href={'/auth/signin' as any} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-muted transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]" onClick={() => setMobileOpen(false)}>
                    Sign In / Sign Up
                  </Link>
                )}
              </nav>

              <div className="mt-auto border-t border-[var(--line)] pt-6 text-center text-xs text-muted">
                A project for the ummah
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
