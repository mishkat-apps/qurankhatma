'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { signInWithGoogle, sendMagicLink, sessionState } = useAuth();
  const { pushToast } = useToast();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<'google' | 'email' | null>(null);

  // If already signed in, redirect to dashboard
  if (sessionState === 'organizer') {
    router.replace('/dashboard');
    return null;
  }

  const containerVariants = {
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
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--gold)]/5 blur-[120px] rounded-full" />
        
        <SiteHeader />
        
        <div className="mx-auto flex min-h-[85vh] max-w-lg flex-col items-center justify-center px-4 py-20 md:px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-[var(--foreground)] transition-colors group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to home
              </Link>
            </motion.div>

            <Panel className="glass-card border-none bg-gradient-to-br from-white/95 to-white/80 p-0 ring-1 ring-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] px-8 py-10 text-white text-center">
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                  <div className="rounded-full bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/20">
                    <Logo size={48} className="text-white drop-shadow-md" />
                  </div>
                </motion.div>
                <motion.h1 variants={itemVariants} className="font-[var(--font-heading)] text-4xl leading-tight">Welcome</motion.h1>
                <motion.p variants={itemVariants} className="mt-4 text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
                  Sign in / Sign up to publish your khatma, manage participants, and track your spiritual journey together.
                </motion.p>
              </div>

              <div className="grid gap-8 p-10">
                <motion.div variants={itemVariants}>
                  <Button
                    size="lg"
                    onClick={async () => {
                      setBusy('google');
                      try {
                        await signInWithGoogle();
                        pushToast({ tone: 'success', title: 'Signed in successfully.' });
                        router.push('/dashboard');
                      } catch (error) {
                        pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Authentication failed.' });
                      } finally {
                        setBusy(null);
                      }
                    }}
                    disabled={busy !== null}
                    className="w-full shadow-lg shadow-emerald-900/10 h-14 text-base"
                  >
                    <Sparkles className="h-5 w-5" />
                    {busy === 'google' ? 'Authenticating...' : 'Continue with Google'}
                  </Button>
                </motion.div>
    
                <motion.div variants={itemVariants} className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">or use magic link</span>
                  <div className="h-px flex-1 bg-black/5" />
                </motion.div>
    
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email address"
                      className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-white px-14 py-4 text-base outline-none transition-all placeholder:text-muted/40 focus:bg-white focus:shadow-sm"
                    />
                  </div>
                  <Button
                    size="lg"
                    tone="secondary"
                    className="w-full h-14 group text-base"
                    disabled={!email || busy !== null}
                    onClick={async () => {
                      setBusy('email');
                      try {
                        await sendMagicLink(email, '/dashboard');
                        pushToast({ tone: 'success', title: 'Check your inbox for the sign-in link.' });
                      } catch (error) {
                        pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not send the link.' });
                      } finally {
                        setBusy(null);
                      }
                    }}
                  >
                    {busy === 'email' ? 'Dispatching...' : 'Send Magic Link'}
                    <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
                
                <motion.p variants={itemVariants} className="text-center text-xs text-muted leading-relaxed max-w-xs mx-auto">
                  Local drafts doesn't require sign in / sign up. You only need an account to publish and share.
                </motion.p>
              </div>
            </Panel>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
