"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loading02Icon,
} from "@hugeicons/core-free-icons";;
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/lib/auth';

import Footer from './Footer';

// Only load Stack's SignIn component when Stack provider is active
const SignIn = dynamic(
  () => import('@stackframe/stack').then(mod => ({ default: mod.SignIn })),
  { ssr: false, loading: () => <HugeiconsIcon icon={Loading02Icon} className="w-5 h-5 animate-spin text-gray-600" /> }
);

export default function SignInClient() {
  const { provider } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (provider === 'local') {
      router.replace('/auth/login');
    }
  }, [provider, router]);

  if (provider !== 'stack') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <HugeiconsIcon icon={Loading02Icon} className="w-5 h-5 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <>
      <SignIn />
      <Footer />
    </>
  );
}
