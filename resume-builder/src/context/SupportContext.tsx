"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SupportContextType = {
  isOpen: boolean;
  openSupport: () => void;
  closeSupport: () => void;
};

const SupportContext = createContext<SupportContextType | null>(null);

export function SupportProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SupportContext.Provider
      value={{
        isOpen,
        openSupport: () => setIsOpen(true),
        closeSupport: () => setIsOpen(false),
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
}
