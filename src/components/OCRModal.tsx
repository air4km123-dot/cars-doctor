"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/lib/uiStore";
import { useCarData } from "@/lib/store";
import type { DocumentItem } from "@/lib/types";
import { Modal } from "./Modal";
import { PrimaryButton, SecondaryButton } from "./FormField";

type Stage = "pick" | "upload" | "processing" | "preview" | "done";

const DOC_TYPES: { key: DocumentItem["category"]; label: string; icon: string; fields: { label: string; value: string }[]; title: string }[] = [
  {
    key: "insurance",
    label: "กรมธรรม์ประกันภัย",
    icon: "🛡️",
    title: "กรมธรรม์ประกันภัยชั้น 1 (ฉบับใหม่)",
    fields: [
      { label: "บริษัท", value: "วิริยะประกันภัย" },
      { label: "กรมธรรม์เลขที่", value: "V1-2027-10234" },
      { label: "ความคุ้มครอง", value: "ชั้น 1" },
      { label: "วันหมดอายุ", value: "23 ต.ค. 2570" },
    ],
  },
  {
    key: "cmi",
    label: "พ.ร.บ.",
    icon: "📄",
    title: "พ.ร.บ. คุ้มครองผู้ประสบภัย (ฉบับใหม่)",
    fields: [
      { label: "เลขที่กรมธรรม์", value: "PRB-2027-5521" },
      { label: "ผู้รับประกัน", value: "บริษัท กลางคุ้มครองผู้ประสบภัยฯ" },
      { label: "วันหมดอายุ", value: "5 ต.ค. 2570" },
    ],
  },
  {
    key: "invoice",
    label: "ใบเสร็จ",
    icon: "🧾",
    title: "ใบเสร็จค่าบริการ",
    fields: [
      { label: "ร้าน/ศูนย์บริการ", value: "AutoCare Express พระราม 9" },
      { label: "รายการ", value: "เปลี่ยนน้ำมันเครื่อง + ไส้กรอง" },
      { label: "จำนวนเงิน", value: "2,450 บาท" },
    ],
  },
  {
    key: "service",
    label: "ใบซ่อม",
    icon: "🔧",
    title: "ใบรับรองการซ่อม",
    fields: [
      { label: "ร้าน/ศูนย์บริการ", value: "Bosch Car Service สุขุมวิท" },
      { label: "รายการ", value: "ล้างหัวฉีด" },
      { label: "เลขไมล์", value: "88,450 กม." },
    ],
  },
  {
    key: "warranty",
    label: "Warranty",
    icon: "🛡️",
    title: "บัตรรับประกันศูนย์",
    fields: [
      { label: "ผู้ออกเอกสาร", value: "Toyota Motor Thailand" },
      { label: "ระยะเวลา", value: "5 ปี / 100,000 กม." },
      { label: "วันหมดอายุ", value: "15 มี.ค. 2570" },
    ],
  },
];

export function OCRModal() {
  const { ocrOpen, ocrTarget, closeOcr } = useUI();
  const { addDocument, addReminderCustom } = useCarData();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("pick");
  const [docType, setDocType] = useState<(typeof DOC_TYPES)[number] | null>(null);

  useEffect(() => {
    if (!ocrOpen) {
      setStage("pick");
      setDocType(null);
      return;
    }
    const preset = DOC_TYPES.find((d) => d.key === ocrTarget);
    if (preset) {
      setDocType(preset);
      setStage("upload");
    }
  }, [ocrOpen, ocrTarget]);

  useEffect(() => {
    if (stage !== "processing") return;
    const t = setTimeout(() => setStage("preview"), 1700);
    return () => clearTimeout(t);
  }, [stage]);

  function pick(d: (typeof DOC_TYPES)[number]) {
    setDocType(d);
    setStage("upload");
  }

  function confirmSave() {
    if (!docType) return;
    addDocument({
      id: `ocr-${Date.now()}`,
      title: docType.title,
      category: docType.key,
      status: "active",
      addedDate: new Date().toISOString().slice(0, 10),
    });
    addReminderCustom(`เอกสารใหม่: ${docType.label}`, "2027-03-01");
    setStage("done");
  }

  function close() {
    closeOcr();
  }

  return (
    <Modal open={ocrOpen} onClose={close}>
      {stage === "pick" && (
        <div>
          <h2 className="mb-1 text-[17px] font-bold text-ink">สแกนเอกสาร (OCR)</h2>
          <p className="mb-4 text-[12.5px] text-ink/50">เลือกประเภทเอกสารที่ต้องการสแกน</p>
          <div className="space-y-2.5">
            {DOC_TYPES.map((d) => (
              <button
                key={d.key}
                onClick={() => pick(d)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-bg px-4 py-3.5 text-left active:scale-[0.98] transition-transform"
              >
                <span className="text-[20px]">{d.icon}</span>
                <span className="text-[14px] font-semibold text-ink">{d.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === "upload" && docType && (
        <div className="flex flex-col items-center py-2 text-center">
          <h2 className="mb-1 text-[16px] font-bold text-ink">{docType.label}</h2>
          <p className="mb-5 text-[12.5px] text-ink/50">ถ่ายรูปหรือเลือกรูปเอกสารจากคลังภาพ</p>
          <div className="mb-5 flex h-40 w-full items-center justify-center rounded-2xl border-2 border-dashed border-border bg-bg text-[13px] text-ink/40">
            {docType.icon} ตัวอย่างเอกสาร {docType.label}
          </div>
          <div className="w-full space-y-2">
            <PrimaryButton onClick={() => setStage("processing")}>📷 ถ่ายรูปเอกสาร</PrimaryButton>
            <SecondaryButton onClick={() => setStage("processing")}>🖼️ เลือกจากคลังภาพ</SecondaryButton>
          </div>
        </div>
      )}

      {stage === "processing" && (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-5 h-14 w-14 animate-spin rounded-full border-4 border-border border-t-navy" />
          <p className="text-[14px] font-semibold text-ink">กำลังอ่านข้อมูลด้วย OCR...</p>
          <p className="mt-1 text-[12px] text-ink/40">ระบบกำลังดึงข้อมูลสำคัญจากเอกสาร</p>
        </div>
      )}

      {stage === "preview" && docType && (
        <div>
          <h2 className="mb-3 text-[16px] font-bold text-ink">ตรวจสอบข้อมูลที่ดึงได้</h2>
          <div className="mb-5 space-y-2.5 rounded-2xl border border-border p-4">
            {docType.fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-3">
                <span className="text-[12.5px] text-ink/50">{f.label}</span>
                <span className="text-right text-[13.5px] font-bold text-ink">{f.value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <PrimaryButton onClick={confirmSave}>ยืนยัน และบันทึกลง Wallet</PrimaryButton>
            <SecondaryButton onClick={() => setStage("upload")}>สแกนใหม่</SecondaryButton>
          </div>
        </div>
      )}

      {stage === "done" && docType && (
        <div className="animate-fade-in">
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="animate-check-pop mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-status-green/10 text-[32px] text-status-green">
              ✓
            </div>
            <h2 className="text-[17px] font-bold text-ink">บันทึกสำเร็จ</h2>
            <p className="text-[12.5px] text-ink/50">{docType.title}</p>
          </div>
          <div className="mb-5 space-y-2.5">
            {[
              { label: "Saved to Digital Car Wallet", detail: "เอกสารถูกจัดเก็บพร้อมสถานะล่าสุด" },
              { label: "Auto Reminder Created", detail: "ตั้งแจ้งเตือนก่อนเอกสารหมดอายุให้แล้ว" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-2xl bg-status-green/5 px-3.5 py-2.5">
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
                router.push("/my-car/wallet");
              }}
            >
              ไปที่ Wallet
            </PrimaryButton>
            <SecondaryButton onClick={close}>เสร็จสิ้น</SecondaryButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
