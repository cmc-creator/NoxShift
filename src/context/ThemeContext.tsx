import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, THEMES, getThemeById } from '../themes/themeConfig';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  customColors: Partial<Theme['colors']>;
  updateCustomColor: (key: keyof Theme['colors'], value: string) => void;
  resetCustomColors: () => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState('dark-default');
  const [customColors, setCustomColors] = useState<Partial<Theme['colors']>>({});
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSizeState] = useState(16);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('noxshift-theme');
    const savedCustomColors = localStorage.getItem('noxshift-custom-colors');
    const savedFont = localStorage.getItem('noxshift-font');
    const savedFontSize = localStorage.getItem('noxshift-font-size');

    if (savedTheme) setCurrentThemeId(savedTheme);
    if (savedCustomColors) setCustomColors(JSON.parse(savedCustomColors));
    if (savedFont) setFontFamily(savedFont);
    if (savedFontSize) setFontSizeState(parseInt(savedFontSize));
  }, []);

  // Save theme to localStorage and apply CSS variables
  useEffect(() => {
    localStorage.setItem('noxshift-theme', currentThemeId);
    
    const theme = getThemeById(currentThemeId);
    const finalColors = { ...theme.colors, ...customColors };

    // Apply CSS variables to :root
    const root = document.documentElement;
    Object.entries(finalColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply gradients if available
    if (theme.gradients?.background) {
      root.style.setProperty('--gradient-background', theme.gradients.background);
    }
    if (theme.gradients?.primary) {
      root.style.setProperty('--gradient-primary', theme.gradients.primary);
    }

    // Apply font
    root.style.setProperty('--font-family', fontFamily);
    document.body.style.fontFamily = fontFamily;
    document.body.style.fontSize = `${fontSize}px`;
  }, [currentThemeId, customColors, fontFamily, fontSize]);

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    setCustomColors({}); // Reset custom colors when switching themes
  };

  const updateCustomColor = (key: keyof Theme['colors'], value: string) => {
    const updated = { ...customColors, [key]: value };
    setCustomColors(updated);
    localStorage.setItem('noxshift-custom-colors', JSON.stringify(updated));
  };

  const resetCustomColors = () => {
    setCustomColors({});
    localStorage.removeItem('noxshift-custom-colors');
  };

  const setFont = (font: string) => {
    setFontFamily(font);
    localStorage.setItem('noxshift-font', font);
  };

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('noxshift-font-size', size.toString());
  };

  const currentTheme = getThemeById(currentThemeId);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        customColors,
        updateCustomColor,
        resetCustomColors,
        fontFamily,
        setFontFamily: setFont,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
