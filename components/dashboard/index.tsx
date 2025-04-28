'use client';

import { useAuth } from '@/components/shared/provider/auth';

export function DashboardWelcome() {
  const { user } = useAuth();
  const username = user?.user_metadata.name;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back!, {username}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your tasks and progress.
          </p>
        </div>
      </div>
    </div>
  );
}
