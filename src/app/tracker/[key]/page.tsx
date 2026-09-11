"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useCarData } from "@/lib/store";
import { formatNumber, formatThaiDate } from "@/lib/utils";
import type { TrackerKey } from "@/lib/types";
import { Header } from "@/components/Header";
import { Card, Row } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import { PremiumBanner } from "@/components/PremiumBanner";

const VALID_KEYS: TrackerKey[] = ["oil", "battery", "tire", "brake", "aircon", "injector"];

export default function TrackerPage({ params }: { params: { key: string } }) {
  const key = params.key as TrackerKey;
  if (!VALID_KEYS.includes(key)) return notFound();

  const { vehicle, trackers, maintenanceEvents } = useCarData();
  const tracker = trackers.find((t) => t.key === key)!;
  const history = maintenanceEvents.filter((e) => e.category === key);
  const remainingKm = tracker.nextDueMileage - vehicle.mileage;

  return (
    <div>
      <Header title={`${tracker.label} (${tracker.labelEn})`} />
      <div className="space-y-4 px-4 pt-4">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[28px]">{tracker.icon}</span>
            <StatusChip status={tracker.status} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <MiniStat label="เปลี่ยน/ตรวจล่าสุด" value={formatThaiDate(tracker.lastDate)} />
            <MiniStat label="เลขไมล์ล่าสุด" value={`${formatNumber(tracker.lastMileage)} กม.`} />
            <MiniStat label="รอบถัดไป" value={`${formatNumber(tracker.nextDueMileage)} กม.`} />
            <MiniStat
              label="เหลืออีก"
              value={remainingKm >= 0 ? `${formatNumber(remainingKm)} กม.` : `เกิน ${formatNumber(Math.abs(remainingKm))} กม.`}
            />
          </div>
        </Card>

        {key === "oil" && (
          <PremiumBanner description="Predictive Oil Change: คาดการณ์รอบเปลี่ยนถ่ายจากพฤติกรรมการขับขี่จริงของคุณ แม่นยำกว่าค่ามาตรฐานโรงงาน" />
        )}

        <div>
          <p className="mb-2 px-1 text-[14.5px] font-bold text-ink">ประวัติ {tracker.label}</p>
          <Card className="divide-y divide-border">
            {history.length === 0 && <p className="py-2 text-[12.5px] text-ink/45">ยังไม่มีประวัติ</p>}
            {history.map((e) => (
              <Row key={e.id} title={e.title} subtitle={`${formatThaiDate(e.date)} · ${formatNumber(e.mileage)} กม. · ฿${formatNumber(e.cost)}`} />
            ))}
          </Card>
        </div>

        <Link href="/reminders" className="block rounded-2xl border border-border bg-white px-4 py-3 text-center text-[13px] font-bold text-navy">
          ดูการแจ้งเตือนทั้งหมด
        </Link>
        <Link href="/marketplace/providers" className="block rounded-2xl bg-navy px-4 py-3 text-center text-[13px] font-bold text-white">
          หาผู้ให้บริการใกล้ฉัน
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg px-3.5 py-3">
      <p className="text-[11px] font-semibold text-ink/45">{label}</p>
      <p className="mt-0.5 text-[13.5px] font-bold text-ink">{value}</p>
    </div>
  );
}
