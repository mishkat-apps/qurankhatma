'use client';

import { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';

interface AuthCardProps {
  title?: string;
  description?: string;
  redirectPath?: string;
}

export function AuthCard({
  title = 'Sign in to publish and manage shared khatmas',
  description = 'Guests can draft locally. Organizers sign in only when they are ready to share or manage their community khatmas.',
  redirectPath = '/dashboard',
}: AuthCardProps) {
  const { signInWithGoogle, sendMagicLink } = useAuth();
  const { pushToast } = useToast();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<'google' | 'email' | null>(null);

  return (
    <Panel className="space-y-4">
      <div className="space-y-2">
        <p className="section-title text-xs">Organizer access</p>
        <h3 className="font-[var(--font-heading)] text-3xl leading-none">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>

      <div className="grid gap-3">
        <Button
          onClick={async () => {
            setBusy('google');
            try {
              await signInWithGoogle();
              pushToast({ tone: 'success', title: 'Google sign-in started.' });
            } catch (error) {
              pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not start Google sign-in.' });
            } finally {
              setBusy(null);
            }
          }}
          disabled={busy !== null}
          className="w-full"
        >
          <Sparkles className="h-4 w-4" />
          {busy === 'google' ? 'Opening Google...' : 'Continue with Google'}
        </Button>

        <div className="rounded-[24px] border border-[var(--line)] bg-white/65 p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Email magic link
          </label>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="focus-ring flex-1 rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
            />
            <Button
              tone="secondary"
              disabled={!email || busy !== null}
              onClick={async () => {
                setBusy('email');
                try {
                  await sendMagicLink(email, redirectPath);
                  pushToast({ tone: 'success', title: 'Check your inbox for the sign-in link.' });
                } catch (error) {
                  pushToast({ tone: 'error', title: error instanceof Error ? error.message : 'Could not send the magic link.' });
                } finally {
                  setBusy(null);
                }
              }}
            >
              <Mail className="h-4 w-4" />
              {busy === 'email' ? 'Sending...' : 'Send link'}
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
