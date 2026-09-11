import Link from "next/link";
import type { FeatureMeta } from "@/lib/types";
import { NewIdeaBadge, StatusBadge } from "./Badge";

export function ProductMapCard({ feature }: { feature: FeatureMeta }) {
  return (
    <Link href={feature.route} className="block rounded-2xl border border-border bg-white p-3 active:bg-bg/50">
      <div className="flex items-start gap-2">
        <span className="text-[18px]">{feature.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-bold text-ink">{feature.title}</p>
          {feature.englishTitle && <p className="truncate text-[10.5px] text-ink/40">{feature.englishTitle}</p>}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <StatusBadge status={feature.status} className="px-2 py-0.5 text-[9.5px]" />
        {feature.newIdea && <NewIdeaBadge className="px-2 py-0.5 text-[9.5px]" />}
      </div>
    </Link>
  );
}
