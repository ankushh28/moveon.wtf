import { getPlaylistData } from '@/lib/youtube';
import { Player } from '@/components/Player';
import { LocalTime } from '@/components/LocalTime';
import { Presence } from '@/components/Presence';
import { Background } from '@/components/Background';
import { Youtube } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 3600; // Cache for 1 hour

export const metadata: Metadata = {
  title: 'MoveOn — heartbreak, healing & the songs that hit different',
  description:
    'Late-night love, breakup energy, and the songs that feel too real. MoveOn is for the feelings you don’t post about but still replay on loop.',
};

export default async function Page() {
  const playlistData = await getPlaylistData();

  const playlistId = process.env.YOUTUBE_PLAYLIST_ID || 'PLts5vXm_Z8sVIrgQBMY7p4hTkUHdo_nxM';
  const youtubeUrl = `https://music.youtube.com/playlist?list=${playlistId}`;

  return (
    <main className="relative w-full h-[100svh] overflow-hidden bg-black text-white font-sans selection:bg-white/20">
      <Background />

      {/* Top Left: Time */}
      <LocalTime />

      {/* Top Center: Presence */}
      <Presence />

      {/* Top Right: YouTube Music */}
      <div className="fixed top-8 right-8 z-40">
        <Link
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors duration-300 flex items-center justify-center p-2"
          aria-label="Open in YouTube Music"
        >
          <Youtube className="w-6 h-6" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Center Hero */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
        <div className="text-center -translate-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-[0.12em] text-white/90 font-serif uppercase leading-none">
            MoveOn
          </h1>
          <p className="mt-4 text-[10px] md:text-xs tracking-[0.28em] text-white/50 uppercase font-sans">
            for the songs that hit too deep
          </p>
        </div>
      </div>

      {/* Floating Player */}
      {playlistData && playlistData.tracks.length > 0 && (
        <Player tracks={playlistData.tracks} />
      )}

      {!playlistData && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 text-white/50 text-sm tracking-widest">
          loading your playlist...
        </div>
      )}
    </main>
  );
}
