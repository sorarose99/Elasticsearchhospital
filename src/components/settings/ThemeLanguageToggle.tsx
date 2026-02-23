import React from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { Moon, Sun, Monitor, Languages, Palette } from 'lucide-react';

interface ThemeLanguageToggleProps {
  showLabels?: boolean;
  variant?: 'compact' | 'full';
}

const ThemeLanguageToggle: React.FC<ThemeLanguageToggleProps> = ({ 
  showLabels = true, 
  variant = 'full' 
}) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, setTheme, effectiveTheme, toggleTheme } = useTheme();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const ThemeIcon = themeIcons[theme];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Quick Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-8 w-8 p-0"
          title={t('theme.toggle')}
        >
          {effectiveTheme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Quick Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="h-8 w-8 p-0"
          title={t('settings.language')}
        >
          <Languages className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        {showLabels && (
          <span className="text-sm font-medium">{t('settings.language')}:</span>
        )}
        <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Theme Selector */}
      <div className="flex items-center gap-2">
        {showLabels && (
          <span className="text-sm font-medium">{t('settings.theme')}:</span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-32 justify-start">
              <ThemeIcon className="h-4 w-4 mr-2" />
              {t(`theme.${theme}`)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="h-4 w-4 mr-2" />
              {t('theme.light')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="h-4 w-4 mr-2" />
              {t('theme.dark')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="h-4 w-4 mr-2" />
              {t('theme.system')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ThemeLanguageToggle;