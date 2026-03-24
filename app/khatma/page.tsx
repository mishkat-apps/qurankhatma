'use client';

import { useSearchParams } from 'next/navigation';
import { CloudKhatmaPage } from '@/components/khatma/cloud-khatma-page';
import { SiteHeader } from '@/components/ui/site-header';
import { SiteFooter } from '@/components/ui/site-footer';
import { Panel } from '@/components/ui/panel';
import { Suspense } from 'react';

function KhatmaContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-20 md:px-6">
        <Panel>
          <h1 className="font-[var(--font-heading)] text-5xl">No Khatma ID provided</h1>
          <p className="mt-3 text-muted">Please check the link and try again.</p>
        </Panel>
      </div>
    );
  }

  return <CloudKhatmaPage id={id} />;
}

export default function KhatmaPage() {
  return (
    <>
      <Suspense fallback={
        <main className="page-shell pb-0">
          <SiteHeader />
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <Panel className="space-y-3">
              <div className="skeleton h-8 w-2/3" />
              <div className="skeleton h-5 w-full" />
            </Panel>
          </div>
          <SiteFooter />
        </main>
      }>
        <KhatmaContent />
      </Suspense>
    </>
  );
}
