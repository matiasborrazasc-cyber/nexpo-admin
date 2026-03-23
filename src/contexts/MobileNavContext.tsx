import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface MobileNavContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const MobileNavContext = createContext<MobileNavContextType | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);
  return (
    <MobileNavContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  return ctx ?? { isOpen: false, toggle: () => {}, close: () => {} };
}
