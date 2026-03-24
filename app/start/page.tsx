'use client';

import { useRouter } from 'next/navigation';
import { HeartHandshake } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { motion } from 'framer-motion';
import { KhatmaForm } from '@/components/khatma/khatma-form';

export default function StartPage() {
  const router = useRouter();
  const { user, sessionState } = useAuth();
  const { pushToast } = useToast();
  return (
    <>
      <main className="page-shell pb-0">
        <SiteHeader />
        
        <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pt-12 md:px-6 md:pt-20">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12 text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6 mx-auto">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <h1 className="hero-title text-5xl mb-4">Start a Khatma</h1>
            <p className="text-lg text-muted">Organize a collective recitation for a loved one.</p>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Panel className="glass-card border-none p-8 md:p-10 shadow-2xl ring-1 ring-[var(--line)]">
              <KhatmaForm />
            </Panel>
          </motion.div>
        </div>
        
        <SiteFooter />
      </main>
    </>
  );
}
