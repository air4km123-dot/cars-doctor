"use client";

import { useState } from "react";
import { featuresByStage } from "@/lib/features";
import type { LifecycleStage } from "@/lib/types";
import { Header } from "@/components/Header";
import { ProductMapCard } from "@/components/ProductMapCard";
import { PillTab } from "@/components/ui";

const STAGES: { key: LifecycleStage; emoji: string; label: string }[] = [
  { key: "birth", emoji: "🏭", label: "เกิด" },
  { key: "life", emoji: "🚙", label: "ใช้ชีวิต" },
  { key: "sick", emoji: "🩺", label: "เจ็บ" },
  { key: "presell", emoji: "💰", label: "ก่อนขาย" },
  { key: "transfer", emoji: "♻️", label: "ส่งต่อ" },
  { key: "eol", emoji: "☠️", label: "จบชีวิตรถ" },
  { key: "marketplace", emoji: "🌐", label: "Marketplace" },
];

type BadgeFilter = "all" | "FREE" | "PREMIUM" | "COMING_SOON" | "MARKETPLACE" | "NEW_IDEA";

export default function ProductMapPage() {
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>("all");

  return (
    <div>
      <Header title="Product Map" />
      <div className="space-y-6 px-4 pt-4">
        <p className="text-[12.5px] leading-relaxed text-ink/55">
          มุมมองสำหรับผู้บริหาร แสดงฟีเจอร์ทั้งหมดของ Cars Doctor เรียงตามช่วงชีวิตของรถ ตั้งแต่เกิดจนจบชีวิตรถ พร้อมสถานะของแต่ละฟีเจอร์
        </p>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {(["all", "FREE", "PREMIUM", "MARKETPLACE", "COMING_SOON", "NEW_IDEA"] as BadgeFilter[]).map((f) => (
            <PillTab key={f} active={badgeFilter === f} onClick={() => setBadgeFilter(f)}>
              {f === "all" ? "ทั้งหมด" : f.replace("_", " ")}
            </PillTab>
          ))}
        </div>

        {STAGES.map((stage) => {
          const items = featuresByStage(stage.key).filter((f) => {
            if (badgeFilter === "all") return true;
            if (badgeFilter === "NEW_IDEA") return f.newIdea;
            return f.status === badgeFilter;
          });
          if (items.length === 0) return null;
          return (
            <div key={stage.key}>
              <div className="mb-2.5 flex items-center gap-2 px-1">
                <span className="text-[18px]">{stage.emoji}</span>
                <h2 className="text-[14.5px] font-bold text-ink">{stage.label}</h2>
                <span className="text-[11px] text-ink/35">({items.length})</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {items.map((f) => (
                  <ProductMapCard key={f.id} feature={f} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
