import { useState, useEffect } from 'react';
import { Search as SearchIcon, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Hero } from '../components/Hero';
import { SurahCard } from '../components/SurahCard';
import { surahs, Surah } from '../data/surahs';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import reciterImage from '../../imports/hassan-adly.jpg';

export const HomePage = () => {
  const navigate = useNavigate();
  const { currentTrack } = usePlayer();
  const { theme, toggleTheme } = useTheme();
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    setAllSurahs(surahs);
  }, []);

  return (
    <div className="min-h-screen pb-32 lg:pb-8 lg:mr-64">
      <header className="lg:hidden sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">القرآن الكريم</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => navigate('/search')}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      <main className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        {currentTrack && (
          <section>
            <h2 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">استكمل الاستماع</h2>
            <div
              onClick={() => navigate('/player')}
              className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 lg:p-6 border border-primary/20 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-lg overflow-hidden border border-primary/30 flex-shrink-0">
                  <img
                    src={reciterImage}
                    alt="حسن عدلي"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                    <span className="text-white text-sm lg:text-base font-bold">{currentTrack.surahId}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium lg:text-lg">{currentTrack.surahName}</h3>
                  <p className="text-sm text-muted-foreground">{currentTrack.qiraaName}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">السور</h2>
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {allSurahs.map((surah) => (
              <SurahCard key={surah.id} surah={surah} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
