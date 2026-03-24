'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'danger' | 'primary';
  busy?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  tone = 'danger',
  busy = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative z-10 w-full max-w-sm"
          >
            <Panel className="glass-card border-none bg-white p-0 shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-[var(--font-heading)] text-xl font-bold text-[var(--foreground)]">{title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 bg-[var(--surface)] px-6 py-4 border-t border-[var(--line)]">
                <Button 
                  tone="ghost" 
                  onClick={onClose}
                  disabled={busy}
                  className="h-10"
                >
                  {cancelText}
                </Button>
                <Button 
                  tone={tone === 'danger' ? 'primary' : 'primary'} 
                  onClick={onConfirm}
                  disabled={busy}
                  className={`h-10 px-6 ${tone === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                >
                  {busy ? 'Processing...' : confirmText}
                </Button>
              </div>
            </Panel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
