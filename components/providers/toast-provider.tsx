'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type ToastTone = 'success' | 'error';

interface ToastItem {
  id: string;
  title: string;
  tone: ToastTone;
}

interface ToastContextValue {
  pushToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({
  pushToast: () => undefined,
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const pushToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const item = { ...toast, id: crypto.randomUUID() };
    setItems((current) => [...current, item]);
    window.setTimeout(() => {
      setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card pointer-events-auto animate-toast-in rounded-3xl px-4 py-3">
            <div className="flex items-center gap-3 text-sm">
              {item.tone === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" />
              ) : (
                <AlertCircle className="h-5 w-5 text-[var(--danger)]" />
              )}
              <span>{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
