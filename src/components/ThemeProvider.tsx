'use client';

import { ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeContext } from '@/hooks/useTheme';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface ThemeProviderProps {
  children: ReactNode;
}

type Theme = 'light' | 'dark';

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Star particles configuration
  const particlesOptions = useMemo<ISourceOptions>(() => ({
    particles: {
      number: {
        value: 100,
      },
      color: {
        value: theme === 'dark' ? '#ffffff' : '#000000',
      },
      opacity: {
        value: {
          min: 0,
          max: 0.5
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 5 }
      },
      move: {
        enable: true,
        speed: 1,
      },
      links: {
        enable: false,
      },
    },
    background: {
      color: {
        value: "transparent",
      },
    },
  }), [theme]);

  useEffect(() => {
    setMounted(true);
    
    // Initialize particles engine
    initParticlesEngine(async (engine) => {
      console.log('Initializing particles...');
      await loadSlim(engine);
      console.log('Particles initialized successfully');
    });
    
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) {
      setTheme(stored);
      updateDocumentClass(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      updateDocumentClass('dark');
    }
  }, []);

  const updateDocumentClass = useCallback((newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    updateDocumentClass(newTheme);
  }, [theme, updateDocumentClass]);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log('Particles container loaded:', container);
  }, []);

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="relative min-h-screen">
        <Particles
          id="tsparticles"
          className="absolute inset-0 w-full h-full z-1"
          style={{ 
            zIndex: -1,
            pointerEvents: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          particlesLoaded={particlesLoaded}
          options={particlesOptions}
        />
        <div className="relative">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
}