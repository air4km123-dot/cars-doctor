import type { FeatureStatus } from "@/lib/types";

const STATUS_STYLE: Record<FeatureStatus, string> = {
  FREE: "bg-status-green/10 text-status-green",
  PREMIUM: "bg-[#3A2E0B] text-[#F0C419]",
  COMING_SOON: "bg-[#E9ECEF] text-[#5B6470]",
  MARKETPLACE: "bg-[#0B1F33]/10 text-navy",
};

const STATUS_LABEL: Record<FeatureStatus, string> = {
  FREE: "FREE",
  PREMIUM: "★ PREMIUM",
  COMING_SOON: "COMING SOON",
  MARKETPLACE: "MARKETPLACE",
};

export function StatusBadge({ status, className = "" }: { status: FeatureStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${STATUS_STYLE[status]} ${className}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function NewIdeaBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-navy/30 px-2.5 py-1 text-[11px] font-bold tracking-wide text-navy ${className}`}
    >
      NEW IDEA
    </span>
  );
}

export function badgeStyleFor(status: FeatureStatus) {
  return STATUS_STYLE[status];
}

export function badgeLabelFor(status: FeatureStatus) {
  return STATUS_LABEL[status];
}
