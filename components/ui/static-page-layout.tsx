'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SiteHeader } from '../ui/site-header';
import { SiteFooter } from '../ui/site-footer';
import { Panel } from '../ui/panel';

interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function StaticPageLayout({ title, subtitle, children }: StaticPageLayoutProps) {
  return (
    <>
      <main className="page-shell pb-0">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 pt-12 md:px-6 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="hero-title text-balance text-5xl md:text-7xl mb-4">{title}</h1>
            {subtitle && (
              <p className="max-w-2xl text-xl text-muted text-balance mb-12">
                {subtitle}
              </p>
            )}
            
            <Panel className="glass-card prose prose-stone max-w-none p-8 md:p-12 mb-20 leading-relaxed shadow-sm">
              {children}
            </Panel>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
