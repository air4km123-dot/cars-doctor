"use client";

import { useMemo, useState } from "react";
import { useCarData } from "@/lib/store";
import { formatNumber, formatThaiDate } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Card, PillTab } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import { FormField, PrimaryButton, SecondaryButton } from "@/components/FormField";
import { Modal } from "@/components/Modal";

type Filter = "all" | "date" | "mileage";

const STATUS_RANK = { urgent: 0, dueSoon: 1, warning: 2, healthy: 3 } as const;

export default function RemindersPage() {
  const { vehicle, reminders, addReminderCustom } = useCarData();
  const [filter, setFilter] = useState<Filter>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"date" | "mileage">("date");
  const [dueDate, setDueDate] = useState("2026-12-01");
  const [dueMileage, setDueMileage] = useState(String(vehicle.mileage + 5000));

  function saveReminder() {
    addReminderCustom(title || "แจ้งเตือนที่ตั้งเอง", mode === "date" ? dueDate : undefined, mode === "mileage" ? Number(dueMileage) : undefined);
    setTitle("");
    setAddOpen(false);
  }

  const list = useMemo(() => {
    const filtered = reminders.filter((r) => (filter === "all" ? true : r.type === filter || (filter === "date" && r.type === "recurring")));
    return [...filtered].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);
  }, [reminders, filter]);

  const dateGroups = useMemo(() => {
    const withDates = reminders.filter((r) => r.dueDate);
    const groups: Record<string, typeof withDates> = {};
    withDates.forEach((r) => {
      const d = new Date(r.dueDate!);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      groups[key] = groups[key] ? [...groups[key], r] : [r];
    });
    return Object.entries(groups)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(0, 3);
  }, [reminders]);

  const THAI_MONTHS_FULL = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  return (
    <div>
      <Header title="การแจ้งเตือน" />
      <div className="space-y-4 px-4 pt-4">
        <PrimaryButton onClick={() => setAddOpen(true)}>🔔 ตั้งการแจ้งเตือนใหม่</PrimaryButton>

        <div className="flex gap-2">
          <PillTab active={filter === "all"} onClick={() => setFilter("all")}>ทั้งหมด</PillTab>
          <PillTab active={filter === "date"} onClick={() => setFilter("date")}>ตามวันที่</PillTab>
          <PillTab active={filter === "mileage"} onClick={() => setFilter("mileage")}>ตามเลขไมล์</PillTab>
        </div>

        <div>
          <p className="mb-2 px-1 text-[13px] font-bold text-ink/60">มุมมองปฏิทิน (3 เดือนถัดไป)</p>
          <div className="grid grid-cols-3 gap-2">
            {dateGroups.map(([key, items]) => {
              const [, month] = key.split("-").map(Number);
              return (
                <Card key={key} className="text-center">
                  <p className="text-[11px] font-semibold text-ink/45">{THAI_MONTHS_FULL[month]}</p>
                  <p className="mt-1 text-[16px] font-extrabold text-ink">{items.length}</p>
                  <p className="text-[10px] text-ink/40">รายการ</p>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 px-1 text-[13px] font-bold text-ink/60">รายการที่กำลังจะถึง</p>
          <Card className="divide-y divide-border">
            {list.map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg text-[18px]">{r.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{r.title}</p>
                  <p className="text-[11.5px] text-ink/45">
                    {r.type === "mileage" && r.dueMileage
                      ? `ครบกำหนดที่ ${formatNumber(r.dueMileage)} กม. (เหลือ ${formatNumber(r.dueMileage - vehicle.mileage)} กม.)`
                      : r.dueDate
                      ? `${formatThaiDate(r.dueDate)}`
                      : "แจ้งเตือนประจำ"}
                  </p>
                </div>
                <StatusChip status={r.status} />
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <h2 className="mb-3 text-[16px] font-bold text-ink">ตั้งการแจ้งเตือนใหม่</h2>
        <div className="space-y-3">
          <FormField label="ชื่อรายการแจ้งเตือน" value={title} onChange={setTitle} placeholder="เช่น ต่อประกันภัยรถ" />
          <div className="flex gap-2">
            <button onClick={() => setMode("date")} className={`flex-1 rounded-xl py-2 text-[12.5px] font-semibold ${mode === "date" ? "bg-navy text-white" : "bg-bg text-ink/60"}`}>
              แบบวันที่
            </button>
            <button onClick={() => setMode("mileage")} className={`flex-1 rounded-xl py-2 text-[12.5px] font-semibold ${mode === "mileage" ? "bg-navy text-white" : "bg-bg text-ink/60"}`}>
              แบบเลขไมล์
            </button>
          </div>
          {mode === "date" ? (
            <FormField label="วันที่ครบกำหนด" type="text" value={dueDate} onChange={setDueDate} placeholder="YYYY-MM-DD" />
          ) : (
            <FormField label="เลขไมล์ที่ครบกำหนด" suffix="กม." type="number" value={dueMileage} onChange={setDueMileage} />
          )}
          <PrimaryButton onClick={saveReminder}>บันทึก</PrimaryButton>
          <SecondaryButton onClick={() => setAddOpen(false)}>ยกเลิก</SecondaryButton>
        </div>
      </Modal>
    </div>
  );
}
