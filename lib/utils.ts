import { clsx } from 'clsx';
import type { User } from 'firebase/auth';

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatDate(date: string | null) {
  if (!date) return 'No target date';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function toInputDate(date: string | null) {
  if (!date) return '';
  return date.slice(0, 10);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function createPublicId(name: string) {
  return `${slugify(name) || 'khatma'}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isPermanentUser(user: User | null) {
  if (!user) return false;
  return user.providerData.some((provider) => provider.providerId !== 'firebase');
}

export function initials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
