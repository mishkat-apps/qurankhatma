'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { Logo } from '@/components/ui/logo';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  redirectPath?: string;
  title?: string;
  description?: string;
}

export function AuthModal({
  open,
  onClose,
  redirectPath = '/dashboard',
  title = 'Elevate your journey',
  description = 'Sign in / Sign up to publish your khatma, track progress across devices, and share the reward with your community.',
}: AuthModalProps) {
  const { signInWithGoogle, sendMagicLink } = useAuth();
  const { pushToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<'google' | 'email' | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md" 
          />
    
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md"
          >
            <Panel className="glass-card border-none bg-gradient-to-br from-white/95 to-white/80 p-0 ring-1 ring-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 z-20 rounded-full bg-white/50 p-2 text-muted backdrop-blur-sm transition-all hover:bg-white hover:text-[var(--foreground)] hover:rotate-90"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] px-8 py-10 text-white">
                <div className="flex items-center gap-3">
                  <Logo size={36} className="text-white drop-shadow-sm" />
                  <span className="font-[var(--font-heading)] text-xl tracking-tight">Quran Khatma</span>
                </div>
                <div className="mt-8 space-y-2">
                  <h3 className="font-[var(--font-heading)] text-4xl leading-tight">{title}</h3>
                  <p className="text-sm text-white/70 text-balance leading-relaxed">{description}</p>
                </div>
              </div>

              <div className="grid gap-6 p-8">
                <Button
                  size="lg"
                  onClick={async () => {
                    setBusy('google');
                    try {
                      await signInWithGoogle();
                      pushToast({ tone: 'success', title: 'Signed in with Google.' });
                      onClose();
                      router.push(redirectPath);
                    } catch (error) {
                      pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not sign in.' });
                    } finally {
                      setBusy(null);
                    }
                  }}
                  disabled={busy !== null}
                  className="w-full shadow-lg shadow-emerald-900/10"
                >
                  <Sparkles className="h-4 w-4" />
                  {busy === 'google' ? 'Authenticating...' : 'Continue with Google'}
                </Button>
    
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">or use magic link</span>
                  <div className="h-px flex-1 bg-black/5" />
                </div>
    
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-white px-11 py-4 text-sm outline-none transition-all placeholder:text-muted/40 focus:bg-white focus:shadow-sm"
                    />
                  </div>
                  <Button
                    size="lg"
                    tone="secondary"
                    className="w-full group"
                    disabled={!email || busy !== null}
                    onClick={async () => {
                      setBusy('email');
                      try {
                        await sendMagicLink(email, redirectPath);
                        pushToast({ tone: 'success', title: 'Check your inbox for the sign-in link.' });
                      } catch (error) {
                        pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not send the link.' });
                      } finally {
                        setBusy(null);
                      }
                    }}
                  >
                    {busy === 'email' ? 'Dispatching...' : 'Send Magic Link'}
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                
                <p className="text-center text-[10px] text-muted leading-relaxed px-4">
                  By signing in, you agree to our respectful community guidelines and privacy focus.
                </p>
              </div>
            </Panel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
