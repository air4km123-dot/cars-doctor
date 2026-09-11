"use client";

import Link from "next/link";
import { useCarData } from "@/lib/store";
import { Header } from "@/components/Header";
import { Card, HealthRing, Row } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import { PremiumBanner } from "@/components/PremiumBanner";

const TIER_COLOR: Record<string, string> = {
  excellent: "text-status-green",
  good: "text-status-green",
  watch: "text-status-orange",
  urgent: "text-status-red",
};

export default function HealthScorePage() {
  const { health } = useCarData();
  const legal = health.categories.find((c) => c.key === "legal")!;
  const actionRequired = health.categories.filter((c) => c.status === "urgent" || c.status === "dueSoon");

  return (
    <div>
      <Header title="คะแนนสุขภาพรถ" />
      <div className="space-y-4 px-4 pt-4">
        <Card className="flex items-center gap-4">
          <HealthRing score={health.overall} size={100} />
          <div>
            <p className={`text-[15px] font-bold ${TIER_COLOR[health.tier]}`}>{health.tierLabel}</p>
            <p className="mt-0.5 text-[12px] text-ink/50">คำนวณแบบไดนามิกจากรอบบำรุงรักษา เลขไมล์ และเอกสารล่าสุด</p>
          </div>
        </Card>

        {actionRequired.length > 0 && (
          <div>
            <p className="mb-2 px-1 text-[14px] font-bold text-status-red">⚠️ การแจ้งเตือนเร่งด่วน (Action Required)</p>
            <Card className="space-y-2.5">
              {actionRequired.map((c) => (
                <div key={c.key} className="rounded-xl bg-status-red/5 px-3.5 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-bold text-ink">{c.label}</span>
                    <StatusChip status={c.status} />
                  </div>
                  <p className="mb-2 text-[11.5px] text-ink/55">{c.summary}</p>
                  <Link
                    href={c.key === "legal" ? "/legal-calendar" : `/doctor/ai?symptom=${c.key}`}
                    className="block rounded-lg bg-navy py-2 text-center text-[12px] font-bold text-white"
                  >
                    {c.key === "legal" ? "ไปที่ปฏิทินเอกสารรถ" : "🤖 คุยกับ AI หมอรถ"}
                  </Link>
                </div>
              ))}
            </Card>
          </div>
        )}

        <div>
          <p className="mb-2 px-1 text-[14px] font-bold text-ink">หมวดหมู่หลัก</p>
          <div className="grid grid-cols-2 gap-3">
            {health.groups.map((g) => {
              const cardBody = (
                <>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[20px]">{g.icon}</span>
                    <StatusChip status={g.status} />
                  </div>
                  <p className="text-[12.5px] font-bold leading-tight text-ink">{g.label}</p>
                  <p className="mt-1 text-[16px] font-extrabold text-ink">{g.score}</p>
                </>
              );
              if (g.members.length === 1) {
                return (
                  <Link key={g.key} href={`/tracker/${g.members[0].key}`} className="block rounded-2xl bg-white p-3.5 shadow-card active:bg-bg/40">
                    {cardBody}
                  </Link>
                );
              }
              return (
                <div key={g.key} className="rounded-2xl bg-white p-3.5 shadow-card">
                  {cardBody}
                  <div className="mt-2 space-y-1 border-t border-border pt-2">
                    {g.members.map((m) => (
                      <Link key={m.key} href={`/tracker/${m.key}`} className="flex items-center justify-between text-[10.5px] text-ink/55">
                        <span className="truncate">{m.label}</span>
                        <span className="font-bold text-ink/70">{m.score}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Card>
          <Row title={legal.label} subtitle={legal.summary} href="/legal-calendar" right={<div className="flex items-center gap-2"><span className="text-[13px] font-bold text-ink/70">{legal.score}</span><StatusChip status={legal.status} /></div>} />
        </Card>

        <PremiumBanner description="อยากรู้ลึกกว่านี้? Advanced Car Health Score วิเคราะห์พฤติกรรมการใช้งานและความเสี่ยงล่วงหน้า" />
      </div>
    </div>
  );
}
