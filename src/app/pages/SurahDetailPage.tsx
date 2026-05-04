import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronRight, Heart } from 'lucide-react';
import { QiraaListItem } from '../components/QiraaListItem';
import { surahs } from '../data/surahs';
import { qiraat } from '../data/qiraat';
import { apiService } from '../services/api';
import { usePlayer } from '../context/PlayerContext';

export const SurahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack, isFavorite, addToFavorites, removeFromFavorites } = usePlayer();

  const surah = surahs.find((s) => s.id === Number(id));
  const [loading, setLoading] = useState(false);

  if (!surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">السورة غير موجودة</p>
      </div>
    );
  }

  const handlePlayQiraa = async (qiraaId: number) => {
    setLoading(true);
    try {
      const track = await apiService.getAudioTrack(surah.id, qiraaId);
      playTrack(track);
      navigate('/player');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite(surah.id)) {
      removeFromFavorites(surah.id);
    } else {
      addToFavorites(surah.id);
    }
  };

  return (
    <div className="min-h-screen pb-32 lg:pb-8 lg:mr-64">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 lg:px-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-foreground hover:text-primary transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
          <h1 className="text-lg lg:text-xl font-medium flex-1 text-center">{surah.nameArabic}</h1>
          <button
            onClick={handleToggleFavorite}
            className={`transition-colors ${
              isFavorite(surah.id) ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Heart
              className="w-6 h-6"
              fill={isFavorite(surah.id) ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </header>

      <main className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2 py-6 lg:py-10">
          <h2 className="text-3xl lg:text-5xl font-bold">{surah.nameArabic}</h2>
          <p className="text-muted-foreground lg:text-lg">
            {surah.type} • {surah.verses} آية
          </p>
        </div>

        <section>
          <h3 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">القراءات العشر</h3>
          <div className="grid gap-2 lg:grid-cols-2">
            {qiraat.map((qiraa) => (
              <QiraaListItem
                key={qiraa.id}
                qiraa={qiraa}
                surahId={surah.id}
                duration={surah.verses * 15}
                onPlay={() => handlePlayQiraa(qiraa.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
