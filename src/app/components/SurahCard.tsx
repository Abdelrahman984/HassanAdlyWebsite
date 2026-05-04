import { Surah } from '../data/surahs';
import { useNavigate } from 'react-router';

interface SurahCardProps {
  surah: Surah;
}

export const SurahCard = ({ surah }: SurahCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/surah/${surah.id}`)}
      className="bg-card rounded-xl p-4 lg:p-5 hover:bg-secondary transition-all cursor-pointer border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-medium lg:text-lg">{surah.id}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium lg:text-lg truncate">{surah.nameArabic}</h3>
            <p className="text-sm text-muted-foreground">{surah.type} • {surah.verses} آية</p>
          </div>
        </div>
      </div>
    </div>
  );
};
