"use client";

import { useUI } from "@/lib/uiStore";

export function Toast() {
  const { toast } = useUI();
  if (!toast) return null;
  return (
    <div className="pointer-events-none absolute bottom-[110px] left-1/2 z-50 w-[85%] -translate-x-1/2">
      <div className="animate-slide-up rounded-2xl bg-ink/90 px-4 py-3 text-center text-[13px] font-medium text-white shadow-lg">
        {toast}
      </div>
    </div>
  );
}
