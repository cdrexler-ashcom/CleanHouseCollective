"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { QuoteModal } from "./QuoteModal";

type QuoteContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

/**
 * Wraps the app so any component can trigger the quote questionnaire modal
 * via the `useQuote()` hook — e.g. `const { open } = useQuote();`.
 */
export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteModal isOpen={isOpen} onClose={close} />
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return ctx;
}
