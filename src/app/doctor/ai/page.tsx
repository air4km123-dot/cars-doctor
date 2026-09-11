"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCarData } from "@/lib/store";
import { CATEGORY_AI_PROMPT } from "@/lib/health";
import { Card, Row, SectionHeader } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import { StatusBadge } from "@/components/Badge";
import { FormField, PrimaryButton } from "@/components/FormField";
import type { TrackerKey } from "@/lib/types";

type Severity = "low" | "medium" | "high" | "urgent";

interface Diagnosis {
  causes: string[];
  severity: Severity;
  shouldDrive: string;
  whatToCheck: string[];
  estimatedCost: string;
}

const PROMPTS = [
  "น้ำมันเครื่องใกล้ครบรอบเปลี่ยนถ่าย ควรทำอย่างไร?",
  "รถสั่นตอนจอดเกิดจากอะไร?",
  "เบรกมีเสียงดังตอนเหยียบ",
  "แอร์ไม่เย็นเหมือนเดิม",
  "สตาร์ทไม่ติดตอนเช้า",
  "ยางควรสลับหรือเปลี่ยนเมื่อไหร่?",
];

const DIAGNOSES: Record<string, Diagnosis> = {
  "น้ำมันเครื่องใกล้ครบรอบเปลี่ยนถ่าย ควรทำอย่างไร?": {
    causes: ["ถึงรอบตามระยะทาง/ระยะเวลาที่กำหนด", "น้ำมันเครื่องเสื่อมสภาพตามการใช้งาน"],
    severity: "medium",
    shouldDrive: "ขับได้ตามปกติ แต่ไม่ควรเกินรอบที่กำหนดเกิน 1,000 กม.",
    whatToCheck: ["ระดับและสีน้ำมันเครื่อง", "ไส้กรองน้ำมันเครื่อง"],
    estimatedCost: "1,800 - 2,500 บาท",
  },
  "รถสั่นตอนจอดเกิดจากอะไร?": {
    causes: ["เครื่องยนต์รอบเดินเบาผิดปกติ", "ยางแท่นเครื่องเสื่อมสภาพ", "หัวเทียน/หัวฉีดสกปรก"],
    severity: "medium",
    shouldDrive: "ขับได้ในระยะสั้น แต่ควรตรวจสอบภายใน 1-2 สัปดาห์",
    whatToCheck: ["แท่นเครื่อง (Engine Mounting)", "หัวเทียนและหัวฉีด", "ระบบรอบเดินเบา"],
    estimatedCost: "800 - 3,500 บาท",
  },
  "เบรกมีเสียงดังตอนเหยียบ": {
    causes: ["ผ้าเบรกใกล้หมด", "จานเบรกเป็นสนิมหรือมีรอย", "มีเศษหินติดค้าง"],
    severity: "high",
    shouldDrive: "ควรเข้าตรวจโดยเร็วที่สุด ไม่แนะนำให้ขับระยะไกล",
    whatToCheck: ["ผ้าเบรกหน้า-หลัง", "จานเบรก", "น้ำมันเบรก"],
    estimatedCost: "800 - 2,200 บาท",
  },
  "แอร์ไม่เย็นเหมือนเดิม": {
    causes: ["น้ำยาแอร์รั่วหรือพร่อง", "คอมเพรสเซอร์แอร์เสื่อมสภาพ", "แผงคอยล์เย็นสกปรก"],
    severity: "low",
    shouldDrive: "ขับต่อได้ปกติ ไม่กระทบความปลอดภัย",
    whatToCheck: ["น้ำยาแอร์", "คอมเพรสเซอร์", "แผงคอยล์เย็น/ร้อน"],
    estimatedCost: "600 - 3,000 บาท",
  },
  "สตาร์ทไม่ติดตอนเช้า": {
    causes: ["แบตเตอรี่อ่อนหรือใกล้หมดอายุ", "ขั้วแบตเตอรี่หลวมหรือมีคราบสนิม", "มอเตอร์สตาร์ทเสื่อมสภาพ"],
    severity: "urgent",
    shouldDrive: "ไม่ควรขับจนกว่าจะตรวจสอบแบตเตอรี่ อาจดับกลางทางได้",
    whatToCheck: ["แรงดันแบตเตอรี่", "ขั้วแบตเตอรี่", "ระบบชาร์จไฟ (Alternator)"],
    estimatedCost: "2,500 - 4,500 บาท",
  },
  "ยางควรสลับหรือเปลี่ยนเมื่อไหร่?": {
    causes: ["ดอกยางสึกไม่เท่ากันจากการไม่ได้สลับยาง", "ลมยางไม่สม่ำเสมอ", "ยางใกล้ครบอายุการใช้งาน"],
    severity: "medium",
    shouldDrive: "ขับได้ปกติ แนะนำให้เข้าสลับยางภายในรอบที่กำหนด",
    whatToCheck: ["ความลึกดอกยาง", "แรงดันลมยางทั้ง 4 ล้อ", "การตั้งศูนย์ล้อ"],
    estimatedCost: "0 - 400 บาท (สลับยาง) / 12,000 - 20,000 บาท (เปลี่ยนยางใหม่ 4 เส้น)",
  },
};

const SEVERITY_LEVEL: Record<Severity, "healthy" | "warning" | "dueSoon" | "urgent"> = {
  low: "healthy",
  medium: "warning",
  high: "dueSoon",
  urgent: "urgent",
};
const SEVERITY_LABEL: Record<Severity, string> = { low: "ต่ำ", medium: "กลาง", high: "สูง", urgent: "ด่วน" };

export default function AIDoctorBasicPage() {
  const { addSymptomRecord } = useCarData();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ q: string; d: Diagnosis } | null>(null);
  const [symptomTitle, setSymptomTitle] = useState("");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [symptomSaved, setSymptomSaved] = useState(false);
  const autoAsked = useRef(false);

  function ask(prompt: string) {
    const d = DIAGNOSES[prompt] ?? DIAGNOSES[PROMPTS[0]];
    setResult({ q: prompt, d });
  }

  useEffect(() => {
    if (autoAsked.current) return;
    const symptomKey = new URLSearchParams(window.location.search).get("symptom") as TrackerKey | null;
    if (symptomKey && CATEGORY_AI_PROMPT[symptomKey]) {
      autoAsked.current = true;
      ask(CATEGORY_AI_PROMPT[symptomKey]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveSymptom() {
    if (!symptomTitle) return;
    addSymptomRecord(symptomTitle, severity, "");
    setSymptomSaved(true);
    setSymptomTitle("");
    setTimeout(() => setSymptomSaved(false), 2500);
  }

  return (
    <div className="pb-4">
      <div className="bg-navy px-4 pb-6 pt-[calc(env(safe-area-inset-top)+18px)] text-white">
        <h1 className="text-[19px] font-bold">AI หมอรถ</h1>
        <p className="mt-0.5 text-[12.5px] text-white/60">ถามอาการ วินิจฉัยเบื้องต้น และบันทึกอาการรถได้ในที่เดียว</p>
      </div>

      <div className="space-y-4 px-4 pt-4">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="shrink-0 rounded-full border border-border bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink/70 active:bg-bg"
            >
              {p}
            </button>
          ))}
        </div>

        <FormField label="" value={query} onChange={setQuery} placeholder="พิมพ์อาการของรถคุณ..." />
        <PrimaryButton onClick={() => query && ask(query)} disabled={!query}>
          ถามหมอรถ AI
        </PrimaryButton>

        {result && (
          <div className="animate-fade-in space-y-3">
            <Card>
              <p className="mb-2 text-[12px] font-bold text-ink/40">คำถาม</p>
              <p className="text-[13.5px] font-semibold text-ink">&ldquo;{result.q}&rdquo;</p>
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-bold text-ink">ระดับความรุนแรง</p>
                <StatusChip status={SEVERITY_LEVEL[result.d.severity]} label={SEVERITY_LABEL[result.d.severity]} />
              </div>
              <Section title="สาเหตุที่เป็นไปได้" items={result.d.causes} />
              <div className="mt-3 rounded-xl bg-bg px-3.5 py-3">
                <p className="text-[12px] font-bold text-ink/50">ควรขับต่อหรือไม่?</p>
                <p className="mt-0.5 text-[13px] text-ink">{result.d.shouldDrive}</p>
              </div>
              <div className="mt-3">
                <Section title="ควรตรวจอะไรบ้าง" items={result.d.whatToCheck} />
              </div>
              <div className="mt-3 rounded-xl bg-bg px-3.5 py-3">
                <p className="text-[12px] font-bold text-ink/50">ประเมินค่าใช้จ่าย</p>
                <p className="mt-0.5 text-[13.5px] font-bold text-ink">{result.d.estimatedCost}</p>
              </div>
            </Card>

            <Link href="/marketplace/providers" className="block rounded-2xl bg-navy px-4 py-3 text-center text-[13px] font-bold text-white">
              ค้นหาผู้ให้บริการใกล้ฉัน
            </Link>
            <Link href="/doctor/ai/full" className="block rounded-2xl border border-[#F0C419]/50 bg-[#3A2E0B] px-4 py-3 text-center text-[13px] font-bold text-[#F0C419]">
              ★ วิเคราะห์เจาะลึกกว่านี้ (Premium)
            </Link>
          </div>
        )}

        <div>
          <SectionHeader title="บันทึกอาการไว้ก่อน" />
          <Card className="space-y-3">
            <FormField label="อาการที่พบ" value={symptomTitle} onChange={setSymptomTitle} placeholder="เช่น มีเสียงดังตอนเบรก" />
            <div>
              <span className="mb-1.5 block text-[12.5px] font-semibold text-ink/70">ระดับความรุนแรง</span>
              <div className="flex gap-2">
                {(["low", "medium", "high", "urgent"] as Severity[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`flex-1 rounded-xl py-2 text-[12.5px] font-semibold ${severity === s ? "bg-navy text-white" : "bg-bg text-ink/60"}`}
                  >
                    {SEVERITY_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
            <PrimaryButton onClick={saveSymptom} disabled={!symptomTitle}>
              {symptomSaved ? "✓ บันทึกแล้ว" : "บันทึกอาการ"}
            </PrimaryButton>
          </Card>
        </div>

        <div>
          <SectionHeader title="เครื่องมือวิเคราะห์เพิ่มเติม" />
          <Card className="divide-y divide-border">
            <Row icon="📸" title="วิเคราะห์รูปภาพด้วย AI" right={<StatusBadge status="PREMIUM" />} href="/feature/ai-image-analysis" />
            <Row icon="🎙️" title="วิเคราะห์เสียงด้วย AI" right={<StatusBadge status="PREMIUM" />} href="/feature/ai-sound-analysis" />
            <Row icon="🔮" title="คาดการณ์การซ่อมบำรุง" right={<StatusBadge status="PREMIUM" />} href="/feature/predictive-maintenance" />
            <Row icon="💰" title="ประเมินค่าซ่อม" right={<StatusBadge status="PREMIUM" />} href="/feature/repair-cost-estimate" />
            <Row icon="🧾" title="ประเมินค่าบริการล่วงหน้า" href="/feature/service-cost-estimate" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-1.5 text-[12px] font-bold text-ink/50">{title}</p>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-[13px] text-ink/75">
            <span className="text-navy">•</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
