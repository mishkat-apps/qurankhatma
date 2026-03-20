'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';
import { clearEmailLinkSeed, getEmailLinkSeed, useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { Logo } from '@/components/ui/logo';

export default function FinishEmailLinkPage() {
  const router = useRouter();
  const { finishEmailLinkSignIn, user, ready } = useAuth() as any;
  const { pushToast } = useToast() as any;
  const [busy, setBusy] = useState(true);
  const [needsManualEmail, setNeedsManualEmail] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleSignIn = async () => {
      if (!ready) return;
      
      const url = window.location.href;
      const seed = getEmailLinkSeed() as any;

      if (!seed || !seed.email) {
        setNeedsManualEmail(true);
        setBusy(false);
        return;
      }

      try {
        await (finishEmailLinkSignIn as any)(String(seed.email), String(url));
        clearEmailLinkSeed();
        pushToast({ tone: 'success', title: 'Authentication successful.' });
        router.push(seed.redirect || '/dashboard');
      } catch (error) {
        setNeedsManualEmail(true);
        pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Sign in failed.' });
      } finally {
        setBusy(false);
      }
    };

    if (ready) {
      if (user && !user.isAnonymous) {
        router.push('/dashboard');
      } else {
        void handleSignIn();
      }
    }
  }, [ready, user, finishEmailLinkSignIn, router, pushToast]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      } 
    }
  };

  return (
    <>
      <main className="page-shell pb-0 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--gold)]/5 blur-[120px] rounded-full" />

        <SiteHeader />
        
        <div className="mx-auto flex min-h-[85vh] max-w-2xl flex-col items-center justify-center px-4 py-20 md:px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col items-center"
          >
            <Panel className="glass-card border-none bg-gradient-to-br from-white/95 to-white/80 p-0 ring-1 ring-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden w-full max-w-lg">
              <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] px-8 py-12 text-white text-center">
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/20">
                    <Logo size={48} className="text-white drop-shadow-md" />
                  </div>
                </motion.div>
                <motion.p variants={itemVariants} className="section-title text-white/60 mb-2">Secure Authentication</motion.p>
                <motion.h1 variants={itemVariants} className="font-[var(--font-heading)] text-5xl leading-tight">Syncing your soul...</motion.h1>
                <motion.p variants={itemVariants} className="mt-4 text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
                  {busy ? 'Please hold on while we verify your secure magic link. This will only take a moment.' : 'Verification update required.'}
                </motion.p>
              </div>

              <div className="p-10">
                {needsManualEmail ? (
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted/30" />
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="Verify your email address"
                          className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-white px-14 py-4 text-base outline-none transition-all placeholder:text-muted/40 focus:bg-white focus:shadow-sm"
                        />
                      </div>
                      <Button
                        size="lg"
                        className="w-full h-14 text-base shadow-lg shadow-emerald-900/10"
                        onClick={async () => {
                          try {
                            await finishEmailLinkSignIn(email, window.location.href);
                            clearEmailLinkSeed();
                            window.location.assign('/dashboard');
                          } catch (error) {
                            pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Retry failed.' });
                          }
                        }}
                      >
                        Confirm and Complete Sign In
                      </Button>
                    </div>
                    <p className="text-center text-xs text-muted">
                      Opened link in a new browser? Enter your email again to confirm.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-10">
                    {busy ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative h-16 w-16">
                          <div className="absolute inset-0 rounded-full border-4 border-[var(--accent)]/20" />
                          <div className="absolute inset-0 rounded-full border-4 border-t-[var(--accent)] animate-spin" />
                        </div>
                        <span className="text-sm font-medium text-muted animate-pulse">Establishing secure connection...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-xl">Success</h3>
                        <p className="text-sm text-muted">Redirecting you to your dashboard...</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </Panel>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
