'use client';

import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailLink,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getFirebaseAuthClient, hasFirebaseConfig } from '@/lib/firebase/client';
import { isPermanentUser } from '@/lib/utils';

type SessionState = 'guest-local' | 'guest-anonymous' | 'organizer';

interface AuthContextValue {
  user: User | null;
  sessionState: SessionState;
  ready: boolean;
  hasFirebase: boolean;
  signInWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string, redirectPath?: string) => Promise<void>;
  finishEmailLinkSignIn: (email: string, href: string) => Promise<void>;
  signOutToGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  sessionState: 'guest-local',
  ready: false,
  hasFirebase: false,
  signInWithGoogle: async () => undefined,
  sendMagicLink: async () => undefined,
  finishEmailLinkSignIn: async () => undefined,
  signOutToGuest: async () => undefined,
});

const EMAIL_KEY = 'quran-khatma.email-link';
const REDIRECT_KEY = 'quran-khatma.email-link-redirect';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuthClient();
    if (!auth) {
      setReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        try {
          await signInAnonymously(auth);
          return;
        } catch {
          setUser(null);
          setReady(true);
          return;
        }
      }

      setUser(nextUser);
      setReady(true);
    });

    return unsubscribe;
  }, []);

  const sessionState: SessionState = useMemo(() => {
    if (!hasFirebaseConfig) return 'guest-local';
    if (!user) return 'guest-local';
    return isPermanentUser(user) ? 'organizer' : 'guest-anonymous';
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    sessionState,
    ready,
    hasFirebase: hasFirebaseConfig,
    signInWithGoogle: async () => {
      const auth = getFirebaseAuthClient();
      if (!auth) throw new Error('Firebase is not configured.');
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch {
        await signInWithRedirect(auth, provider);
      }
    },
    sendMagicLink: async (email: string, redirectPath = '/dashboard') => {
      const auth = getFirebaseAuthClient();
      if (!auth) throw new Error('Firebase is not configured.');
      window.localStorage.setItem(EMAIL_KEY, email);
      window.localStorage.setItem(REDIRECT_KEY, redirectPath);
      await sendSignInLinkToEmail(auth, email, {
        url: `${window.location.origin}/auth/finish`,
        handleCodeInApp: true,
      });
    },
    finishEmailLinkSignIn: async (email: string, href: string) => {
      const auth = getFirebaseAuthClient();
      if (!auth) throw new Error('Firebase is not configured.');
      if (!isSignInWithEmailLink(auth, href)) {
        throw new Error('This sign-in link is not valid anymore.');
      }
      await signInWithEmailLink(auth, email, href);
    },
    signOutToGuest: async () => {
      const auth = getFirebaseAuthClient();
      if (!auth) return;
      await signOut(auth);
      await signInAnonymously(auth);
      router.push('/');
    },
  }), [ready, sessionState, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getEmailLinkSeed() {
  if (typeof window === 'undefined') return { email: '', redirect: '/dashboard' };
  return {
    email: window.localStorage.getItem(EMAIL_KEY) ?? '',
    redirect: window.localStorage.getItem(REDIRECT_KEY) ?? '/dashboard',
  };
}

export function clearEmailLinkSeed() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(EMAIL_KEY);
  window.localStorage.removeItem(REDIRECT_KEY);
}
