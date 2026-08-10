'use client';

import { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Track } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Disc3 } from 'lucide-react';
import Image from 'next/image';

interface PlayerProps {
  tracks: Track[];
}

export function Player({ tracks }: PlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  
  const playerRef = useRef<YouTubePlayer | null>(null);
  const progressInterval = useRef<number | null>(null);

  const currentTrack = tracks[currentIndex];
  const trackDuration = Math.max(currentTrack?.duration || 0, 1);
  const clampedProgress = Math.min(Math.max(progress, 0), trackDuration);
  const progressPercent = trackDuration > 0 ? (clampedProgress / trackDuration) * 100 : 0;

  useEffect(() => {
    if (!isPlaying) {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      return;
    }

    progressInterval.current = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      const currentTime = player.getCurrentTime();
      if (typeof currentTime === 'number' && Number.isFinite(currentTime)) {
        setProgress(currentTime);
      }
    }, 1000);

    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady) return;

    setProgress(0);
    player.loadVideoById({ videoId: currentTrack.videoId, startSeconds: 0 });
  }, [currentTrack.videoId, isReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isReady) return;

    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying, isReady]);

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    setIsReady(true);
    event.target.loadVideoById({ videoId: currentTrack.videoId, startSeconds: 0 });
  };

  const onStateChange = (event: YouTubeEvent) => {
    const state = event.data;
    if (state === YouTube.PlayerState.PLAYING) {
      setIsPlaying(true);
      setPlayerError(false);
    } else if (state === YouTube.PlayerState.PAUSED || state === YouTube.PlayerState.ENDED) {
      setIsPlaying(false);
    }
    
    if (state === YouTube.PlayerState.ENDED) {
      handleNext();
    }
  };

  const onError = (event: YouTubeEvent) => {
    console.error('YouTube Player Error:', event.data);
    setPlayerError(true);
    // Gracefully skip to next playable track on error (e.g. embedding disabled)
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const togglePlayPause = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleNext = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      setCurrentIndex(0); // loop back
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (progress > 3) {
      playerRef.current?.seekTo(0);
      setProgress(0);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      <div className="hidden">
        <YouTube
          videoId={currentTrack.videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 w-[90%] max-w-md sm:max-w-xl z-50 shadow-2xl"
      >
        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/5 bg-black/20 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {currentTrack.thumbnailUrl ? (
                <Image
                  src={currentTrack.thumbnailUrl}
                  alt={currentTrack.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : (
                <Disc3 className="w-8 h-8 text-white/30 animate-spin-slow" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="mb-3 text-center sm:text-left"
            >
              <h3 className="text-white font-medium truncate text-sm sm:text-base">
                {playerError ? 'Track Unavailable' : currentTrack.title}
              </h3>
              <p className="text-white/50 text-xs truncate mt-0.5">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 w-full">
            <span className="text-[10px] font-mono text-white/40 w-8 text-right">
              {formatTime(progress)}
            </span>
            <div className="relative flex-1 h-2.5">
              <div className="absolute inset-0 rounded-full bg-white/10" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/80 via-white/90 to-white"
                style={{ width: `${progressPercent}%` }}
              />
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]"
                style={{ left: `calc(${progressPercent}% - 7px)` }}
              />
              <input
                type="range"
                min={0}
                max={trackDuration}
                value={clampedProgress}
                onChange={handleSeek}
                className="absolute inset-0 h-full w-full appearance-none cursor-pointer bg-transparent focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:w-0 [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:w-0 [&::-webkit-slider-runnable-track]:h-0 [&::-moz-range-track]:h-0"
                aria-label="Seek song progress"
              />
            </div>
            <span className="text-[10px] font-mono text-white/40 w-8">
              {formatTime(currentTrack.duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={handlePrev}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlayPause}
            disabled={!isReady || playerError}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </motion.div>
    </>
  );
}
