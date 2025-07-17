import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig, themeService } from '@/services/themeService';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  backgroundStyle: React.CSSProperties;
  predefinedThemes: Record<string, ThemeConfig>;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => themeService.getTheme());

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
    themeService.setTheme(newTheme);
  };

  const backgroundStyle = themeService.getBackgroundStyle();
  const predefinedThemes = themeService.getPredefinedThemes();

  const resetToDefault = () => {
    const defaultTheme = themeService.getTheme();
    setTheme(defaultTheme);
  };

  // Update background style when theme changes
  useEffect(() => {
    const style = themeService.getBackgroundStyle();
    document.body.style.background = (style.background as string) || (style.backgroundColor as string) || '';
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    backgroundStyle,
    predefinedThemes,
    resetToDefault
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 