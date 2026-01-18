import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={`
              p-2 rounded-lg transition-all
              ${isActive 
                ? 'bg-purple-600 text-white scale-110' 
                : 'text-purple-300 hover:bg-white/10 hover:text-white'
              }
            `}
            title={t.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
}
