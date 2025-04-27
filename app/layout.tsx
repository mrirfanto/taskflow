import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/shared/provider/auth';
import { Toaster } from '@/components/ui/sonner';
import { NavigationBar } from '@/components/shared/navigation-bar';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TaskFlow - Task Management Dashboard',
  description: 'Manage your tasks efficiently with TaskFlow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NavigationBar />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
