import { Heart } from 'lucide-react';
import { SurahCard } from '../components/SurahCard';
import { surahs } from '../data/surahs';
import { usePlayer } from '../context/PlayerContext';

export const FavoritesPage = () => {
  const { favorites } = usePlayer();

  const favoriteSurahs = surahs.filter((surah) => favorites.includes(surah.id));

  return (
    <div className="min-h-screen pb-20 lg:pb-8 lg:mr-64">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 lg:p-8">
          <h1 className="text-xl lg:text-2xl font-bold">المفضلة</h1>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-6xl mx-auto">
        {favoriteSurahs.length === 0 ? (
          <div className="text-center py-12 lg:py-20">
            <Heart className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground lg:text-lg">لا توجد سور مفضلة</p>
            <p className="text-sm text-muted-foreground mt-1">
              أضف سورًا إلى المفضلة لتظهر هنا
            </p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {favoriteSurahs.map((surah) => (
              <SurahCard key={surah.id} surah={surah} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
