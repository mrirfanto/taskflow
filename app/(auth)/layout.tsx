import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Authentication - TaskFlow',
    template: '%s - TaskFlow',
  },
  description: 'Authentication pages for TaskFlow',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {children}
    </main>
  );
}
