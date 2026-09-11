"use client";

import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="animate-fade-in absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-slide-up relative w-full max-w-[380px] rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px]">
        {children}
      </div>
    </div>
  );
}
