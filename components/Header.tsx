
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="py-4 px-6 sticky top-0 z-50 bg-white/30 dark:bg-black/30 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">
          🎂 AI Birthday Card Generator
        </h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};
