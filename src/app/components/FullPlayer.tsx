import { Play, Pause, SkipBack, SkipForward, Repeat, ChevronDown } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { surahs } from '../data/surahs';
import { apiService } from '../services/api';
import reciterImage from '../../imports/hassan-adly.jpg';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const FullPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    playbackRate,
    isLooping,
    togglePlay,
    seekTo,
    setPlaybackRate,
    toggleLoop,
    toggleFullPlayer,
    playTrack,
  } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleNext = async () => {
    const nextSurah = surahs.find(s => s.id === currentTrack.surahId + 1);
    if (nextSurah) {
      const track = await apiService.getAudioTrack(nextSurah.id, currentTrack.qiraaId);
      playTrack(track);
    }
  };

  const handlePrevious = async () => {
    const prevSurah = surahs.find(s => s.id === currentTrack.surahId - 1);
    if (prevSurah) {
      const track = await apiService.getAudioTrack(prevSurah.id, currentTrack.qiraaId);
      playTrack(track);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    seekTo(percent * duration);
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <div className="lg:hidden fixed inset-0 bg-background z-50 flex flex-col">
      <div className="p-4 border-b border-border">
        <button onClick={toggleFullPlayer} className="text-foreground">
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
          <img
            src={reciterImage}
            alt="حسن عدلي"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center">
            <span className="text-white text-2xl font-bold">{currentTrack.surahId}</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{currentTrack.surahName}</h2>
          <p className="text-muted-foreground">{currentTrack.qiraaName}</p>
          <p className="text-sm text-muted-foreground">حسن عدلي</p>
        </div>

        <div className="w-full max-w-md space-y-2">
          <div
            onClick={handleSeek}
            className="h-1 bg-secondary rounded-full cursor-pointer"
          >
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={handlePrevious}
            className="text-foreground hover:text-primary transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 mr-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-foreground hover:text-primary transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleLoop}
            className={`transition-colors ${isLooping ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Repeat className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {playbackRates.map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  playbackRate === rate
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
