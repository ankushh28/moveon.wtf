import type {Metadata} from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono, Cinzel } from 'next/font/google';
import './globals.css'; // Global styles

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jakarta',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://moveon.wtf'),
  title: {
    default: 'MoveOn — heartbreak, healing & the songs that hit different',
    template: '%s | MoveOn',
  },
  description:
    'Late-night love, breakup energy, and the songs that feel too real. MoveOn is for the feelings you don’t post about but still replay on loop.',
  applicationName: 'MoveOn',
  keywords: [
    'MoveOn',
    'breakup songs',
    'love songs',
    'heartbreak music',
    'late night playlist',
    'songs that hit different',
    'healing music',
  ],
  authors: [{ name: 'MoveOn' }],
  creator: 'MoveOn',
  publisher: 'MoveOn',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MoveOn — heartbreak, healing & the songs that hit different',
    description:
      'For the late-night feelings, the breakup spiral, the love that lingers, and the songs that keep replaying.',
    url: 'https://moveon.wtf',
    siteName: 'MoveOn',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/backimg.png',
        width: 1200,
        height: 630,
        alt: 'notreachable.wtf banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'notreachable.wtf',
    description:
      'Late-night love, breakup energy, and the songs that feel too real to ignore.',
    creator: '@moveonwtf',
    images: ['/backimg.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="font-sans bg-black antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
