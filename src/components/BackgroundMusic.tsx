import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BackgroundMusicProps {
  autoPlay?: boolean;
  showControls?: boolean;
}

export function BackgroundMusic({ autoPlay = true, showControls = true }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Start at 30% volume
  const [isMuted, setIsMuted] = useState(false);

  // Epic music tracks - you can replace these URLs with your own
  const musicTracks = [
    'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', // Epic Cinematic
    'https://cdn.pixabay.com/audio/2022/03/10/audio_c9009d6c84.mp3', // Powerful Trailer
    'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3', // Epic Motivation
  ];

  const [currentTrack] = useState(musicTracks[0]);

  useEffect(() => {
    if (audioRef.current && autoPlay) {
      // Attempt to play on mount
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            // Auto-play was prevented, user needs to interact first
            console.log('Autoplay prevented:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Play error:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  if (!showControls) {
    return (
      <audio
        ref={audioRef}
        src={currentTrack}
        loop
        preload="auto"
      />
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack}
        loop
        preload="auto"
      />
      
      {/* Floating Music Control */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 shadow-2xl">
        <Music className="w-4 h-4 text-purple-400 animate-pulse" />
        <span className="text-white text-xs font-semibold">Epic Music</span>
        
        <button
          onClick={togglePlay}
          className="p-1.5 hover:bg-white/10 rounded-full transition-all"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
          )}
        </button>
        
        <button
          onClick={toggleMute}
          className="p-1.5 hover:bg-white/10 rounded-full transition-all"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </>
  );
}
