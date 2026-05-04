import { Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router';
import { usePlayer } from '../context/PlayerContext';
import reciterImage from '../../imports/hassan-adly.jpg';

export const MiniPlayer = () => {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, progress, duration, togglePlay, toggleFullPlayer } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      onClick={() => navigate('/player')}
      className="lg:hidden fixed bottom-16 left-0 right-0 bg-card border-t border-border cursor-pointer z-20"
    >
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex items-center justify-between p-3 px-4 gap-3">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-primary/20 flex-shrink-0">
          <img
            src={reciterImage}
            alt="حسن عدلي"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{currentTrack.surahName}</h4>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.qiraaName}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/player');
          }}
          className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 mr-0.5" fill="currentColor" />
          )}
        </button>
      </div>
    </div>
  );
};
