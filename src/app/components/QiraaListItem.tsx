import { Play } from 'lucide-react';
import { Qiraa } from '../data/qiraat';

interface QiraaListItemProps {
  qiraa: Qiraa;
  surahId: number;
  duration: number;
  onPlay: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const QiraaListItem = ({ qiraa, duration, onPlay }: QiraaListItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-secondary rounded-lg transition-colors group border border-transparent hover:border-border gap-3">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onPlay}
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-105 flex-shrink-0"
        >
          <Play className="w-5 h-5 lg:w-6 lg:h-6 mr-0.5" fill="currentColor" />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium lg:text-lg truncate">{qiraa.nameArabic}</h4>
          <p className="text-sm text-muted-foreground truncate">{qiraa.rawi}</p>
        </div>
      </div>
      <span className="text-sm lg:text-base text-muted-foreground flex-shrink-0">{formatDuration(duration)}</span>
    </div>
  );
};
