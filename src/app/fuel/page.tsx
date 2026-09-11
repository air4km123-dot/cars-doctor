"use client";

import { useCarData } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { formatNumber, formatThaiDate } from "@/lib/utils";
import { initialFuelLogs } from "@/lib/mockData";
import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";
import { PrimaryButton } from "@/components/FormField";

export default function FuelPage() {
  const { expenses } = useCarData();
  const { openQuickAdd } = useUI();

  const logs = initialFuelLogs;
  const economies = logs.slice(1).map((log, i) => {
    const prev = logs[i];
    return (log.mileage - prev.mileage) / log.liters;
  });
  const avgEconomy = economies.length ? economies.reduce((a, b) => a + b, 0) / economies.length : 0;
  const totalDistance = logs.length > 1 ? logs[logs.length - 1].mileage - logs[0].mileage : 0;
  const fuelExpenseTotal = expenses.filter((e) => e.category === "fuel").reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <Header title="น้ำมันเชื้อเพลิง" />
      <div className="space-y-4 px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-[11px] font-semibold text-ink/45">อัตราสิ้นเปลืองเฉลี่ย</p>
            <p className="mt-1 text-[18px] font-extrabold text-ink">{avgEconomy.toFixed(1)} <span className="text-[11px] font-semibold text-ink/40">กม./ล.</span></p>
          </Card>
          <Card>
            <p className="text-[11px] font-semibold text-ink/45">ค่าน้ำมันสะสม</p>
            <p className="mt-1 text-[18px] font-extrabold text-ink">฿{formatNumber(fuelExpenseTotal)}</p>
          </Card>
        </div>

        <PrimaryButton onClick={openQuickAdd}>⛽ เติมน้ำมันวันนี้</PrimaryButton>

        <div>
          <SectionHeader title="ประวัติการเติมน้ำมัน" />
          <Card className="divide-y divide-border">
            {[...logs].reverse().map((f) => (
              <Row
                key={f.id}
                icon="⛽"
                title={`${f.fuelType} ${f.liters} ลิตร`}
                subtitle={`${formatThaiDate(f.date)} · ${formatNumber(f.mileage)} กม.`}
                right={<span className="text-[12.5px] font-bold text-ink/70">฿{formatNumber(f.totalCost)}</span>}
              />
            ))}
          </Card>
        </div>

        <p className="text-[11px] text-ink/40">ระยะทางสะสมจากบันทึก: {formatNumber(totalDistance)} กม.</p>
      </div>
    </div>
  );
}
