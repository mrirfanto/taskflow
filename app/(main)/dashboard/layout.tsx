import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TaskFlow Dashboard',
  description: 'Manage your tasks efficiently with TaskFlow',
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
