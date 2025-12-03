'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AboutEntranceContextType {
  hasEntered: boolean;
  setHasEntered: (value: boolean) => void;
}

const AboutEntranceContext = createContext<AboutEntranceContextType | undefined>(undefined);

export function AboutEntranceProvider({ children }: { children: ReactNode }) {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <AboutEntranceContext.Provider value={{ hasEntered, setHasEntered }}>
      {children}
    </AboutEntranceContext.Provider>
  );
}

export function useAboutEntrance() {
  const context = useContext(AboutEntranceContext);
  // Return default values if not within provider (for other pages)
  if (!context) {
    return { hasEntered: true, setHasEntered: () => {} };
  }
  return context;
}
