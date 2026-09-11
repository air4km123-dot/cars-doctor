"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { FeatureStatus } from "@/lib/types";
import { NewIdeaBadge, StatusBadge } from "./Badge";

export function Header({
  title,
  status,
  newIdea,
  onBack,
  right,
  transparent = false,
}: {
  title: string;
  status?: FeatureStatus;
  newIdea?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      className={`sticky top-0 z-30 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)] ${
        transparent ? "bg-transparent" : "bg-navy text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          aria-label="ย้อนกลับ"
          onClick={() => (onBack ? onBack() : router.back())}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg active:bg-white/20"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          {(status || newIdea) && (
            <div className="mb-1 flex gap-1.5">
              {status && <StatusBadge status={status} />}
              {newIdea && <NewIdeaBadge />}
            </div>
          )}
          <h1 className="truncate text-[17px] font-bold leading-tight">{title}</h1>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  );
}
