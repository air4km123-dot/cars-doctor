"use client";

import { useCarData } from "@/lib/store";
import { formatNumber, formatThaiDate } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";

export default function MaintenancePage() {
  const { trackers, maintenanceEvents } = useCarData();

  return (
    <div>
      <Header title="ประวัติการบำรุงรักษา" />
      <div className="space-y-5 px-4 pt-4">
        <div>
          <SectionHeader title="หมวดหมู่" />
          <Card className="divide-y divide-border">
            {trackers.map((t) => (
              <Row
                key={t.key}
                icon={t.icon}
                title={t.label}
                subtitle={`ล่าสุด ${formatThaiDate(t.lastDate)} · รอบถัดไป ${formatNumber(t.nextDueMileage)} กม.`}
                right={<StatusChip status={t.status} />}
                href={`/tracker/${t.key}`}
              />
            ))}
          </Card>
        </div>

        <div>
          <SectionHeader title="ประวัติทั้งหมด" />
          <Card className="divide-y divide-border">
            {maintenanceEvents.map((e) => (
              <Row
                key={e.id}
                title={e.title}
                subtitle={`${formatThaiDate(e.date)} · ${formatNumber(e.mileage)} กม.${e.location ? ` · ${e.location}` : ""}`}
                right={<span className="text-[12.5px] font-bold text-ink/70">฿{formatNumber(e.cost)}</span>}
              />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
