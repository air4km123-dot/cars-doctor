"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarData, type QuickAddResultStep } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { fuelPriceToday } from "@/lib/mockData";
import { FormField, PrimaryButton, SecondaryButton } from "./FormField";
import type { TrackerKey } from "@/lib/types";

type View = "menu" | "service-pick" | "service-form" | "fuel" | "result";

const SERVICE_CATEGORIES: { key: TrackerKey | "general"; icon: string; label: string; title: string; cost: number }[] = [
  { key: "oil", icon: "🛢️", label: "น้ำมันเครื่อง", title: "เปลี่ยนน้ำมันเครื่อง", cost: 2450 },
  { key: "battery", icon: "🔋", label: "แบตเตอรี่", title: "เปลี่ยนแบตเตอรี่", cost: 2800 },
  { key: "tire", icon: "🛞", label: "ยาง", title: "เปลี่ยนยางใหม่ 4 เส้น", cost: 16000 },
  { key: "brake", icon: "🛑", label: "เบรก", title: "เปลี่ยนผ้าเบรก", cost: 1800 },
  { key: "aircon", icon: "❄️", label: "แอร์", title: "เปลี่ยนไส้กรองแอร์", cost: 450 },
  { key: "injector", icon: "💉", label: "หัวฉีด", title: "ล้างหัวฉีด", cost: 1500 },
  { key: "general", icon: "🔧", label: "งานอื่นๆ / เช็กระยะ", title: "", cost: 0 },
];

const MAIN_ACTIONS: { id: "fuel" | "service-pick" | "ocr"; icon: string; title: string; subtitle: string }[] = [
  { id: "fuel", icon: "⛽", title: "เติมน้ำมัน", subtitle: "บันทึกการเติมน้ำมันวันนี้" },
  { id: "service-pick", icon: "🔧", title: "บันทึกซ่อม / เช็กระยะ", subtitle: "เปลี่ยนอะไหล่ หรืองานซ่อมทั่วไป" },
  { id: "ocr", icon: "📷", title: "สแกนใบเสร็จด้วย AI", subtitle: "ถ่ายรูปแล้วให้ระบบอ่านข้อมูลให้อัตโนมัติ" },
];

function ResultSteps({
  title,
  steps,
  onDone,
  onViewPassport,
}: {
  title: string;
  steps: QuickAddResultStep[];
  onDone: () => void;
  onViewPassport: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-col items-center text-center">
        <div className="animate-check-pop mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-status-green/10 text-[32px] text-status-green">✓</div>
        <h2 className="text-[17px] font-bold text-ink">บันทึกสำเร็จ</h2>
        <p className="text-[12.5px] text-ink/50">{title}</p>
      </div>
      <div className="mb-5 space-y-2.5">
        {steps.map((s, i) => (
          <div key={i} style={{ animationDelay: `${i * 90}ms` }} className="animate-slide-up flex items-start gap-2.5 rounded-2xl bg-status-green/5 px-3.5 py-2.5">
            <span className="mt-0.5 text-status-green">✓</span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-ink">{s.label}</p>
              <p className="text-[11.5px] text-ink/50">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <PrimaryButton onClick={onViewPassport}>ดูใน Vehicle Passport</PrimaryButton>
        <SecondaryButton onClick={onDone}>เสร็จสิ้น</SecondaryButton>
      </div>
    </div>
  );
}

export function QuickAddSheet() {
  const { quickAddOpen, closeQuickAdd, openVoice, openOcr } = useUI();
  const { vehicle, applyQuickAdd, addFuelExpense } = useCarData();
  const router = useRouter();

  const [view, setView] = useState<View>("menu");
  const [selectedCategory, setSelectedCategory] = useState<(typeof SERVICE_CATEGORIES)[number] | null>(null);
  const [resultSteps, setResultSteps] = useState<QuickAddResultStep[]>([]);
  const [resultTitle, setResultTitle] = useState("");

  const [serviceTitle, setServiceTitle] = useState("");
  const [cost, setCost] = useState("");
  const [mileage, setMileage] = useState(String(vehicle.mileage));
  const [location, setLocation] = useState("");
  const [liters, setLiters] = useState("30");
  const [pricePerLiter, setPricePerLiter] = useState(String(fuelPriceToday.gasohol95));

  function resetAndClose() {
    setView("menu");
    setSelectedCategory(null);
    setServiceTitle("");
    setCost("");
    setLocation("");
    closeQuickAdd();
  }

  function pickCategory(c: (typeof SERVICE_CATEGORIES)[number]) {
    setSelectedCategory(c);
    setServiceTitle(c.title);
    setCost(c.cost ? String(c.cost) : "");
    setMileage(String(vehicle.mileage));
    setLocation("");
    setView("service-form");
  }

  function confirmService() {
    if (!selectedCategory) return;
    const title = selectedCategory.key === "general" ? serviceTitle || "งานซ่อม / เช็กระยะ" : selectedCategory.title;
    const steps = applyQuickAdd({
      trackerKey: selectedCategory.key === "general" ? undefined : selectedCategory.key,
      category: selectedCategory.key === "general" ? "general" : selectedCategory.key,
      title,
      cost: Number(cost) || 0,
      mileage: Number(mileage) || vehicle.mileage,
      location: location || undefined,
    });
    setResultTitle(title);
    setResultSteps(steps);
    setView("result");
  }

  function confirmFuel() {
    addFuelExpense(Number(liters) || 0, Number(pricePerLiter) || 0, Number(mileage) || vehicle.mileage);
    setResultTitle("เติมน้ำมัน");
    setResultSteps([
      { label: "Fuel Log Updated", detail: `บันทึกเติมน้ำมัน ${liters} ลิตร` },
      { label: "Expense Updated", detail: `เพิ่มค่าใช้จ่าย +${Math.round(Number(liters) * Number(pricePerLiter)).toLocaleString()} บาท` },
      { label: "Fuel Dashboard Updated", detail: "อัปเดตอัตราสิ้นเปลืองเฉลี่ยแล้ว" },
    ]);
    setView("result");
  }

  if (!quickAddOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="animate-fade-in absolute inset-0 bg-black/50" onClick={resetAndClose} />
      <div className="animate-sheet-up no-scrollbar relative max-h-[85%] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-sheet">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />

        {view === "menu" && (
          <>
            <h2 className="mb-0.5 text-[18px] font-bold text-ink">วันนี้รถมีอะไรเพิ่มบ้าง?</h2>
            <p className="mb-4 text-[12.5px] text-ink/50">เลือกรายการเพื่อบันทึก ระบบจะอัปเดตให้ทุกส่วนอัตโนมัติ</p>
            <div className="space-y-3">
              {MAIN_ACTIONS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => (a.id === "ocr" ? openOcr() : setView(a.id))}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-border bg-bg px-4 py-4 text-left transition-transform active:scale-[0.98]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[22px] shadow-sm">{a.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-bold text-ink">{a.title}</p>
                    <p className="text-[11.5px] text-ink/50">{a.subtitle}</p>
                  </div>
                  <span className="text-ink/25">›</span>
                </button>
              ))}
            </div>
            <button
              onClick={openVoice}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-navy/20 py-2.5 text-[12.5px] font-semibold text-navy active:bg-bg"
            >
              🎤 หรือพูดบันทึกด้วยเสียง
            </button>
          </>
        )}

        {view === "service-pick" && (
          <>
            <SheetTitle title="บันทึกซ่อม / เช็กระยะ — ประเภทงาน" onBack={() => setView("menu")} />
            <div className="grid grid-cols-2 gap-2.5">
              {SERVICE_CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => pickCategory(c)}
                  className="flex flex-col items-start gap-1 rounded-2xl border border-border bg-bg px-3.5 py-3 text-left transition-transform active:scale-[0.98]"
                >
                  <span className="text-[20px]">{c.icon}</span>
                  <span className="text-[12.5px] font-semibold text-ink">{c.label}</span>
                  {c.cost > 0 && <span className="text-[10.5px] text-ink/40">฿{c.cost.toLocaleString()}~</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {view === "service-form" && selectedCategory && (
          <>
            <SheetTitle title={selectedCategory.key === "general" ? "งานอื่นๆ / เช็กระยะ" : selectedCategory.title} onBack={() => setView("service-pick")} />
            <div className="space-y-3">
              {selectedCategory.key === "general" && (
                <FormField label="รายการ" value={serviceTitle} onChange={setServiceTitle} placeholder="เช่น เช็คระยะ 90,000 km" />
              )}
              <FormField label="ราคา" suffix="บาท" type="number" value={cost} onChange={setCost} />
              <FormField label="เลขไมล์ขณะนี้" suffix="กม." type="number" value={mileage} onChange={setMileage} />
              <FormField label="สถานที่ (ถ้ามี)" value={location} onChange={setLocation} placeholder="เช่น Toyota Sure ลาดพร้าว" />
              <p className="rounded-xl bg-bg px-3.5 py-2.5 text-[12px] text-ink/50">
                วันที่บันทึก: วันนี้ · ระบบจะอัปเดต Maintenance / Expense / Tracker / Health / Reminder / Passport ให้อัตโนมัติ
              </p>
              <PrimaryButton onClick={confirmService} disabled={selectedCategory.key === "general" && !serviceTitle}>
                ยืนยัน
              </PrimaryButton>
            </div>
          </>
        )}

        {view === "fuel" && (
          <>
            <SheetTitle title="เติมน้ำมัน" onBack={() => setView("menu")} />
            <div className="space-y-3">
              <FormField label="ปริมาณ" suffix="ลิตร" type="number" value={liters} onChange={setLiters} />
              <FormField label="ราคาต่อลิตร" suffix="บาท" type="number" value={pricePerLiter} onChange={setPricePerLiter} />
              <FormField label="เลขไมล์ขณะนี้" suffix="กม." type="number" value={mileage} onChange={setMileage} />
              <p className="rounded-xl bg-bg px-3.5 py-2.5 text-[12px] text-ink/50">
                รวม {(Number(liters) * Number(pricePerLiter) || 0).toLocaleString()} บาท
              </p>
              <PrimaryButton onClick={confirmFuel}>ยืนยัน</PrimaryButton>
            </div>
          </>
        )}

        {view === "result" && (
          <ResultSteps
            title={resultTitle}
            steps={resultSteps}
            onDone={resetAndClose}
            onViewPassport={() => {
              resetAndClose();
              router.push("/passport");
            }}
          />
        )}
      </div>
    </div>
  );
}

function SheetTitle({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full bg-bg text-[15px]">
        ←
      </button>
      <h2 className="text-[16px] font-bold text-ink">{title}</h2>
    </div>
  );
}
