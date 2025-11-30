import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Personal Blog - Creative Journey',
  description: 'The Trammeo - Personal branding blog',
  keywords: ['blog', 'writing', 'barista', 'coffee', 'creative'],
  icons: {
    icon: '/images/tram-logo.webp',
    shortcut: '/images/tram-logo.webp',
    apple: '/images/tram-logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}