import type { Metadata } from 'next';
import AppTheme from '@/components/AppTheme';

export const metadata: Metadata = {
  title: 'Notification Dashboard',
  description: 'Campus Notifications - Affordmed Hiring',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppTheme>{children}</AppTheme>
      </body>
    </html>
  );
}
