"use client";

import Link from "next/link";
import { useCarData } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { fuelPriceToday, usefulTodayCards, driverProfile } from "@/lib/mockData";
import { formatBaht, formatNumber, statusFromDays, TODAY } from "@/lib/utils";
import { Card, HealthRing, SectionHeader } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import { IconMenu } from "@/components/icons";

const STATUS_RANK = { urgent: 0, dueSoon: 1, warning: 2, healthy: 3 } as const;

export default function HomePage() {
  const { vehicle, reminders, expenses, health } = useCarData();
  const { openProfileMenu } = useUI();

  const upcoming = [...reminders]
    .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])
    .slice(0, 4);

  const thisMonth = TODAY.getMonth();
  const monthTotal = expenses
    .filter((e) => new Date(e.date).getMonth() === thisMonth && new Date(e.date).getFullYear() === TODAY.getFullYear())
    .reduce((sum, e) => sum + e.amount, 0);

  const worstCategory = [...health.categories].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="pb-4">
      {/* Top */}
      <div className="bg-navy px-4 pb-6 pt-[calc(env(safe-area-inset-top)+18px)] text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12.5px] text-white/60">สวัสดี, {driverProfile.name.split(" ")[0]}</p>
            <h1 className="mt-0.5 text-[19px] font-bold">Cars Doctor</h1>
          </div>
          <button aria-label="เมนู" onClick={openProfileMenu} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
            <IconMenu />
          </button>
        </div>

        <Link
          href="/my-car"
          className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 active:bg-white/15"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[22px]">🚗</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="text-[11.5px] text-white/60">
              {vehicle.trim} · {vehicle.year} · {vehicle.plate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-bold">{formatNumber(vehicle.mileage)}</p>
            <p className="text-[10px] text-white/50">กม.</p>
          </div>
        </Link>
      </div>

      <div className="space-y-5 px-4 pt-4">
        {/* Car Health */}
        <Card>
          <Link href="/doctor/health" className="flex items-center gap-4">
            <HealthRing score={health.overall} />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-ink">คะแนนสุขภาพรถ</p>
              <p className="mt-0.5 text-[12px] text-ink/50">สถานะโดยรวม: {health.tierLabel}</p>
              {worstCategory && (
                <div className="mt-2">
                  <StatusChip
                    status={worstCategory.status}
                    label={worstCategory.status === "healthy" ? "ทุกระบบอยู่ในเกณฑ์ดี" : `${worstCategory.label} ต้องดูแล`}
                  />
                </div>
              )}
            </div>
            <span className="text-ink/25">›</span>
          </Link>
        </Card>

        {/* Upcoming */}
        <div>
          <SectionHeader title="สิ่งที่ควรทำเร็วๆ นี้" href="/reminders" />
          <Card className="divide-y divide-border">
            {upcoming.map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg text-[16px]">{r.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{r.title}</p>
                  <p className="text-[11.5px] text-ink/45">
                    {r.type === "mileage" && r.dueMileage
                      ? `เหลืออีก ${formatNumber(r.dueMileage - vehicle.mileage)} กม.`
                      : r.dueDate
                      ? statusFromDays(daysUntilSafe(r.dueDate)) === "urgent" && daysUntilSafe(r.dueDate) < 0
                        ? `เกินกำหนด ${Math.abs(daysUntilSafe(r.dueDate))} วัน`
                        : `เหลืออีก ${daysUntilSafe(r.dueDate)} วัน`
                      : ""}
                  </p>
                </div>
                <StatusChip status={r.status} />
              </div>
            ))}
          </Card>
        </div>

        {/* Legal quick strip */}
        <div>
          <SectionHeader title="เอกสาร & กฎหมาย" href="/legal-calendar" />
          <Card>
            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniStat label="ประกันภัย" value="42 วัน" status="dueSoon" />
              <MiniStat label="พ.ร.บ." value="24 วัน" status="urgent" />
              <MiniStat label="ใบขับขี่" value="35 วัน" status="dueSoon" />
            </div>
          </Card>
        </div>

        {/* Expense + Fuel */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/expenses" className="block">
            <Card className="h-full">
              <p className="text-[11.5px] font-semibold text-ink/45">ค่าใช้จ่ายเดือนนี้</p>
              <p className="mt-1 text-[18px] font-extrabold text-ink">{formatBaht(monthTotal)}</p>
              <p className="mt-0.5 text-[11px] text-status-green">ปกติ ใกล้เคียงเดือนก่อน</p>
            </Card>
          </Link>
          <Link href="/fuel" className="block">
            <Card className="h-full">
              <p className="text-[11.5px] font-semibold text-ink/45">อัตราสิ้นเปลือง</p>
              <p className="mt-1 text-[18px] font-extrabold text-ink">19.2 <span className="text-[12px] font-semibold text-ink/40">กม./ลิตร</span></p>
              <p className="mt-0.5 text-[11px] text-ink/45">เฉลี่ย 30 วันล่าสุด</p>
            </Card>
          </Link>
        </div>

        {/* Useful today */}
        <div>
          <SectionHeader title="วันนี้มีอะไรน่ารู้" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {usefulTodayCards.map((c) => (
              <div key={c.id} className="w-[240px] shrink-0 rounded-2xl bg-white p-3.5 shadow-card">
                <p className="text-[20px]">{c.icon}</p>
                <p className="mt-1.5 text-[12.5px] font-bold leading-snug text-ink">{c.title}</p>
                <p className="mt-0.5 text-[11px] text-ink/45">{c.detail}</p>
              </div>
            ))}
            <Link href="/feature/fuel-price-today" className="block w-[180px] shrink-0 rounded-2xl bg-navy p-3.5 text-white shadow-card">
              <p className="text-[11px] text-white/60">ราคาน้ำมันวันนี้</p>
              <p className="mt-1 text-[16px] font-extrabold">฿{fuelPriceToday.gasohol95}</p>
              <p className="text-[10.5px] text-white/60">Gasohol 95</p>
            </Link>
          </div>
        </div>

        {/* AI Quick Check */}
        <Link href="/doctor/ai" className="flex items-center gap-3 rounded-2xl bg-navy p-4 text-white active:opacity-90">
          <span className="text-[24px]">🤖</span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold">ถามหมอรถ AI</p>
            <p className="text-[11.5px] text-white/60">มีอาการผิดปกติ? ถามได้ทันที ฟรี</p>
          </div>
          <span className="text-white/50">›</span>
        </Link>
      </div>
    </div>
  );
}

function daysUntilSafe(iso: string) {
  const diff = new Date(iso).getTime() - TODAY.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function MiniStat({ label, value, status }: { label: string; value: string; status: "healthy" | "warning" | "dueSoon" | "urgent" }) {
  return (
    <div>
      <p className={`text-[13px] font-extrabold ${status === "urgent" ? "text-status-red" : status === "dueSoon" ? "text-status-orange" : "text-ink"}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[10.5px] text-ink/45">{label}</p>
    </div>
  );
}
