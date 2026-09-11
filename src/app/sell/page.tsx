"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";
import { StatusBadge } from "@/components/Badge";

const CHECKLIST = ["เอกสารครบถ้วน (ทะเบียน/ไฟแนนซ์)", "ไม่มีภาระผูกพันทางการเงินค้าง", "มีประวัติซ่อมบำรุงครบ", "สภาพรถผ่านการตรวจเช็ค", "มีรายงานสุขภาพรถให้ผู้ซื้อดู"];

export default function SellPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const doneCount = CHECKLIST.filter((c) => checked[c]).length;

  return (
    <div>
      <Header title="ก่อนขายรถ" />
      <div className="space-y-5 px-4 pt-4">
        <div>
          <SectionHeader title={`เช็กลิสต์ก่อนขาย (${doneCount}/${CHECKLIST.length})`} />
          <Card className="space-y-1">
            {CHECKLIST.map((item) => (
              <button
                key={item}
                onClick={() => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))}
                className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left active:bg-bg"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-[11px] text-white ${
                    checked[item] ? "border-status-green bg-status-green" : "border-border"
                  }`}
                >
                  {checked[item] && "✓"}
                </span>
                <span className={`text-[13px] ${checked[item] ? "text-ink/40 line-through" : "text-ink"}`}>{item}</span>
              </button>
            ))}
          </Card>
        </div>

        <div>
          <SectionHeader title="ประเมินมูลค่า & ตัดสินใจ" />
          <Card className="divide-y divide-border">
            <Row icon="📉" title="ค่าเสื่อมราคาโดยประมาณ" href="/feature/depreciation-preview" />
            <Row icon="💵" title="มูลค่ารถวันนี้" right={<StatusBadge status="PREMIUM" />} href="/feature/vehicle-value-today" />
            <Row icon="🤔" title="วิเคราะห์ เก็บ หรือ ขาย" right={<StatusBadge status="PREMIUM" />} href="/feature/keep-vs-sell" />
            <Row icon="⏰" title="ช่วงเวลาที่ควรขาย" right={<StatusBadge status="PREMIUM" />} href="/feature/best-time-to-sell" />
          </Card>
        </div>

        <div>
          <SectionHeader title="เตรียมข้อมูลให้ผู้ซื้อ" />
          <Card className="divide-y divide-border">
            <Row icon="📑" title="สรุปประวัติรถให้ผู้ซื้อ" href="/feature/buyer-history-summary" />
            <Row icon="📊" title="รายงานสุขภาพรถ" right={<StatusBadge status="PREMIUM" />} href="/feature/health-report" />
            <Row icon="🛂" title="พาสปอร์ตรถ" href="/passport" />
          </Card>
        </div>

        <div>
          <SectionHeader title="โอนกรรมสิทธิ์" />
          <Card className="divide-y divide-border">
            <Row icon="📝" title="เช็กลิสต์โอนกรรมสิทธิ์" href="/feature/transfer-checklist" />
            <Row icon="🔁" title="โอนรถใน Cars Doctor" href="/feature/transfer-vehicle" />
            <Row icon="🏅" title="พาสปอร์ตรถแบบรับรอง" right={<StatusBadge status="COMING_SOON" />} href="/feature/passport-certified" />
          </Card>
        </div>
      </div>
    </div>
  );
}
