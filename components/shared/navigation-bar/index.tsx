'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/shared/provider/auth';
import Link from 'next/link';
import UserProfile from './components/user-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function NavigationBar() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out', error);
      toast.error('Error logging out', {
        description: 'Please try again later',
        duration: 5000,
        richColors: true,
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 flex w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex flex-1 h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="TaskFlow" width={32} height={32} />
          <span className="font-semibold text-lg">TaskFlow</span>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 hidden sm:block" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ) : !user ? (
          <div className="flex items-center gap-2">
            <Link href="/login">Login</Link>
          </div>
        ) : (
          <UserProfile
            userName={user.user_metadata.name}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
}
