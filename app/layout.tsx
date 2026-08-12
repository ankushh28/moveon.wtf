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
  metadataBase: new URL('https://chuttanahihai.com'),
  title: {
    default: 'ChuttaNahiHai — nostalgia on every route',
    template: '%s | ChuttaNahiHai',
  },
  description:
    'A nostalgic Indian roadways bus playlist filled with the songs that made every crowded ride, dusty route, and long highway feel unforgettable.',
  applicationName: 'ChuttaNahiHai',
  keywords: [
    'ChuttaNahiHai',
    'Indian bus playlist',
    'nostalgia songs',
    'bus journey music',
    'road trip classics',
    'old Hindi songs',
    'highway memories',
    'royal roadways vibe',
  ],
  authors: [{ name: 'ChuttaNahiHai' }],
  creator: 'ChuttaNahiHai',
  publisher: 'ChuttaNahiHai',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ChuttaNahiHai — nostalgia on every route',
    description:
      'The sound of old Indian roadways memories: classic bus rides, dusty highways, and songs that still feel like home.',
    url: 'https://chuttanahihai.com',
    siteName: 'ChuttaNahiHai',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/backimg.png',
        width: 1200,
        height: 630,
        alt: 'ChuttaNahiHai banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChuttaNahiHai',
    description:
      'Nostalgic Indian roadways bus songs for every memory on the route.',
    creator: '@chuttanahihai',
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
