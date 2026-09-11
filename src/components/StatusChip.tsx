import type { StatusLevel } from "@/lib/types";
import { STATUS_BG, STATUS_COLOR, STATUS_DOT, STATUS_LABEL } from "@/lib/utils";

export function StatusChip({ status, label, className = "" }: { status: StatusLevel; label?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_BG[status]} ${STATUS_COLOR[status]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}
