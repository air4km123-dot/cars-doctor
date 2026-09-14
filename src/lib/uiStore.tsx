"use client";

import React, { createContext, useContext, useState } from "react";

interface UIContextValue {
  quickAddOpen: boolean;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;

  voiceOpen: boolean;
  openVoice: () => void;
  closeVoice: () => void;

  ocrOpen: boolean;
  ocrTarget: string | null;
  openOcr: (target?: string) => void;
  closeOcr: () => void;

  profileMenuOpen: boolean;
  openProfileMenu: () => void;
  closeProfileMenu: () => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [ocrTarget, setOcrTarget] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  const value: UIContextValue = {
    quickAddOpen,
    openQuickAdd: () => setQuickAddOpen(true),
    closeQuickAdd: () => setQuickAddOpen(false),
    voiceOpen,
    openVoice: () => {
      setQuickAddOpen(false);
      setVoiceOpen(true);
    },
    closeVoice: () => setVoiceOpen(false),
    ocrOpen,
    ocrTarget,
    openOcr: (target) => {
      setQuickAddOpen(false);
      setOcrTarget(target ?? null);
      setOcrOpen(true);
    },
    closeOcr: () => setOcrOpen(false),
    profileMenuOpen,
    openProfileMenu: () => setProfileMenuOpen(true),
    closeProfileMenu: () => setProfileMenuOpen(false),
    toast,
    showToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
