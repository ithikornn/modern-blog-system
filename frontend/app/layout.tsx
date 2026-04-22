import type { Metadata } from 'next';
import './globals.css';
import ConditionalNavbar from '@/components/ui/ConditionalNavbar';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'บทความและความรู้ต่างๆ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-slate-50 text-slate-800 antialiased">
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}