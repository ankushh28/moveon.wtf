export interface Track {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  position: number;
}

export interface PlaylistData {
  title: string;
  tracks: Track[];
}
