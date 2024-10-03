import './globals.css';

import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const libre = localFont({
  src: './fonts/LibreBaskerville-Regular.ttf',
  variable: '--font-libre',
});

const lato = localFont({
  src: './fonts/Lato-Regular.ttf',
  variable: '--font-lato',
});

const sourceSans = localFont({
  src: './fonts/SourceSansPro-Regular.ttf',
  variable: '--font-source-sans',
});

export const metadata: Metadata = {
  title: 'Portfolio | Ahmad Mahmood',
  description: "Ahmad Mahmood's Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${libre.variable} ${lato.variable} ${sourceSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
