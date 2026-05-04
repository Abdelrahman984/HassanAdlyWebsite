import { Home, Search, Heart, ListMusic, Download, Sun, Moon, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { SidebarPlayer } from './SidebarPlayer';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrack } = usePlayer();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Search, label: 'بحث', path: '/search' },
    { icon: Heart, label: 'المفضلة', path: '/favorites' },
    { icon: ListMusic, label: 'المختارة', path: '/selected' },
    { icon: Download, label: 'التنزيلات', path: '/downloads' },
    { icon: User, label: 'عن الشيخ', path: '/about' },
  ];

  return (
    <aside className="hidden lg:flex fixed right-0 top-0 h-screen w-64 bg-card border-l border-border flex-col">
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">القرآن الكريم</h1>
          <p className="text-sm text-muted-foreground mt-1">حسن عدلي</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {currentTrack && (
        <div className="border-t border-border">
          <SidebarPlayer />
        </div>
      )}

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © 2026 القرآن الكريم
        </p>
      </div>
    </aside>
  );
};
