"use client";

import { useMemo, useState } from "react";
import { useCarData } from "@/lib/store";
import { accidents, claims, initialFuelLogs } from "@/lib/mockData";
import { formatNumber, formatThaiDate } from "@/lib/utils";
import { Card, PillTab } from "@/components/ui";

type FilterType = "all" | "maintenance" | "fuel" | "expense" | "document" | "accident" | "claim";

interface HistoryItem {
  id: string;
  date: string;
  type: Exclude<FilterType, "all">;
  icon: string;
  title: string;
  subtitle: string;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "maintenance", label: "ซ่อมบำรุง" },
  { key: "fuel", label: "น้ำมัน" },
  { key: "expense", label: "ค่าใช้จ่าย" },
  { key: "document", label: "เอกสาร" },
  { key: "accident", label: "อุบัติเหตุ" },
  { key: "claim", label: "เคลม" },
];

export default function HistoryPage() {
  const { maintenanceEvents, expenses, documents } = useCarData();
  const [filter, setFilter] = useState<FilterType>("all");

  const items = useMemo<HistoryItem[]>(() => {
    const all: HistoryItem[] = [
      ...maintenanceEvents.map((e) => ({
        id: `m-${e.id}`,
        date: e.date,
        type: "maintenance" as const,
        icon: "🔧",
        title: e.title,
        subtitle: `${formatNumber(e.mileage)} กม. · ฿${formatNumber(e.cost)}${e.location ? ` · ${e.location}` : ""}`,
      })),
      ...initialFuelLogs.map((f) => ({
        id: `f-${f.id}`,
        date: f.date,
        type: "fuel" as const,
        icon: "⛽",
        title: `เติมน้ำมัน ${f.fuelType}`,
        subtitle: `${f.liters} ลิตร · ฿${formatNumber(f.totalCost)}`,
      })),
      ...expenses
        .filter((e) => !["fuel", "maintenance"].includes(e.category))
        .map((e) => ({
          id: `e-${e.id}`,
          date: e.date,
          type: "expense" as const,
          icon: "💸",
          title: e.title,
          subtitle: `฿${formatNumber(e.amount)}`,
        })),
      ...documents.map((d) => ({
        id: `d-${d.id}`,
        date: d.addedDate,
        type: "document" as const,
        icon: "🗂️",
        title: `เพิ่มเอกสาร: ${d.title}`,
        subtitle: formatThaiDate(d.addedDate),
      })),
      ...accidents.map((a) => ({
        id: `a-${a.id}`,
        date: a.date,
        type: "accident" as const,
        icon: "⚠️",
        title: "อุบัติเหตุ",
        subtitle: a.detail,
      })),
      ...claims.map((c) => ({
        id: `c-${c.id}`,
        date: c.date,
        type: "claim" as const,
        icon: "📋",
        title: `เคลมประกัน (${c.insurer})`,
        subtitle: `฿${formatNumber(c.amount)} · ${c.status === "closed" ? "ปิดเคสแล้ว" : "อยู่ระหว่างดำเนินการ"}`,
      })),
    ];
    return all.sort((x, y) => (x.date < y.date ? 1 : -1));
  }, [maintenanceEvents, expenses, documents]);

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="pb-4">
      <div className="bg-navy px-4 pb-6 pt-[calc(env(safe-area-inset-top)+18px)] text-white">
        <h1 className="text-[19px] font-bold">ประวัติ</h1>
        <p className="mt-0.5 text-[12.5px] text-white/60">ไทม์ไลน์รวมทุกกิจกรรมของรถคันนี้</p>
      </div>
      <div className="px-4 pt-4">
        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
          {FILTERS.map((f) => (
            <PillTab key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </PillTab>
          ))}
        </div>

        <Card className="divide-y divide-border">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg text-[18px]">{item.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{item.title}</p>
                <p className="truncate text-[11.5px] text-ink/45">{item.subtitle}</p>
              </div>
              <span className="shrink-0 text-[11px] text-ink/40">{formatThaiDate(item.date)}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
