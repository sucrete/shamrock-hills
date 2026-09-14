import { ReactNode } from 'react';
import { revans } from '@/app/fonts';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={revans.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
