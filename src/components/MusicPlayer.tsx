import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music as MusicIcon, List, X } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  url: string;
}

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MusicPlayer({ isOpen, onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [progress, setProgress] = useState(0);

  const playlist: Track[] = [
    { id: '1', title: 'Focus Flow', artist: 'Ambient Sounds', album: 'Work Vibes', duration: '3:45', url: '' },
    { id: '2', title: 'Productivity Boost', artist: 'Lo-Fi Beats', album: 'Get Things Done', duration: '4:12', url: '' },
    { id: '3', title: 'Morning Energy', artist: 'Upbeat Mix', album: 'Start Your Day', duration: '3:30', url: '' },
    { id: '4', title: 'Calm Concentration', artist: 'Study Music', album: 'Deep Work', duration: '5:20', url: '' },
    { id: '5', title: 'Creative Spark', artist: 'Instrumental', album: 'Innovation', duration: '4:05', url: '' },
    { id: '6', title: 'Chill Vibes', artist: 'Smooth Jazz', album: 'Relaxation', duration: '3:55', url: '' },
  ];

  const track = playlist[currentTrack];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-pink-900 border-t-2 border-purple-500/50 shadow-2xl z-30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Track Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MusicIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">{track.title}</h3>
              <p className="text-purple-200 text-sm truncate">{track.artist} • {track.album}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-lg transition-colors ${shuffle ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-white/10'}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-purple-900" />
                ) : (
                  <Play className="w-6 h-6 text-purple-900 ml-1" />
                )}
              </button>
              
              <button
                onClick={() => setCurrentTrack(Math.min(playlist.length - 1, currentTrack + 1))}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setRepeat(!repeat)}
                className={`p-2 rounded-lg transition-colors ${repeat ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-white/10'}`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-96 flex items-center gap-3">
              <span className="text-xs text-purple-200">1:23</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-purple-200">{track.duration}</span>
            </div>
          </div>

          {/* Volume & Playlist */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-200" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-purple-200 w-8">{volume}%</span>
            </div>

            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-2 text-purple-200 hover:bg-white/10 rounded-lg transition-colors"
            >
              <List className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-purple-200 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Dropdown */}
      {showPlaylist && (
        <div className="absolute bottom-full right-0 mb-2 mr-6 w-96 bg-slate-900 border-2 border-purple-500/50 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <List className="w-5 h-5 text-purple-400" />
              Playlist ({playlist.length} tracks)
            </h3>
            <div className="space-y-2">
              {playlist.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setCurrentTrack(idx);
                    setShowPlaylist(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    idx === currentTrack
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs opacity-75">{t.artist} • {t.duration}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
