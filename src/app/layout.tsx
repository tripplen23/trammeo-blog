import type { Metadata } from 'next';
import { Lora, Open_Sans } from 'next/font/google';
import './globals.css';

const geistSans = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Personal Blog - Creative Journey',
  description: 'The Trammeo - Personal branding blog',
  keywords: ['blog', 'writing', 'barista', 'coffee', 'creative'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}