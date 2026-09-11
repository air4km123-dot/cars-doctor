"use client";

import { useCarData } from "@/lib/store";
import { formatThaiDate } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import type { StatusLevel } from "@/lib/types";

function toLevel(s: "active" | "dueSoon" | "expired"): StatusLevel {
  if (s === "expired") return "urgent";
  if (s === "dueSoon") return "dueSoon";
  return "healthy";
}

const LEGAL_CATEGORIES = ["roadtax", "cmi", "insurance", "inspection", "warranty"];

export default function LegalCalendarPage() {
  const { documents } = useCarData();
  const legalDocs = documents.filter((d) => LEGAL_CATEGORIES.includes(d.category));
  const dueSoon = legalDocs.filter((d) => d.status === "dueSoon");
  const expired = legalDocs.filter((d) => d.status === "expired");
  const active = legalDocs.filter((d) => d.status === "active");

  return (
    <div>
      <Header title="ปฏิทินเอกสารรถ" />
      <div className="space-y-5 px-4 pt-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Card>
            <p className="text-[16px] font-extrabold text-status-red">{expired.length}</p>
            <p className="text-[10.5px] text-ink/45">หมดอายุ</p>
          </Card>
          <Card>
            <p className="text-[16px] font-extrabold text-status-orange">{dueSoon.length}</p>
            <p className="text-[10.5px] text-ink/45">ใกล้หมดอายุ</p>
          </Card>
          <Card>
            <p className="text-[16px] font-extrabold text-status-green">{active.length}</p>
            <p className="text-[10.5px] text-ink/45">ปกติ</p>
          </Card>
        </div>

        <div>
          <SectionHeader title="ตามลำดับความเร่งด่วน" />
          <Card className="divide-y divide-border">
            {[...expired, ...dueSoon, ...active].map((d) => (
              <Row
                key={d.id}
                title={d.title}
                subtitle={d.expireDate ? `หมดอายุ ${formatThaiDate(d.expireDate)}` : "ไม่มีวันหมดอายุ"}
                right={<StatusChip status={toLevel(d.status)} />}
              />
            ))}
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a href="/feature/road-tax" className="rounded-2xl bg-white p-3.5 shadow-card"><p className="text-[18px]">🏷️</p><p className="mt-1 text-[12.5px] font-bold text-ink">ภาษีรถยนต์</p></a>
          <a href="/feature/inspection" className="rounded-2xl bg-white p-3.5 shadow-card"><p className="text-[18px]">🔍</p><p className="mt-1 text-[12.5px] font-bold text-ink">ตรวจสภาพ</p></a>
        </div>
      </div>
    </div>
  );
}
