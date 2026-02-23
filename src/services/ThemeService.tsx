import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'blue' | 'green' | 'purple' | 'medical';

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    card: string;
    border: string;
    muted: string;
    success: string;
    warning: string;
    error: string;
  };
  isDark?: boolean;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
  toggleTheme: () => void;
  themeConfig: ThemeConfig;
  availableThemes: ThemeConfig[];
  applyCustomTheme: (config: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

// Theme configurations
const themeConfigs: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: 'Light',
    description: 'Clean and bright theme',
    colors: {
      primary: '#030213',
      secondary: '#f1f5f9',
      accent: '#e2e8f0',
      background: '#ffffff',
      foreground: '#1e293b',
      card: '#ffffff',
      border: 'rgba(0, 0, 0, 0.1)',
      muted: '#64748b',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    description: 'Elegant dark theme',
    isDark: true,
    colors: {
      primary: '#3b82f6',
      secondary: '#1e293b',
      accent: '#334155',
      background: '#0a0f1e',
      foreground: '#f1f5f9',
      card: '#1e293b',
      border: '#334155',
      muted: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  blue: {
    name: 'blue',
    displayName: 'Ocean Blue',
    description: 'Professional blue theme',
    colors: {
      primary: '#0ea5e9',
      secondary: '#e0f2fe',
      accent: '#bae6fd',
      background: '#f8fafc',
      foreground: '#0f172a',
      card: '#ffffff',
      border: '#e2e8f0',
      muted: '#64748b',
      success: '#06b6d4',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  green: {
    name: 'green',
    displayName: 'Medical Green',
    description: 'Calming medical green',
    colors: {
      primary: '#059669',
      secondary: '#ecfdf5',
      accent: '#d1fae5',
      background: '#f9fafb',
      foreground: '#111827',
      card: '#ffffff',
      border: '#e5e7eb',
      muted: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  purple: {
    name: 'purple',
    displayName: 'Royal Purple',
    description: 'Elegant purple theme',
    colors: {
      primary: '#7c3aed',
      secondary: '#f3e8ff',
      accent: '#e9d5ff',
      background: '#fafafa',
      foreground: '#18181b',
      card: '#ffffff',
      border: '#e4e4e7',
      muted: '#71717a',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  },
  medical: {
    name: 'medical',
    displayName: 'Medical Professional',
    description: 'Professional medical theme',
    colors: {
      primary: '#1e40af',
      secondary: '#f0f9ff',
      accent: '#dbeafe',
      background: '#ffffff',
      foreground: '#1e293b',
      card: '#f8fafc',
      border: '#cbd5e1',
      muted: '#64748b',
      success: '#16a34a',
      warning: '#ea580c',
      error: '#dc2626',
    }
  },
  system: {
    name: 'system',
    displayName: 'System',
    description: 'Follow system preference',
    colors: {
      primary: '#030213',
      secondary: '#f1f5f9',
      accent: '#e2e8f0',
      background: '#ffffff',
      foreground: '#1e293b',
      card: '#ffffff',
      border: 'rgba(0, 0, 0, 0.1)',
      muted: '#64748b',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'system' 
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [customThemeConfig, setCustomThemeConfig] = useState<Partial<ThemeConfig> | null>(null);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedCustomTheme = localStorage.getItem('customTheme');
    
    if (savedTheme && Object.keys(themeConfigs).includes(savedTheme)) {
      setTheme(savedTheme);
    }
    
    if (savedCustomTheme) {
      try {
        setCustomThemeConfig(JSON.parse(savedCustomTheme));
      } catch (error) {
        console.warn('Failed to parse custom theme config:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Calculate effective theme
    let newEffectiveTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      // Use system preference
      newEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      const currentConfig = themeConfigs[theme];
      newEffectiveTheme = currentConfig?.isDark ? 'dark' : 'light';
    }

    setEffectiveTheme(newEffectiveTheme);

    // Apply theme to document
    applyThemeToDocument(theme, newEffectiveTheme);

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, customThemeConfig]);

  const applyThemeToDocument = (currentTheme: Theme, effectiveMode: 'light' | 'dark') => {
    const root = document.documentElement;
    const config = customThemeConfig || themeConfigs[currentTheme];
    
    // Remove existing theme classes
    root.className = root.className.replace(/\b(light|dark|blue|green|purple|medical)\b/g, '');
    
    // Add current theme classes
    root.classList.add(effectiveMode);
    if (currentTheme !== 'system') {
      root.classList.add(currentTheme);
    }

    // Apply CSS variables dynamically
    if (config?.colors) {
      Object.entries(config.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
        root.style.setProperty(`--${key}`, value);
      });
    }

    // Additional dark mode specific variables
    if (effectiveMode === 'dark') {
      root.style.setProperty('--sidebar', '#0f172a');
      root.style.setProperty('--sidebar-solid', '#1e293b');
      root.style.setProperty('--topbar', '#1e293b');
      root.style.setProperty('--sidebar-border', '#334155');
      root.style.setProperty('--sidebar-foreground', '#f1f5f9');
      root.style.setProperty('--sidebar-accent', '#334155');
      root.style.setProperty('--sidebar-accent-foreground', '#f1f5f9');
      root.style.setProperty('--sidebar-primary', '#3b82f6');
      root.style.setProperty('--sidebar-primary-foreground', '#ffffff');
      root.style.setProperty('--popover', '#1e293b');
      root.style.setProperty('--popover-foreground', '#f1f5f9');
      root.style.setProperty('--input-background', '#0f172a');
      root.style.setProperty('--muted-foreground', '#94a3b8');
      root.style.setProperty('--accent-foreground', '#f1f5f9');
      root.style.setProperty('--destructive', '#ef4444');
      root.style.setProperty('--destructive-foreground', '#ffffff');
      root.style.setProperty('--ring', '#3b82f6');
      root.style.setProperty('--info', '#3b82f6');
      root.style.setProperty('--info-foreground', '#ffffff');
      root.style.setProperty('--success-foreground', '#ffffff');
      root.style.setProperty('--warning-foreground', '#ffffff');
    } else {
      // Light mode variables
      root.style.setProperty('--sidebar', '#ffffff');
      root.style.setProperty('--sidebar-solid', '#f8fafc');
      root.style.setProperty('--topbar', '#ffffff');
      root.style.setProperty('--sidebar-border', '#e2e8f0');
      root.style.setProperty('--sidebar-foreground', '#1e293b');
      root.style.setProperty('--sidebar-accent', '#f1f5f9');
      root.style.setProperty('--sidebar-accent-foreground', '#1e293b');
      root.style.setProperty('--sidebar-primary', '#3b82f6');
      root.style.setProperty('--sidebar-primary-foreground', '#ffffff');
      root.style.setProperty('--popover', '#ffffff');
      root.style.setProperty('--popover-foreground', '#1e293b');
      root.style.setProperty('--input-background', '#ffffff');
      root.style.setProperty('--muted-foreground', '#64748b');
      root.style.setProperty('--accent-foreground', '#1e293b');
      root.style.setProperty('--destructive', '#ef4444');
      root.style.setProperty('--destructive-foreground', '#ffffff');
      root.style.setProperty('--ring', '#3b82f6');
      root.style.setProperty('--info', '#3b82f6');
      root.style.setProperty('--info-foreground', '#ffffff');
      root.style.setProperty('--success-foreground', '#ffffff');
      root.style.setProperty('--warning-foreground', '#ffffff');
    }
  };

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newEffectiveTheme = mediaQuery.matches ? 'dark' : 'light';
        setEffectiveTheme(newEffectiveTheme);
        
        // Apply theme to document
        const root = document.documentElement;
        root.className = root.className.replace(/\b(light|dark)\b/g, '');
        root.classList.add(newEffectiveTheme);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = effectiveTheme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const applyCustomTheme = (config: Partial<ThemeConfig>) => {
    setCustomThemeConfig(config);
    localStorage.setItem('customTheme', JSON.stringify(config));
  };

  const resetTheme = () => {
    setCustomThemeConfig(null);
    localStorage.removeItem('customTheme');
    setTheme('system');
  };

  const currentThemeConfig = customThemeConfig || themeConfigs[theme];
  const availableThemes = Object.values(themeConfigs).filter(config => config.name !== 'system');

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      effectiveTheme, 
      toggleTheme,
      themeConfig: currentThemeConfig,
      availableThemes,
      applyCustomTheme,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;