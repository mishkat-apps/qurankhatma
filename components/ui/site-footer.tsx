import { Logo } from './logo';
import Link from 'next/link';
import { Heart, Mail, MessageSquare, Twitter, Instagram, Facebook } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[var(--surface)] py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 space-y-5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Logo size={28} />
              <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">Quran Khatma</span>
            </div>
            <p className="max-w-sm mx-auto md:mx-0 text-sm leading-relaxed text-muted">
              A respectful platform for shared remembrance and community-driven Quran completions. 
              Designed with care to bring people together in prayer and dedication.
            </p>
          </div>
          
          <div className="space-y-3 text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">Platform</h4>
            <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/start" className="link-hover text-xs text-muted">Start a Khatma</Link></li>
            <li><Link href="/how-it-works" className="link-hover text-xs text-muted">How it works</Link></li>
            <li><Link href="/about" className="link-hover text-xs text-muted">About Us</Link></li>
            <li><Link href="/contact" className="link-hover text-xs text-muted">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">Support</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/privacy" className="link-hover text-xs text-muted">Privacy Policy</Link></li>
            <li><Link href="/terms" className="link-hover text-xs text-muted">Terms of Service</Link></li>
            <li><Link href="/contact" className="link-hover text-xs text-muted">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-[var(--line)] pt-6 text-center md:flex-row md:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Quran Khatma. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 fill-[var(--accent)] text-[var(--accent)]" /> for the Ummah
          </div>
        </div>
      </div>
    </footer>
  );
}
