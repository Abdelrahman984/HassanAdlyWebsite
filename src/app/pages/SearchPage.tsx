import { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { SurahCard } from '../components/SurahCard';
import { surahs } from '../data/surahs';
import { qiraat } from '../data/qiraat';

export const SearchPage = () => {
  const [query, setQuery] = useState('');

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.nameArabic.includes(query) ||
      surah.nameTransliteration.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQiraat = qiraat.filter((qiraa) => qiraa.nameArabic.includes(query));

  const hasResults = filteredSurahs.length > 0 || filteredQiraat.length > 0;

  return (
    <div className="min-h-screen pb-20 lg:pb-8 lg:mr-64">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4 lg:p-8">
          <div className="relative max-w-3xl mx-auto">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن سورة أو قراءة..."
              className="w-full bg-input-background rounded-xl pr-11 pl-11 py-3 lg:py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-6xl mx-auto">
        {!query && (
          <div className="text-center py-12 lg:py-20">
            <SearchIcon className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground lg:text-lg">ابحث عن سورة أو قراءة</p>
          </div>
        )}

        {query && !hasResults && (
          <div className="text-center py-12 lg:py-20">
            <p className="text-muted-foreground lg:text-lg">لا توجد نتائج</p>
          </div>
        )}

        {query && filteredSurahs.length > 0 && (
          <section>
            <h2 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">السور</h2>
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {filteredSurahs.map((surah) => (
                <SurahCard key={surah.id} surah={surah} />
              ))}
            </div>
          </section>
        )}

        {query && filteredQiraat.length > 0 && (
          <section>
            <h2 className="text-lg lg:text-xl font-medium mb-3 lg:mb-4">القراءات</h2>
            <div className="grid gap-2 lg:grid-cols-2">
              {filteredQiraat.map((qiraa) => (
                <div
                  key={qiraa.id}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-medium">{qiraa.nameArabic}</h3>
                  <p className="text-sm text-muted-foreground">{qiraa.rawi}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
