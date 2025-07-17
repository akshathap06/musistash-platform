import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Palette, Settings, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const ThemeSelector = () => {
  const { theme, setTheme, predefinedThemes, resetToDefault } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { key: 'default', name: 'Default Blue', description: 'Classic MusiStash gradient' },
    { key: 'purple-pink', name: 'Purple Pink', description: 'Vibrant purple to pink gradient' },
    { key: 'green-teal', name: 'Green Teal', description: 'Nature-inspired green gradient' },
    { key: 'red-orange', name: 'Red Orange', description: 'Warm red to orange gradient' },
    { key: 'pure-black', name: 'Pure Black', description: 'Clean solid black background' },
    { key: 'dark-gray', name: 'Dark Gray', description: 'Subtle dark gray background' },
    { key: 'navy-blue', name: 'Navy Blue', description: 'Deep navy blue background' },
  ];

  const handleThemeChange = (themeKey: string) => {
    const newTheme = predefinedThemes[themeKey];
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  const getCurrentThemeName = () => {
    const currentTheme = themeOptions.find(option => 
      JSON.stringify(predefinedThemes[option.key]) === JSON.stringify(theme)
    );
    return currentTheme?.name || 'Custom';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gray-800/50 backdrop-blur-sm border-gray-600 text-gray-200 hover:bg-gray-700/50 h-10 px-4 py-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-gray-900 border-gray-700">
        <DropdownMenuLabel className="text-gray-300">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Background Theme
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        
        {themeOptions.map((option) => {
          const themeConfig = predefinedThemes[option.key];
          const isActive = JSON.stringify(themeConfig) === JSON.stringify(theme);
          
          return (
            <DropdownMenuItem
              key={option.key}
              onClick={() => handleThemeChange(option.key)}
              className={`cursor-pointer hover:bg-gray-800 ${isActive ? 'bg-blue-500/20' : ''}`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  <div 
                    className="w-6 h-6 rounded border border-gray-600"
                    style={{
                      background: themeConfig.backgroundType === 'solid' 
                        ? themeConfig.backgroundColor
                        : `linear-gradient(135deg, ${themeConfig.gradientColors[0]} 0%, ${themeConfig.gradientColors[1]} 50%, ${themeConfig.gradientColors[2]} 100%)`
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    {option.name}
                    {isActive && <Check className="h-3 w-3 text-blue-400" />}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {option.description}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          onClick={resetToDefault}
          className="cursor-pointer hover:bg-gray-800 text-gray-300"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Reset to Default
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector; 