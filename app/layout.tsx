import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Backlink Automation Agent',
  description: 'Generate backlink pages automatically',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 840, margin: '0 auto', padding: '24px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
