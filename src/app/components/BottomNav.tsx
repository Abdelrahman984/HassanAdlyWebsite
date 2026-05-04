import { Home, Search, Heart, ListMusic, Download, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Search, label: 'بحث', path: '/search' },
    { icon: Heart, label: 'المفضلة', path: '/favorites' },
    { icon: ListMusic, label: 'المختارة', path: '/selected' },
    { icon: Download, label: 'التنزيلات', path: '/downloads' },
    { icon: User, label: 'عن الشيخ', path: '/about' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20">
      <div className="flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors flex-shrink-0 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
