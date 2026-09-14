"use client";

import { useState } from "react";
import { useUI } from "@/lib/uiStore";
import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-navy" : "bg-border"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function ToggleRow({ icon, title, subtitle, checked, onChange }: { icon: string; title: string; subtitle?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg text-[17px]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-ink">{title}</p>
        {subtitle && <p className="truncate text-[11.5px] text-ink/45">{subtitle}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const { showToast } = useUI();
  const [notifyMaintenance, setNotifyMaintenance] = useState(true);
  const [notifyDocs, setNotifyDocs] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);

  return (
    <div>
      <Header title="ตั้งค่า" />
      <div className="space-y-4 px-4 pt-4">
        <div>
          <SectionHeader title="การแจ้งเตือน" />
          <Card className="divide-y divide-border">
            <ToggleRow icon="🔧" title="แจ้งเตือนการบำรุงรักษา" subtitle="รอบเปลี่ยนถ่าย/ตรวจเช็คใกล้ถึง" checked={notifyMaintenance} onChange={setNotifyMaintenance} />
            <ToggleRow icon="📄" title="แจ้งเตือนเอกสารหมดอายุ" subtitle="ประกัน, พ.ร.บ., ภาษี, ใบขับขี่" checked={notifyDocs} onChange={setNotifyDocs} />
            <ToggleRow icon="🎁" title="ข่าวสารและโปรโมชั่น" subtitle="อัปเดตฟีเจอร์ใหม่และส่วนลด" checked={notifyPromo} onChange={setNotifyPromo} />
          </Card>
        </div>

        <div>
          <SectionHeader title="บัญชี" />
          <Card className="divide-y divide-border">
            <Row icon="🧑" title="ข้อมูลส่วนตัว" href="/profile" />
            <Row icon="🔒" title="เปลี่ยนรหัสผ่าน" onClick={() => showToast("นี่คือ Prototype — ยังไม่เปิดใช้งานระบบรหัสผ่านจริง")} />
            <Row icon="🛡️" title="ความเป็นส่วนตัว" onClick={() => showToast("นี่คือ Prototype — ยังไม่มีหน้านโยบายความเป็นส่วนตัวจริง")} />
          </Card>
        </div>

        <div>
          <SectionHeader title="แอปพลิเคชัน" />
          <Card className="divide-y divide-border">
            <Row icon="🌐" title="ภาษา" subtitle="ไทย" onClick={() => showToast("รองรับภาษาไทยเท่านั้นใน Prototype นี้")} />
            <Row icon="ℹ️" title="เกี่ยวกับ Cars Doctor" onClick={() => showToast("Cars Doctor — สมุดชีวิตรถ + ผู้ช่วยดูแลรถ + AI หมอรถ")} />
            <Row icon="🏷️" title="เวอร์ชันแอป" subtitle="1.0.0 (Prototype)" />
          </Card>
        </div>

        <button
          onClick={() => showToast("นี่คือ Prototype — ยังไม่เปิดใช้งานระบบ Login จริง")}
          className="w-full rounded-2xl border border-status-red/30 py-3.5 text-center text-[14px] font-bold text-status-red active:bg-status-red/5"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
