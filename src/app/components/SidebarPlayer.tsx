import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Heart,
  Maximize2,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { surahs } from "../data/surahs";
import { apiService } from "../services/api";
import reciterImage from "../../imports/hassan-adly.jpg";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const SidebarPlayer = () => {
  const navigate = useNavigate();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const scrubTargetRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
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
    playTrack,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
  } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleNext = async () => {
    const nextSurah = surahs.find((s) => s.id === currentTrack.surahId + 1);
    if (nextSurah) {
      const track = await apiService.getAudioTrack(
        nextSurah.id,
        currentTrack.qiraaId,
      );
      playTrack(track);
    }
  };

  const handlePrevious = async () => {
    const prevSurah = surahs.find((s) => s.id === currentTrack.surahId - 1);
    if (prevSurah) {
      const track = await apiService.getAudioTrack(
        prevSurah.id,
        currentTrack.qiraaId,
      );
      playTrack(track);
    }
  };

  const getPercentFromClientX = (clientX: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const isRtl = window.getComputedStyle(element).direction === "rtl";
    const rawPercent = isRtl ? 1 - x / rect.width : x / rect.width;
    return Math.min(1, Math.max(0, rawPercent));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const percent = getPercentFromClientX(e.clientX, e.currentTarget);
    seekTo(percent * duration);
  };

  const handleScrubStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    scrubTargetRef.current = e.currentTarget;
    pointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsScrubbing(true);
    const percent = getPercentFromClientX(e.clientX, e.currentTarget);
    seekTo(percent * duration);
  };

  useEffect(() => {
    if (!isScrubbing) return;

    const handlePointerMove = (event: PointerEvent) => {
      const target = scrubTargetRef.current;
      if (!target) return;
      const percent = getPercentFromClientX(event.clientX, target);
      seekTo(percent * duration);
    };

    const handlePointerUp = () => {
      const target = scrubTargetRef.current;
      const pointerId = pointerIdRef.current;
      if (target && pointerId !== null) {
        target.releasePointerCapture(pointerId);
      }
      pointerIdRef.current = null;
      setIsScrubbing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [duration, isScrubbing, seekTo]);

  const handleToggleFavorite = () => {
    if (isFavorite(currentTrack.surahId)) {
      removeFromFavorites(currentTrack.surahId);
    } else {
      addToFavorites(currentTrack.surahId);
    }
  };

  return (
    <div className="p-4 space-y-3 overflow-hidden">
      {/* Track Info */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-primary/20 flex-shrink-0">
          <img
            src={reciterImage}
            alt="حسن عدلي"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-0.5">
            <span className="text-white text-xs font-bold">
              {currentTrack.surahId}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">
            {currentTrack.surahName}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.qiraaName}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleToggleFavorite}
            className={`transition-colors ${
              isFavorite(currentTrack.surahId)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Heart
              className="w-4 h-4"
              fill={isFavorite(currentTrack.surahId) ? "currentColor" : "none"}
            />
          </button>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/player")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div
          onClick={handleSeek}
          onPointerDown={handleScrubStart}
          className="h-1 bg-secondary rounded-full cursor-pointer group"
        >
          <div
            className={`h-full bg-primary rounded-full ${
              isScrubbing ? "transition-none" : "transition-all"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handlePrevious}
            className="text-foreground hover:text-primary transition-colors"
          >
            <SkipBack className="w-4 h-4 -scale-x-100" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 mr-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-foreground hover:text-primary transition-colors"
          >
            <SkipForward className="w-4 h-4 -scale-x-100" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleLoop}
            className={`transition-colors ${isLooping ? "text-primary" : "text-muted-foreground"}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
