'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DraftStore } from '@/lib/data/draft-store';
import type { CloudKhatma, LocalKhatmaDraft } from '@/lib/types';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { Panel } from '@/components/ui/panel';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { useAuth } from '@/components/providers/auth-provider';
import { getFirebaseDb } from '@/lib/firebase/client';
import { subscribeToOrganizerKhatmas } from '@/lib/repositories/cloud-khatmas';

export default function DashboardPage() {
  const router = useRouter();
  const { user, sessionState, ready } = useAuth();
  const [store, setStore] = useState<DraftStore | null>(null);
  const [localDrafts, setLocalDrafts] = useState<LocalKhatmaDraft[]>([]);
  const [cloudKhatmas, setCloudKhatmas] = useState<CloudKhatma[]>([]);

  useEffect(() => {
    const nextStore = new DraftStore(window.localStorage);
    setStore(nextStore);
    setLocalDrafts(nextStore.listDrafts());
  }, []);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db || !user || sessionState !== 'organizer') {
      setCloudKhatmas([]);
      return;
    }

    return subscribeToOrganizerKhatmas(db, user.uid, setCloudKhatmas);
  }, [sessionState, user]);

  const isOrganizer = sessionState === 'organizer';
  const displayName = user?.displayName || user?.email || 'Guest';

  // Redirect unauthenticated users after auth is ready
  useEffect(() => {
    if (ready && !isOrganizer) {
      // Allow guest access but show limited view
    }
  }, [ready, isOrganizer]);

  return (
    <>
      <main className="page-shell pb-0">
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-8 md:px-6 md:pt-12">
          {/* Greeting */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="section-spacing"
          >
            <Panel className="glass-card relative overflow-hidden border-none bg-[linear-gradient(160deg,rgba(255,250,243,0.9),rgba(242,231,216,0.8))] shadow-xl ring-1 ring-[var(--line)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p className="section-title text-xs font-bold tracking-[0.2em] mb-3 uppercase">User Workspace</p>
                  <h1 className="hero-title text-balance text-5xl md:text-6xl">
                    {isOrganizer ? `Welcome, ${displayName.split(' ')[0]}` : 'Your workspace'}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg text-muted text-balance">
                    {isOrganizer
                      ? 'Manage your active khatmas, revisit history, and keep local drafts close.'
                      : 'Your local drafts are shown below. Sign in to publish and manage shared khatmas.'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                   <button 
                     onClick={() => router.push('/start')}
                     className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-emerald-900/20 active:scale-[0.98]"
                   >
                     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] transition-all duration-1000 group-hover:bg-[position:100%_100%]" />
                     <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 group-hover:rotate-12 transition-transform">
                       <span className="text-2xl font-light">+</span>
                     </div>
                     <span className="relative">Create New Khatma</span>
                   </button>
                </div>
              </div>
            </Panel>
          </motion.section>

          <DashboardView localDrafts={localDrafts} cloudKhatmas={cloudKhatmas} isOrganizer={isOrganizer} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
