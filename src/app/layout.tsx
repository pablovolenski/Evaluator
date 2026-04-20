import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Evalify — Economic Project Evaluation Platform',
  description: 'Systematize your business ideas and evaluate them with NPV, IRR, Payback and ROI analysis.',
  openGraph: {
    title: 'Evalify — Economic Project Evaluation Platform',
    description: 'Systematize and evaluate your business ideas. Share results with stakeholders.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
