export interface ThemeConfig {
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  gradientColors: string[];
}

export const defaultTheme: ThemeConfig = {
  backgroundType: 'gradient',
  backgroundColor: '#000000',
  gradientColors: ['#0f1419', '#1a1b26', '#1e2030']
};

export const predefinedThemes: Record<string, ThemeConfig> = {
  'default': {
    backgroundType: 'gradient',
    backgroundColor: '#000000',
    gradientColors: ['#0f1419', '#1a1b26', '#1e2030']
  },
  'blue-purple': {
    backgroundType: 'gradient',
    backgroundColor: '#000000',
    gradientColors: ['#0f1419', '#1a1b26', '#1e2030']
  },
  'purple-pink': {
    backgroundType: 'gradient',
    backgroundColor: '#000000',
    gradientColors: ['#1a0b2e', '#2d1b4e', '#4a1b6a']
  },
  'green-teal': {
    backgroundType: 'gradient',
    backgroundColor: '#000000',
    gradientColors: ['#0a1a0a', '#1a2e1a', '#1a3a2e']
  },
  'red-orange': {
    backgroundType: 'gradient',
    backgroundColor: '#000000',
    gradientColors: ['#1a0a0a', '#2e1a0a', '#3a1a0a']
  },
  'pure-black': {
    backgroundType: 'solid',
    backgroundColor: '#000000',
    gradientColors: ['#000000', '#000000', '#000000']
  },
  'dark-gray': {
    backgroundType: 'solid',
    backgroundColor: '#1a1a1a',
    gradientColors: ['#1a1a1a', '#1a1a1a', '#1a1a1a']
  },
  'navy-blue': {
    backgroundType: 'solid',
    backgroundColor: '#0a0a1a',
    gradientColors: ['#0a0a1a', '#0a0a1a', '#0a0a1a']
  }
};

class ThemeService {
  private storageKey = 'musistash_theme';

  getTheme(): ThemeConfig {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
    return defaultTheme;
  }

  setTheme(theme: ThemeConfig): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  getBackgroundStyle(): React.CSSProperties {
    const theme = this.getTheme();
    
    if (theme.backgroundType === 'solid') {
      return {
        backgroundColor: theme.backgroundColor
      };
    } else {
      return {
        background: `linear-gradient(135deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 50%, ${theme.gradientColors[2]} 100%)`
      };
    }
  }

  getPredefinedThemes(): Record<string, ThemeConfig> {
    return predefinedThemes;
  }

  resetToDefault(): void {
    this.setTheme(defaultTheme);
  }
}

export const themeService = new ThemeService(); 