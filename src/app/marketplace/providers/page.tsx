"use client";

import { useState } from "react";
import { providers } from "@/lib/mockData";
import { useUI } from "@/lib/uiStore";
import { Header } from "@/components/Header";
import { Card, PillTab } from "@/components/ui";
import { PrimaryButton } from "@/components/FormField";

type Sort = "distance" | "rating" | "price";

const PRICE_RANK: Record<string, number> = { "฿": 1, "฿฿": 2, "฿฿฿": 3 };

export default function ProvidersPage() {
  const { showToast } = useUI();
  const [sort, setSort] = useState<Sort>("distance");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [booked, setBooked] = useState<Record<string, boolean>>({});

  const sorted = [...providers].sort((a, b) => {
    if (sort === "distance") return a.distanceKm - b.distanceKm;
    if (sort === "rating") return b.rating - a.rating;
    return PRICE_RANK[a.priceLevel] - PRICE_RANK[b.priceLevel];
  });

  return (
    <div>
      <Header title="ค้นหาผู้ให้บริการ" status="MARKETPLACE" />
      <div className="space-y-4 px-4 pt-4">
        <div className="flex gap-2">
          <PillTab active={sort === "distance"} onClick={() => setSort("distance")}>ใกล้ที่สุด</PillTab>
          <PillTab active={sort === "rating"} onClick={() => setSort("rating")}>คะแนนสูงสุด</PillTab>
          <PillTab active={sort === "price"} onClick={() => setSort("price")}>ราคา</PillTab>
        </div>

        <div className="space-y-3">
          {sorted.map((p) => (
            <Card key={p.id}>
              <button className="w-full text-left" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold text-ink">{p.name}</p>
                    <p className="text-[11.5px] text-ink/45">{p.type} · {p.distanceKm} กม.</p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold ${p.availableToday ? "text-status-green" : "text-ink/35"}`}>
                    {p.availableToday ? "ว่างวันนี้" : "ไม่ว่าง"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-semibold text-ink/60">⭐ {p.rating} ({p.reviewCount})</span>
                  <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-semibold text-ink/60">{p.priceLevel}</span>
                  {p.specialty.slice(0, 2).map((s) => (
                    <span key={s} className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-semibold text-ink/60">{s}</span>
                  ))}
                </div>
              </button>

              {expanded === p.id && (
                <div className="animate-fade-in mt-3 space-y-2 border-t border-border pt-3">
                  <p className="text-[12px] text-ink/50">ราคาโดยประมาณ: <span className="font-bold text-ink">{p.estimatedPrice}</span></p>
                  {booked[p.id] ? (
                    <div className="rounded-xl bg-status-green/10 py-2.5 text-center text-[12.5px] font-bold text-status-green">✓ จองคิวสำเร็จ (ตัวอย่าง)</div>
                  ) : (
                    <PrimaryButton
                      onClick={() => {
                        setBooked((prev) => ({ ...prev, [p.id]: true }));
                        showToast("จองคิวสำเร็จ — นี่คือ Prototype สำหรับสาธิต");
                      }}
                    >
                      จองคิว (พรุ่งนี้ 10:00 น.)
                    </PrimaryButton>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
