import { useEffect, useRef, useState } from 'react';
import { Cake, Check, Moon, Palette, Sun, Trees, type LucideIcon } from 'lucide-react';

const THEME_KEY = 'blog-theme';

const themes: { name: string; label: string; icon: LucideIcon }[] = [
  { name: 'light', label: 'Light', icon: Sun },
  { name: 'dark', label: 'Dark', icon: Moon },
  { name: 'cupcake', label: 'Cupcake', icon: Cake },
  { name: 'forest', label: 'Forest', icon: Trees },
];

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const chooseTheme = (name: string) => {
    setTheme(name);
    if (dropdownRef.current) dropdownRef.current.open = false;
  };

  return (
    <details ref={dropdownRef} className="dropdown dropdown-end">
      <summary className="btn btn-ghost btn-circle" aria-label="Change theme">
        <Palette className="size-5" />
      </summary>
      <ul className="menu dropdown-content z-50 mt-3 w-44 rounded-box bg-base-100 p-2 shadow">
        <li className="menu-title">Theme</li>
        {themes.map(({ name, label, icon: Icon }) => (
          <li key={name}>
            <button type="button" onClick={() => chooseTheme(name)} className="justify-between">
              <span className="flex items-center gap-2">
                <Icon className="size-4" /> {label}
              </span>
              {theme === name && <Check className="size-4 text-primary" />}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
};
