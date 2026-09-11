"use client";

import { useCarData } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { formatThaiDate } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import { PrimaryButton } from "@/components/FormField";
import type { StatusLevel } from "@/lib/types";

const CATEGORY_ICON: Record<string, string> = {
  registration: "🆔",
  insurance: "🛡️",
  cmi: "📄",
  roadtax: "🏷️",
  inspection: "🔍",
  warranty: "🛡️",
  finance: "💳",
  license: "🆔",
  invoice: "🧾",
  service: "🔧",
  photo: "🖼️",
};

function toStatusLevel(s: "active" | "dueSoon" | "expired"): StatusLevel {
  if (s === "expired") return "urgent";
  if (s === "dueSoon") return "dueSoon";
  return "healthy";
}

export default function WalletPage() {
  const { documents } = useCarData();
  const { openOcr } = useUI();

  const sorted = [...documents].sort((a, b) => {
    const rank = { expired: 0, dueSoon: 1, active: 2 };
    return rank[a.status] - rank[b.status];
  });

  return (
    <div>
      <Header title="Digital Car Wallet" />
      <div className="space-y-4 px-4 pt-4">
        <p className="text-[13px] text-ink/55">รวมเอกสารสำคัญของรถทั้งหมดไว้ที่เดียว สแกนเพิ่มได้ทันทีด้วย OCR</p>

        <PrimaryButton onClick={() => openOcr()}>📷 เพิ่มเอกสารด้วย OCR</PrimaryButton>

        <Card className="divide-y divide-border">
          {sorted.map((d) => (
            <div key={d.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg text-[18px]">
                {CATEGORY_ICON[d.category] ?? "📄"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{d.title}</p>
                <p className="text-[11.5px] text-ink/45">
                  {d.expireDate ? `หมดอายุ ${formatThaiDate(d.expireDate)}` : `เพิ่มเมื่อ ${formatThaiDate(d.addedDate)}`}
                </p>
              </div>
              <StatusChip status={toStatusLevel(d.status)} label={d.status === "active" ? "ปกติ" : d.status === "dueSoon" ? "ใกล้หมดอายุ" : "หมดอายุ"} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
