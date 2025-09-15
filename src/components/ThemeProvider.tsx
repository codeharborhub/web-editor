import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTheme } from '../lib/themeManager';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  themeClasses: ReturnType<typeof getTheme>;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('codeharbor-theme', 'dark');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const themeClasses = getTheme(theme);
  
  // Apply theme to body element
  useEffect(() => {
    document.body.className = theme === 'dark' 
      ? 'bg-gray-900 text-gray-100' 
      : 'bg-white text-gray-900';
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};