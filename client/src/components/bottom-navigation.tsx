import { translations } from "@/lib/translations";

interface BottomNavigationProps {
  language: 'en' | 'ml' | 'ta' | 'hi';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ language, activeTab, onTabChange }: BottomNavigationProps) {
  const t = translations[language];

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'disease', icon: '🐛', label: 'Disease' },
    { id: 'fertilizer', icon: '🌿', label: 'Fertilizer' },
    { id: 'market', icon: '💰', label: 'Market' },
    { id: 'community', icon: '👥', label: 'Community' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto grid grid-cols-6 gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`p-3 text-center transition-colors ${
              activeTab === item.id
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid={`nav-${item.id}`}
          >
            <div className="text-lg mb-1">{item.icon}</div>
            <div className="text-xs font-medium">{item.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
