import { BrowserRouter, Routes, Route } from 'react-router';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { SurahDetailPage } from './pages/SurahDetailPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SelectedPage } from './pages/SelectedPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { SurahPlayerPage } from './pages/SurahPlayerPage';
import { AboutPage } from './pages/AboutPage';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayer } from './components/FullPlayer';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { usePlayer } from './context/PlayerContext';

function AppContent() {
  const { showFullPlayer } = usePlayer();

  return (
    <div className="size-full">
      <Sidebar />

      {showFullPlayer && <FullPlayer />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/surah/:id" element={<SurahDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/selected" element={<SelectedPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        <Route path="/player" element={<SurahPlayerPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}