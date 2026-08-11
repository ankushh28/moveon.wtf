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
  title: 'moveon.wtf',
  description: 'archive of deleted files.',
};

export default async function Page() {
  const playlistData = await getPlaylistData();
  const displayTracks = playlistData && playlistData.tracks.length > 1 ? playlistData.tracks.slice(1) : playlistData?.tracks ?? [];

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
      <div className="fixed top-4 right-4 z-40 flex items-center justify-center">
        <Link
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors duration-300 flex h-8 w-8 items-center justify-center"
          aria-label="Open in YouTube Music"
        >
          <Youtube className="h-5 w-5" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Center Hero */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-6 pt-10 pb-28 md:px-0 md:pt-0 md:pb-0">
        <div className="text-center -translate-y-2 md:-translate-y-6 max-w-[90vw] md:max-w-none">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-[0.12em] text-white/90 font-serif uppercase leading-none">
            Forgotten
          </h1>
          <p className="mt-3 md:mt-4 text-[9px] sm:text-[10px] md:text-xs tracking-[0.22em] md:tracking-[0.28em] text-white/50 uppercase font-sans">
            archive of deleted files
          </p>
        </div>
      </div>

      {/* Floating Player */}
      {displayTracks.length > 0 && (
        <Player tracks={displayTracks} />
      )}

      {!playlistData && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 text-white/50 text-sm tracking-widest">
          loading your playlist...
        </div>
      )}
    </main>
  );
}
