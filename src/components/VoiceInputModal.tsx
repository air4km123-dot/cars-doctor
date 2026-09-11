"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/lib/uiStore";
import { useCarData, type QuickAddResultStep } from "@/lib/store";
import { Modal } from "./Modal";
import { PrimaryButton, SecondaryButton } from "./FormField";

type Stage = "idle" | "listening" | "parsed" | "result";

const TRANSCRIPT = "วันนี้เปลี่ยนแบตเตอรี่ ราคา 2,800 บาท เลขไมล์ 88,450";

export function VoiceInputModal() {
  const { voiceOpen, closeVoice } = useUI();
  const { vehicle, applyQuickAdd } = useCarData();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [steps, setSteps] = useState<QuickAddResultStep[]>([]);

  useEffect(() => {
    if (!voiceOpen) setStage("idle");
  }, [voiceOpen]);

  useEffect(() => {
    if (stage !== "listening") return;
    const t = setTimeout(() => setStage("parsed"), 1900);
    return () => clearTimeout(t);
  }, [stage]);

  function confirm() {
    const result = applyQuickAdd({
      trackerKey: "battery",
      category: "battery",
      title: "เปลี่ยนแบตเตอรี่",
      cost: 2800,
      mileage: 88450,
      location: undefined,
    });
    setSteps(result);
    setStage("result");
  }

  function close() {
    setStage("idle");
    closeVoice();
  }

  return (
    <Modal open={voiceOpen} onClose={close}>
      {stage === "idle" && (
        <div className="flex flex-col items-center py-4 text-center">
          <h2 className="mb-1 text-[17px] font-bold text-ink">Voice Input</h2>
          <p className="mb-6 text-[12.5px] text-ink/50">พูดสรุปสิ่งที่ทำกับรถวันนี้ ระบบจะแปลงเป็นข้อมูลให้อัตโนมัติ</p>
          <button
            onClick={() => setStage("listening")}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-navy text-[36px] text-white shadow-fab active:scale-95 transition-transform"
          >
            🎤
          </button>
          <p className="mt-4 text-[12px] text-ink/40">แตะเพื่อเริ่มพูด (ตัวอย่างสาธิต)</p>
          <div className="mt-6 w-full rounded-2xl bg-bg px-4 py-3 text-left text-[12px] text-ink/50">
            ลองพูดว่า:
            <br />“{TRANSCRIPT}”
          </div>
        </div>
      )}

      {stage === "listening" && (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-navy text-[36px] text-white">
            <span className="animate-pulse-ring absolute inset-0 rounded-full" />
            🎤
          </div>
          <p className="text-[13.5px] font-semibold text-ink">กำลังฟัง...</p>
          <div className="mt-4 flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1 animate-pulse rounded-full bg-navy/60"
                style={{ height: `${12 + (i % 3) * 8}px`, animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {stage === "parsed" && (
        <div>
          <h2 className="mb-1 text-[16px] font-bold text-ink">ผลลัพธ์จากเสียงพูด</h2>
          <p className="mb-4 rounded-xl bg-bg px-3.5 py-2.5 text-[12.5px] italic text-ink/60">“{TRANSCRIPT}”</p>

          <div className="mb-5 space-y-2.5 rounded-2xl border border-border p-4">
            <Row label="ประเภท" value="Maintenance" />
            <Row label="รายการ" value="เปลี่ยนแบตเตอรี่" />
            <Row label="ราคา" value="2,800 บาท" />
            <Row label="เลขไมล์" value={`${(88450).toLocaleString()} กม.`} />
            <Row label="วันที่" value="วันนี้" />
          </div>

          <div className="space-y-2">
            <PrimaryButton onClick={confirm}>ยืนยัน</PrimaryButton>
            <SecondaryButton onClick={() => setStage("idle")}>ลองใหม่</SecondaryButton>
          </div>
        </div>
      )}

      {stage === "result" && (
        <div className="animate-fade-in">
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="animate-check-pop mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-status-green/10 text-[32px] text-status-green">
              ✓
            </div>
            <h2 className="text-[17px] font-bold text-ink">บันทึกสำเร็จ</h2>
            <p className="text-[12.5px] text-ink/50">เปลี่ยนแบตเตอรี่ · {vehicle.plate}</p>
          </div>
          <div className="mb-5 space-y-2.5">
            {steps.map((s, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 90}ms` }}
                className="animate-slide-up flex items-start gap-2.5 rounded-2xl bg-status-green/5 px-3.5 py-2.5"
              >
                <span className="mt-0.5 text-status-green">✓</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-ink">{s.label}</p>
                  <p className="text-[11.5px] text-ink/50">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <PrimaryButton
              onClick={() => {
                close();
                router.push("/passport");
              }}
            >
              ดูใน Vehicle Passport
            </PrimaryButton>
            <SecondaryButton onClick={close}>เสร็จสิ้น</SecondaryButton>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-ink/50">{label}</span>
      <span className="text-[13.5px] font-bold text-ink">{value}</span>
    </div>
  );
}
