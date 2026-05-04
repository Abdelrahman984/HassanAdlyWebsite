import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Heart,
  ChevronRight,
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

export const SurahPlayerPage = () => {
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

  useEffect(() => {
    if (!currentTrack) {
      navigate("/");
    }
  }, [currentTrack, navigate]);

  if (!currentTrack) {
    return null;
  }

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
    window.addEventListener("pointerup", handlePointerUp, {
      once: true,
    });

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

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <div className="h-screen flex flex-col lg:mr-64 overflow-hidden">
      <header className="bg-background border-b border-border flex-shrink-0">
        <div className="p-4 lg:p-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <h1 className="text-lg lg:text-xl font-medium">المشغل</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`transition-colors ${
                isFavorite(currentTrack.surahId)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Heart
                className="w-6 h-6"
                fill={
                  isFavorite(currentTrack.surahId) ? "currentColor" : "none"
                }
              />
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Download className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
        <div className="flex flex-col items-center justify-center space-y-6 lg:space-y-8 w-full max-w-4xl">
          {/* Album Art */}
          <div className="relative w-32 h-32 lg:w-32 lg:h-32 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 flex-shrink-0 border-4 border-primary/20">
            <img
              src={reciterImage}
              alt="حسن عدلي"
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-lg lg:text-xl font-bold">سورة {currentTrack.surahName}</span>
                <span className="text-white/90 text-3xl lg:text-4xl font-bold">{currentTrack.surahId}</span>
              </div>
            </div> */}
          </div>

          {/* Track Info */}
          <div className="text-center space-y-2 w-full max-w-md flex-shrink-0">
            <h2 className="text-2xl lg:text-3xl font-bold truncate">
              {currentTrack.surahName}
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground truncate">
              {currentTrack.qiraaName}
            </p>
            <p className="text-sm text-muted-foreground">حسن عدلي</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl space-y-2 flex-shrink-0">
            <div
              onClick={handleSeek}
              onPointerDown={handleScrubStart}
              className="h-2 bg-secondary rounded-full cursor-pointer group"
            >
              <div
                className={`h-full bg-primary rounded-full relative ${
                  isScrubbing ? "transition-none" : "transition-all"
                }`}
                style={{ width: `${progressPercent}%` }}
              >
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg transition-opacity ${
                    isScrubbing
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
            <button
              onClick={handlePrevious}
              className="text-foreground hover:text-primary transition-colors hover:scale-110 transform"
            >
              <SkipBack className="w-7 h-7 lg:w-8 lg:h-8 -scale-x-100" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground shadow-xl hover:scale-105 transform transition-all"
            >
              {isPlaying ? (
                <Pause
                  className="w-8 h-8 lg:w-10 lg:h-10"
                  fill="currentColor"
                />
              ) : (
                <Play
                  className="w-8 h-8 lg:w-10 lg:h-10 mr-1"
                  fill="currentColor"
                />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-foreground hover:text-primary transition-colors hover:scale-110 transform"
            >
              <SkipForward className="w-7 h-7 lg:w-8 lg:h-8 -scale-x-100" />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center gap-4 lg:gap-8 flex-wrap justify-center flex-shrink-0">
            <button
              onClick={toggleLoop}
              className={`transition-colors hover:scale-110 transform ${
                isLooping ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Repeat className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-sm transition-all ${
                    playbackRate === rate
                      ? "bg-primary text-primary-foreground scale-105"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
