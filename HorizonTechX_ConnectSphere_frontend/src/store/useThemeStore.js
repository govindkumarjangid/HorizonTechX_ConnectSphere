import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cs_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('cs_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cs_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const setTheme = (mode) => setIsDark(mode === 'dark');

  return React.createElement(
    ThemeContext.Provider,
    { value: { isDark, toggleTheme, setTheme } },
    children
  );
};

export const useTheme = () => useContext(ThemeContext);
