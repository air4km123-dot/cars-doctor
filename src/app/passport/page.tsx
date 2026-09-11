"use client";

import { useMemo, useState } from "react";
import { useCarData } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { formatThaiDate } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { PrimaryButton, SecondaryButton } from "@/components/FormField";
import { Row } from "@/components/ui";

const TYPE_COLOR: Record<string, string> = {
  purchase: "bg-navy",
  legal: "bg-[#3E7CB1]",
  accident: "bg-status-red",
  claim: "bg-status-green",
  maintenance: "bg-status-orange",
};

// Deterministic pseudo-random fill so the mock QR looks the same every render
// for a given plate, without pulling in a real QR library.
function seededGrid(seed: string, size: number): boolean[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    cells.push((h >>> 24) % 3 !== 0);
  }
  return cells;
}

function MockQR({ seed }: { seed: string }) {
  const size = 11;
  const cells = useMemo(() => seededGrid(seed, size), [seed]);
  const isFinder = (r: number, c: number) => (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
  return (
    <div className="mx-auto grid w-fit gap-[2px] rounded-lg bg-white p-3" style={{ gridTemplateColumns: `repeat(${size}, 8px)` }}>
      {Array.from({ length: size * size }).map((_, i) => {
        const r = Math.floor(i / size);
        const c = i % size;
        const dark = isFinder(r, c) ? true : cells[i];
        return <div key={i} className={`h-2 w-2 ${dark ? "bg-ink" : "bg-white"}`} />;
      })}
    </div>
  );
}

export default function PassportPage() {
  const { passportEvents, vehicle, completenessIndex } = useCarData();
  const { showToast } = useUI();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const lastUpdated = passportEvents[0]?.date;
  const shareLink = `https://carsdoctor.app/passport/${vehicle.plate.replace(/\s+/g, "")}`;

  function copyLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareLink).catch(() => {});
    }
    showToast("คัดลอกลิงก์แล้ว");
  }

  return (
    <div>
      <Header title="พาสปอร์ตรถ" />
      <div className="space-y-4 px-4 pt-4">
        {/* Hero: Certified digital passport showcase */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-light p-5 text-white shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] font-bold">
                {vehicle.brand} {vehicle.model}
              </p>
              <p className="text-[11.5px] text-white/60">
                {vehicle.trim} · {vehicle.plate}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#F0C419] bg-[#F0C419]/15 text-[18px] text-[#F0C419]">✓</div>
              <p className="mt-1 text-center text-[8.5px] font-bold leading-tight text-[#F0C419]">
                CERTIFIED
                <br />
                by Cars Doctor
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white/10 p-3.5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-white/60">Car Completeness Index</p>
                <p className="text-[26px] font-extrabold leading-none">{completenessIndex}%</p>
              </div>
              <p className="max-w-[140px] text-right text-[10.5px] leading-snug text-white/60">บันทึกครบถ้วน ช่วยเพิ่มความน่าเชื่อถือและมูลค่าขายต่อ</p>
            </div>
            <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/15">
              <div className="h-1.5 rounded-full bg-[#F0C419] transition-all" style={{ width: `${completenessIndex}%` }} />
            </div>
          </div>

          {lastUpdated && <p className="mt-3 text-[10.5px] text-white/50">อัปเดตล่าสุด: {formatThaiDate(lastUpdated)}</p>}

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button onClick={() => setShareOpen(true)} className="rounded-xl bg-white py-2.5 text-[12.5px] font-bold text-navy active:opacity-80">
              🔗 แชร์พาสปอร์ต
            </button>
            <button onClick={() => setExportOpen(true)} className="rounded-xl border border-white/30 py-2.5 text-[12.5px] font-bold text-white active:bg-white/10">
              📄 Export PDF Report
            </button>
          </div>
        </div>

        <p className="px-1 text-[11.5px] leading-relaxed text-ink/50">
          ประวัติเป็นของ &ldquo;ตัวรถ&rdquo; ไม่ใช่ของเจ้าของคนใดคนหนึ่ง — เมื่อโอนรถ ประวัตินี้จะส่งต่อให้เจ้าของใหม่
        </p>

        <div>
          <p className="mb-2 px-1 text-[14px] font-bold text-ink">ไทม์ไลน์ประวัติรถ</p>
          <div className="relative pl-5">
            <div className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-border" />
            <div className="space-y-4">
              {passportEvents.map((ev) => (
                <div key={ev.id} className="relative">
                  <span className={`absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-white ${TYPE_COLOR[ev.type] ?? "bg-ink/30"}`} />
                  <button
                    onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
                    className="w-full rounded-2xl bg-white p-3.5 text-left shadow-card active:bg-bg/40"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-[18px]">{ev.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11.5px] text-ink/40">{formatThaiDate(ev.date)}</p>
                        <p className="text-[13.5px] font-bold text-ink">{ev.title}</p>
                        {expanded === ev.id && <p className="mt-1.5 text-[12.5px] text-ink/60">{ev.detail}</p>}
                        {ev.source && expanded === ev.id && <p className="mt-1 text-[10.5px] font-semibold text-navy">เพิ่มโดย {ev.source}</p>}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)}>
        <h2 className="mb-1 text-[16px] font-bold text-ink">แชร์พาสปอร์ตรถ</h2>
        <p className="mb-4 text-[12px] text-ink/50">ให้ผู้ซื้อหรือเต็นท์รถสแกน QR หรือกดลิงก์เพื่อดูประวัติรถฉบับเต็ม</p>
        <MockQR seed={vehicle.plate} />
        <p className="mt-2 text-center text-[10.5px] text-ink/40">ตัวอย่าง QR Code (Preview เท่านั้น)</p>
        <div className="mt-4 rounded-xl bg-bg px-3.5 py-2.5">
          <p className="truncate text-[12px] font-semibold text-ink/70">{shareLink}</p>
        </div>
        <div className="mt-3 space-y-2">
          <PrimaryButton onClick={copyLink}>คัดลอกลิงก์</PrimaryButton>
          <SecondaryButton onClick={() => setShareOpen(false)}>ปิด</SecondaryButton>
        </div>
      </Modal>

      <Modal open={exportOpen} onClose={() => setExportOpen(false)}>
        <h2 className="mb-3 text-[16px] font-bold text-ink">Export PDF Report</h2>
        <div className="mb-4 space-y-1.5">
          {["สรุปคะแนนสุขภาพรถ", "ประวัติซ่อมบำรุงทั้งหมด", "ประวัติอุบัติเหตุ/เคลม", "สถานะเอกสารและกฎหมาย", "Car Completeness Index"].map((s) => (
            <Row key={s} icon="📄" title={s} />
          ))}
        </div>
        <div className="space-y-2">
          <PrimaryButton onClick={() => showToast("นี่คือ Prototype — ยังไม่สร้างไฟล์ PDF จริง")}>ดาวน์โหลด PDF (ตัวอย่าง)</PrimaryButton>
          <SecondaryButton onClick={() => setExportOpen(false)}>ปิด</SecondaryButton>
        </div>
      </Modal>
    </div>
  );
}
