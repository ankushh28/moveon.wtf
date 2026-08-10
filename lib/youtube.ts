import { Track, PlaylistData } from '@/types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID || 'PLts5vXm_Z8sVIrgQBMY7p4hTkUHdo_nxM';

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  
  return hours * 3600 + minutes * 60 + seconds;
}

export async function getPlaylistData(): Promise<PlaylistData | null> {
  if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY is missing');
    return null;
  }

  try {
    // 1. Fetch Playlist Info
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
    const playlistRes = await fetch(playlistUrl, { next: { revalidate: 3600 } });
    const playlistData = await playlistRes.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      console.error('Playlist not found');
      return null;
    }

    const title = playlistData.items[0].snippet.title;

    // 2. Fetch Playlist Items
    let tracks: Track[] = [];
    let nextPageToken = '';
    
    do {
      const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const itemsRes = await fetch(itemsUrl, { next: { revalidate: 3600 } });
      const itemsData = await itemsRes.json();

      if (!itemsData.items) break;

      const videoIds = itemsData.items.map((item: any) => item.contentDetails.videoId).join(',');

      // 3. Fetch Video Durations
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      const videosRes = await fetch(videosUrl, { next: { revalidate: 3600 } });
      const videosData = await videosRes.json();

      const durationMap: Record<string, number> = {};
      if (videosData.items) {
        videosData.items.forEach((video: any) => {
          durationMap[video.id] = parseISO8601Duration(video.contentDetails.duration);
        });
      }

      itemsData.items.forEach((item: any) => {
        const videoId = item.contentDetails.videoId;
        const snippet = item.snippet;
        
        // Filter out private/deleted videos (they usually don't have titles or thumbnails)
        if (snippet.title === 'Private video' || snippet.title === 'Deleted video') return;

        tracks.push({
          id: item.id,
          videoId: videoId,
          title: snippet.title,
          artist: snippet.videoOwnerChannelTitle || 'Unknown Artist',
          thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
          duration: durationMap[videoId] || 0,
          position: snippet.position,
        });
      });

      nextPageToken = itemsData.nextPageToken || '';
    } while (nextPageToken);

    return { title, tracks };
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    return null;
  }
}
