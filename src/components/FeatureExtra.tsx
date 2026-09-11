"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCarData } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import {
  vehicle,
  financeRecord,
  valueRecord,
  fuelPriceToday,
  usefulTodayCards,
  trafficFine,
  driverProfile,
  accidents,
  claims,
  providers,
} from "@/lib/mockData";
import { formatBaht, formatNumber, formatThaiDate } from "@/lib/utils";
import { Card, Row } from "@/components/ui";
import { StatusChip } from "@/components/StatusChip";
import { PrimaryButton, SecondaryButton } from "@/components/FormField";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-bg px-3.5 py-3">
      <p className="text-[11px] font-semibold text-ink/45">{label}</p>
      <p className="mt-0.5 text-[15px] font-extrabold text-ink">{value}</p>
      {sub && <p className="text-[10.5px] text-ink/40">{sub}</p>}
    </div>
  );
}

export function FeatureExtra({ id }: { id: string }) {
  const { trackers, health, symptomRecords, documents } = useCarData();
  const { showToast, openVoice } = useUI();

  switch (id) {
    case "vin-record":
      return (
        <Card className="space-y-2.5">
          <Row title="เลขตัวถัง (VIN)" subtitle={vehicle.vin} />
          <Row title="เลขเครื่องยนต์" subtitle="2ZR-FXE-8817234 (มอเตอร์ไฮบริด)" />
        </Card>
      );

    case "purchase-info":
      return (
        <Card>
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="วันที่ซื้อ" value={formatThaiDate(vehicle.purchaseDate)} />
            <Stat label="ราคาซื้อ" value={formatBaht(vehicle.purchasePrice)} />
          </div>
        </Card>
      );

    case "warranty-tracker": {
      const doc = documents.find((d) => d.category === "warranty");
      return (
        <Card>
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="คุ้มครองถึง" value={doc?.expireDate ? formatThaiDate(doc.expireDate) : "-"} />
            <Stat label="หรือระยะทาง" value="100,000 กม." sub={`เหลือ ${formatNumber(100000 - vehicle.mileage)} กม.`} />
          </div>
        </Card>
      );
    }

    case "finance-basic":
      return (
        <Card className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="วงเงินกู้" value={formatBaht(financeRecord.loanAmount)} />
            <Stat label="เงินดาวน์" value={formatBaht(financeRecord.downPayment)} />
            <Stat label="ค่างวด/เดือน" value={formatBaht(financeRecord.installmentAmount)} />
            <Stat label="งวดที่ผ่อนแล้ว" value={`${financeRecord.paidInstallments}/${financeRecord.totalInstallments}`} />
          </div>
        </Card>
      );

    case "loan-calculator":
      return <LoanCalculator />;

    case "finance-forecast":
      return (
        <Card>
          <p className="mb-2 text-[12px] font-bold text-ink/40">คาดการณ์ยอดคงเหลือ</p>
          <div className="space-y-2">
            {[0, 1, 2].map((y) => (
              <div key={y} className="flex items-center justify-between rounded-xl bg-bg px-3.5 py-2.5">
                <span className="text-[12.5px] text-ink/60">อีก {y === 0 ? "วันนี้" : `${y} ปี`}</span>
                <span className="text-[13.5px] font-bold text-ink">
                  {formatBaht(Math.max(0, financeRecord.outstandingBalance - y * financeRecord.installmentAmount * 12))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      );

    case "insurance-record":
    case "insurance": {
      const doc = documents.find((d) => d.category === "insurance");
      return (
        <Card className="space-y-2.5">
          <Row title="บริษัทประกัน" subtitle="วิริยะประกันภัย" />
          <Row title="ประเภทกรมธรรม์" subtitle="ชั้น 1" />
          <Row title="วันหมดอายุ" subtitle={doc?.expireDate ? formatThaiDate(doc.expireDate) : "-"} right={doc && <StatusChip status={doc.status === "expired" ? "urgent" : doc.status === "dueSoon" ? "dueSoon" : "healthy"} />} />
        </Card>
      );
    }

    case "compulsory-insurance-record":
    case "compulsory-insurance": {
      const doc = documents.find((d) => d.category === "cmi");
      return (
        <Card className="space-y-2.5">
          <Row title="ผู้รับประกัน" subtitle="บริษัท กลางคุ้มครองผู้ประสบภัยฯ" />
          <Row title="วันหมดอายุ" subtitle={doc?.expireDate ? formatThaiDate(doc.expireDate) : "-"} right={doc && <StatusChip status="urgent" />} />
        </Card>
      );
    }

    case "registration-record":
      return (
        <Card className="space-y-2.5">
          <Row title="เลขทะเบียน" subtitle={`${vehicle.plate} ${vehicle.province}`} />
          <Row title="วันจดทะเบียน" subtitle={formatThaiDate(vehicle.purchaseDate)} />
        </Card>
      );

    case "driver-profile":
      return (
        <Card className="space-y-2.5">
          <Row icon="🧑‍✈️" title={driverProfile.name} subtitle={driverProfile.licenseType} />
          <Row title="เลขใบขับขี่" subtitle={driverProfile.licenseNumberMasked} />
          <Row title="วันหมดอายุ" subtitle={formatThaiDate(driverProfile.expireDate)} right={<StatusChip status="dueSoon" />} />
        </Card>
      );

    case "road-tax": {
      const doc = documents.find((d) => d.category === "roadtax");
      return (
        <Card>
          <Row title="วันครบกำหนดต่อภาษี" subtitle={doc?.expireDate ? formatThaiDate(doc.expireDate) : "-"} right={<StatusChip status="warning" />} />
        </Card>
      );
    }

    case "inspection":
      return (
        <Card>
          <Row title="สถานะการตรวจสภาพ" subtitle="รถอายุไม่เกิน 7 ปี ยังไม่ต้องเข้าตรวจ ตรอ." right={<StatusChip status="healthy" label="ยังไม่ถึงรอบ" />} />
        </Card>
      );

    case "useful-today":
      return (
        <Card className="space-y-2.5">
          {usefulTodayCards.map((c) => (
            <div key={c.id} className="flex gap-3 rounded-xl bg-bg px-3.5 py-3">
              <span className="text-[18px]">{c.icon}</span>
              <div>
                <p className="text-[13px] font-bold text-ink">{c.title}</p>
                <p className="text-[11.5px] text-ink/50">{c.detail}</p>
              </div>
            </div>
          ))}
        </Card>
      );

    case "fuel-price-today":
      return (
        <Card>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <Stat label="Gasohol 95" value={`฿${fuelPriceToday.gasohol95}`} />
            <Stat label="Gasohol 91" value={`฿${fuelPriceToday.gasohol91}`} />
            <Stat label="Diesel" value={`฿${fuelPriceToday.diesel}`} />
          </div>
          <p className="mt-2.5 text-[11.5px] text-ink/45">{fuelPriceToday.changeNote}</p>
        </Card>
      );

    case "traffic-fine":
      return (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold text-ink">ใบสั่งค้างชำระ</p>
              <p className="text-[11.5px] text-ink/45">ตรวจสอบล่าสุด {formatThaiDate(trafficFine.lastCheckedDate)}</p>
            </div>
            <StatusChip status="healthy" label={`${trafficFine.outstandingCount} รายการ`} />
          </div>
          <SecondaryButton className="mt-3" onClick={() => showToast("ไม่พบใบสั่งค้างชำระสำหรับทะเบียนนี้")}>
            ตรวจสอบใบสั่งอีกครั้ง
          </SecondaryButton>
        </Card>
      );

    case "pretrip-check":
      return <PreTripCheck />;

    case "emergency-contacts":
      return (
        <Card className="space-y-1">
          {[
            { icon: "🚔", label: "ตำรวจ", value: "191" },
            { icon: "🚑", label: "หน่วยแพทย์ฉุกเฉิน", value: "1669" },
            { icon: "🛡️", label: "วิริยะประกันภัย (สายด่วน)", value: "1557" },
            { icon: "🛠️", label: "Cars Doctor Roadside", value: "1800-XXX" },
            { icon: "🏢", label: "Toyota Sure ลาดพร้าว", value: "02-XXX-XXXX" },
          ].map((c) => (
            <a key={c.label} href={`tel:${c.value}`} className="flex items-center justify-between rounded-xl px-1 py-2.5 active:bg-bg">
              <span className="flex items-center gap-3 text-[13px] font-semibold text-ink">
                <span className="text-[18px]">{c.icon}</span>
                {c.label}
              </span>
              <span className="text-[13px] font-bold text-navy">{c.value}</span>
            </a>
          ))}
        </Card>
      );

    case "voice-input":
      return (
        <Card className="text-center">
          <p className="mb-3 text-[13px] text-ink/60">ลองใช้งานจริงได้จากปุ่ม + ด้านล่าง หรือกดปุ่มด้านล่างนี้เพื่อทดลองทันที</p>
          <PrimaryButton onClick={openVoice}>🎤 ทดลอง Voice Input</PrimaryButton>
        </Card>
      );

    case "health-advanced":
      return (
        <Card className="space-y-2.5">
          {health.categories.slice(0, 3).map((h) => (
            <Row key={h.key} title={h.label} subtitle={`ความเสี่ยง: ${h.status === "healthy" ? "ต่ำ" : h.status === "urgent" ? "สูง" : "ปานกลาง"}`} right={<StatusChip status={h.status} />} />
          ))}
          <p className="text-[11.5px] text-ink/40">* วิเคราะห์จากรูปแบบการใช้งานเฉลี่ย 1,200 กม./เดือน</p>
        </Card>
      );

    case "symptom-record":
      return (
        <Card className="space-y-2.5">
          {symptomRecords.length === 0 && <p className="text-[12.5px] text-ink/45">ยังไม่มีอาการที่บันทึกไว้</p>}
          {symptomRecords.map((s) => (
            <Row key={s.id} title={s.title} subtitle={formatThaiDate(s.date)} right={<StatusChip status={s.severity === "urgent" || s.severity === "high" ? "urgent" : s.severity === "medium" ? "dueSoon" : "healthy"} label={s.severity} />} />
          ))}
          <p className="text-[11.5px] text-ink/40">เพิ่มอาการใหม่ได้จากปุ่ม + ด้านล่าง</p>
        </Card>
      );

    case "ai-image-analysis":
      return <AIMockAnalysis kind="image" />;

    case "ai-sound-analysis":
      return <AIMockAnalysis kind="sound" />;

    case "predictive-maintenance":
      return (
        <Card className="space-y-2.5">
          {trackers.slice(0, 4).map((t) => (
            <Row key={t.key} icon={t.icon} title={t.label} subtitle={`คาดว่าควรตรวจในอีก ${Math.max(5, Math.round((t.nextDueMileage - vehicle.mileage) / 45))} วัน`} />
          ))}
        </Card>
      );

    case "repair-cost-estimate":
      return (
        <Card className="space-y-2">
          {[
            { s: "เสียงดังตอนเบรก", c: "800 - 2,200 บาท" },
            { s: "เครื่องยนต์สั่นตอนจอด", c: "1,200 - 4,500 บาท" },
            { s: "แอร์ไม่เย็น", c: "600 - 3,000 บาท" },
          ].map((r) => (
            <div key={r.s} className="flex items-center justify-between rounded-xl bg-bg px-3.5 py-2.5">
              <span className="text-[12.5px] text-ink/60">{r.s}</span>
              <span className="text-[13px] font-bold text-ink">{r.c}</span>
            </div>
          ))}
          <p className="text-[11px] text-ink/40">* ราคาประเมินจากฐานข้อมูล ไม่ใช่ราคาสุดท้าย</p>
        </Card>
      );

    case "service-cost-estimate":
      return (
        <Card>
          <p className="mb-2 text-[12px] font-bold text-ink/40">
            {vehicle.brand} {vehicle.model} · {formatNumber(90000)} กม.
          </p>
          <div className="space-y-2">
            {[
              { s: "น้ำมันเครื่อง", c: "1,800 - 2,500 บาท" },
              { s: "ไส้กรอง", c: "450 - 800 บาท" },
              { s: "ตรวจเบรก", c: "Free / ขึ้นอยู่กับร้าน" },
            ].map((r) => (
              <div key={r.s} className="flex items-center justify-between rounded-xl bg-bg px-3.5 py-2.5">
                <span className="text-[12.5px] text-ink/60">{r.s}</span>
                <span className="text-[13px] font-bold text-ink">{r.c}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-ink/40">* ราคานี้เป็นประมาณการ</p>
          <Link href="/marketplace/providers" className="mt-3 block rounded-xl bg-navy py-3 text-center text-[13px] font-bold text-white">
            ค้นหาผู้ให้บริการ
          </Link>
        </Card>
      );

    case "accident-record":
      return (
        <Card className="space-y-2.5">
          {accidents.map((a) => (
            <Row key={a.id} icon="⚠️" title={a.location} subtitle={`${formatThaiDate(a.date)} · ${a.detail}`} />
          ))}
        </Card>
      );

    case "claim-history":
      return (
        <Card className="space-y-2.5">
          {claims.map((c) => (
            <Row key={c.id} icon="📋" title={c.insurer} subtitle={`${formatThaiDate(c.date)} · ${formatBaht(c.amount)}`} right={<StatusChip status="healthy" label="ปิดเคสแล้ว" />} />
          ))}
        </Card>
      );

    case "claim-assistant":
      return (
        <Card className="space-y-2">
          {["ถ่ายรูปความเสียหายรอบคัน", "แจ้งเหตุกับบริษัทประกันภายใน 24 ชม.", "เตรียมสำเนาบัตร ปชช. และใบขับขี่", "นัดหมายซ่อมกับอู่ในเครือ"].map((s, i) => (
            <div key={s} className="flex items-center gap-3 rounded-xl bg-bg px-3.5 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">{i + 1}</span>
              <span className="text-[12.5px] text-ink/70">{s}</span>
            </div>
          ))}
        </Card>
      );

    case "roadside-assistance":
      return (
        <Card className="space-y-2.5">
          {providers.slice(0, 2).map((p) => (
            <Row key={p.id} icon="🚨" title={p.name} subtitle={`${p.distanceKm} กม. · ${p.availableToday ? "พร้อมบริการ" : "ไม่พร้อม"}`} />
          ))}
        </Card>
      );

    case "depreciation-preview":
      return (
        <Card>
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="ราคาซื้อ" value={formatBaht(valueRecord.purchasePrice)} />
            <Stat label="มูลค่าปัจจุบัน (ประมาณ)" value={formatBaht(valueRecord.currentEstimatedValue)} />
          </div>
          <p className="mt-2.5 text-[11.5px] text-ink/45">
            ลดลงประมาณ {Math.round((1 - valueRecord.currentEstimatedValue / valueRecord.purchasePrice) * 100)}% จากราคาซื้อ
          </p>
        </Card>
      );

    case "vehicle-value-today":
      return (
        <Card className="text-center">
          <p className="text-[12px] font-semibold text-ink/45">มูลค่ารถวันนี้ (ประมาณ)</p>
          <p className="mt-1 text-[24px] font-extrabold text-ink">{formatBaht(valueRecord.currentEstimatedValue)}</p>
        </Card>
      );

    case "future-value-forecast":
      return (
        <Card>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <Stat label="1 ปี" value={formatBaht(valueRecord.forecast1Year)} />
            <Stat label="2 ปี" value={formatBaht(valueRecord.forecast2Year)} />
            <Stat label="3 ปี" value={formatBaht(valueRecord.forecast3Year)} />
          </div>
        </Card>
      );

    case "resale-price":
      return (
        <Card className="text-center">
          <p className="text-[12px] font-semibold text-ink/45">ช่วงราคาขายต่อในตลาด</p>
          <p className="mt-1 text-[20px] font-extrabold text-ink">
            {formatBaht(valueRecord.currentEstimatedValue - 30000)} - {formatBaht(valueRecord.currentEstimatedValue + 30000)}
          </p>
        </Card>
      );

    case "trade-in-estimate":
      return (
        <Card className="text-center">
          <p className="text-[12px] font-semibold text-ink/45">ราคาประเมิน Trade-in จากพาร์ทเนอร์</p>
          <p className="mt-1 text-[20px] font-extrabold text-ink">{formatBaht(valueRecord.currentEstimatedValue - 40000)}</p>
        </Card>
      );

    case "outstanding-finance":
      return (
        <Card>
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="ยอดคงเหลือ" value={formatBaht(financeRecord.outstandingBalance)} />
            <Stat label="งวดที่เหลือ" value={`${financeRecord.remainingInstallments} งวด`} />
          </div>
        </Card>
      );

    case "vehicle-equity":
      return (
        <Card>
          <div className="space-y-2">
            <Row title="มูลค่ารถปัจจุบัน" subtitle={formatBaht(valueRecord.currentEstimatedValue)} />
            <Row title="ยอดหนี้คงเหลือ" subtitle={`- ${formatBaht(financeRecord.outstandingBalance)}`} />
          </div>
          <div className="mt-2 rounded-xl bg-navy px-3.5 py-3 text-center">
            <p className="text-[11px] text-white/60">ส่วนต่างมูลค่ารถ (Equity)</p>
            <p className="text-[18px] font-extrabold text-white">{formatBaht(valueRecord.currentEstimatedValue - financeRecord.outstandingBalance)}</p>
          </div>
        </Card>
      );

    case "keep-vs-sell":
      return (
        <Card>
          <p className="mb-2 text-[13px] font-bold text-ink">คำแนะนำ: เก็บไว้ใช้ต่ออีก 1-2 ปี</p>
          <ul className="list-disc space-y-1 pl-4 text-[12.5px] text-ink/60">
            <li>ค่าเสื่อมราคาต่อปีเริ่มชะลอตัว</li>
            <li>สุขภาพรถโดยรวมยังอยู่ในเกณฑ์ดี (82/100)</li>
            <li>ยอดหนี้คงเหลือใกล้หมดในอีก {financeRecord.remainingInstallments} งวด</li>
          </ul>
        </Card>
      );

    case "best-time-to-sell":
      return (
        <Card className="text-center">
          <p className="text-[12px] font-semibold text-ink/45">ช่วงเวลาที่แนะนำ</p>
          <p className="mt-1 text-[18px] font-extrabold text-ink">พฤศจิกายน - มกราคม</p>
          <p className="mt-1 text-[11.5px] text-ink/45">ช่วงตลาดรถมือสองคึกคักจากโปรโมชันสิ้นปี</p>
        </Card>
      );

    case "buyer-history-summary":
      return (
        <Card className="space-y-2">
          <Row title="ประวัติซ่อมบำรุง" subtitle="7 รายการ ครบถ้วน" right={<StatusChip status="healthy" />} />
          <Row title="อุบัติเหตุ" subtitle="1 ครั้ง (เคลมปิดเคสแล้ว)" right={<StatusChip status="warning" />} />
          <Row title="เอกสาร" subtitle="ครบถ้วน 10 รายการ" right={<StatusChip status="healthy" />} />
        </Card>
      );

    case "health-report":
      return (
        <Card className="space-y-2">
          {["สรุปคะแนนสุขภาพ", "ประวัติซ่อมบำรุงทั้งหมด", "ประวัติอุบัติเหตุ/เคลม", "สถานะเอกสารและกฎหมาย"].map((s) => (
            <Row key={s} icon="📄" title={s} />
          ))}
          <SecondaryButton onClick={() => showToast("นี่คือ Prototype — ยังไม่สร้างไฟล์ PDF จริง")}>ดาวน์โหลดรายงาน (ตัวอย่าง)</SecondaryButton>
        </Card>
      );

    case "transfer-checklist":
      return (
        <Card className="space-y-2">
          {["เล่มทะเบียนตัวจริง", "สำเนาบัตรประชาชนผู้โอน/ผู้รับโอน", "หนังสือมอบอำนาจ (ถ้ามี)", "ปิดยอดไฟแนนซ์คงเหลือ (ถ้ามี)", "ประวัติซ่อมบำรุงฉบับเต็ม"].map((s) => (
            <div key={s} className="flex items-center gap-2.5 rounded-xl bg-bg px-3.5 py-2.5">
              <span className="text-status-green">☑</span>
              <span className="text-[12.5px] text-ink/70">{s}</span>
            </div>
          ))}
        </Card>
      );

    case "transfer-vehicle":
      return (
        <Card>
          <div className="flex items-center justify-between text-center">
            <div className="flex-1">
              <p className="text-[22px]">🧑</p>
              <p className="text-[11.5px] font-semibold text-ink/60">เจ้าของปัจจุบัน</p>
            </div>
            <span className="text-ink/30">→</span>
            <div className="flex-1">
              <p className="text-[22px]">🔁</p>
              <p className="text-[11.5px] font-semibold text-ink/60">โอนย้าย</p>
            </div>
            <span className="text-ink/30">→</span>
            <div className="flex-1">
              <p className="text-[22px]">🧑‍🦱</p>
              <p className="text-[11.5px] font-semibold text-ink/60">เจ้าของใหม่</p>
            </div>
          </div>
          <p className="mt-3 text-center text-[11.5px] text-ink/45">ข้อมูลส่วนตัวของผู้โอนจะไม่ถูกส่งต่อ มีเพียงประวัติรถเท่านั้นที่ส่งต่อให้เจ้าของใหม่</p>
        </Card>
      );

    case "passport-certified":
      return (
        <Card className="space-y-2">
          <Row icon="🏅" title="ตัวอย่างรายการที่ได้รับการรับรอง" subtitle="ประวัติซ่อมบำรุงจากศูนย์ในเครือข่าย" />
          <Row icon="🏅" title="ตรวจสอบเลขไมล์ย้อนหลัง" subtitle="เทียบกับข้อมูลศูนย์บริการ" />
        </Card>
      );

    case "total-loss-record":
      return (
        <Card>
          <p className="text-[12.5px] text-ink/50">ยังไม่มีบันทึกความเสียหายสิ้นเชิงสำหรับรถคันนี้</p>
        </Card>
      );

    case "eol-checklist":
      return (
        <Card className="space-y-2">
          {["แจ้งยกเลิกประกันภัย", "แจ้งระงับทะเบียนกับกรมการขนส่งทางบก", "ปิดยอดไฟแนนซ์คงเหลือ (ถ้ามี)", "ส่งมอบซากให้ผู้รับซื้อที่ได้รับอนุญาต"].map((s) => (
            <Row key={s} icon="📋" title={s} />
          ))}
        </Card>
      );

    case "salvage-marketplace":
      return (
        <Card className="space-y-2.5">
          <Row icon="♻️" title="ศูนย์รีไซเคิลมาตรฐาน กรุงเทพฯ" subtitle="รับซื้อซากรถ ประเมินราคาออนไลน์" />
          <Row icon="♻️" title="เครือข่ายอะไหล่มือสอง" subtitle="รับซื้อชิ้นส่วนที่ยังใช้งานได้" />
        </Card>
      );

    case "service-booking":
      return (
        <Card>
          <p className="mb-3 text-[12.5px] text-ink/60">เลือกผู้ให้บริการก่อน เพื่อดูวันเวลาที่ว่างและจองคิว</p>
          <Link href="/marketplace/providers" className="block rounded-xl bg-navy py-3 text-center text-[13px] font-bold text-white">
            ไปที่ค้นหาผู้ให้บริการ
          </Link>
        </Card>
      );

    case "availability":
      return (
        <Card>
          <div className="grid grid-cols-4 gap-2 text-center">
            {["จ", "อ", "พ", "พฤ"].map((d, i) => (
              <div key={d} className={`rounded-xl py-2.5 ${i === 1 ? "bg-navy text-white" : "bg-bg text-ink/60"}`}>
                <p className="text-[11px] font-semibold">{d}</p>
                <p className="text-[10px]">{i === 1 ? "ว่าง" : "เต็ม"}</p>
              </div>
            ))}
          </div>
        </Card>
      );

    case "rating-review":
      return (
        <Card className="space-y-2.5">
          <Row icon="⭐" title="4.7 / 5.0" subtitle="จาก 312 รีวิว" />
          <Row title="“บริการเร็ว อธิบายละเอียดดีมาก”" subtitle="- ลูกค้า Toyota Sure ลาดพร้าว" />
        </Card>
      );

    case "payment":
      return (
        <Card className="space-y-2">
          {["บัตรเครดิต / เดบิต", "พร้อมเพย์", "เงินสดที่ร้าน"].map((m) => (
            <Row key={m} icon="💳" title={m} />
          ))}
        </Card>
      );

    case "insurance-marketplace":
      return (
        <Card className="space-y-2.5">
          {["วิริยะประกันภัย - ชั้น 1", "ทิพยประกันภัย - ชั้น 1", "เมืองไทยประกันภัย - ชั้น 2+"].map((m) => (
            <Row key={m} icon="🛡️" title={m} subtitle="เบี้ยเริ่มต้น 14,900 บาท/ปี" />
          ))}
        </Card>
      );

    case "provider-recommendation":
      return (
        <Card>
          <Row icon="🎯" title={providers[0].name} subtitle="แนะนำเพราะเชี่ยวชาญรถไฮบริดและอยู่ใกล้คุณ" />
        </Card>
      );

    default:
      return null;
  }
}

function LoanCalculator() {
  const [price, setPrice] = useState(1179000);
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(60);
  const downAmount = Math.round((price * down) / 100);
  const financed = price - downAmount;
  const monthly = Math.round((financed * 1.03) / months);

  return (
    <Card className="space-y-3">
      <div>
        <div className="mb-1.5 flex justify-between text-[12.5px]"><span className="text-ink/60">เงินดาวน์</span><span className="font-bold text-ink">{down}%</span></div>
        <input type="range" min={0} max={50} value={down} onChange={(e) => setDown(Number(e.target.value))} className="w-full accent-navy" />
      </div>
      <div>
        <div className="mb-1.5 flex justify-between text-[12.5px]"><span className="text-ink/60">ระยะเวลาผ่อน</span><span className="font-bold text-ink">{months} เดือน</span></div>
        <input type="range" min={12} max={84} step={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-navy" />
      </div>
      <div className="rounded-xl bg-navy px-3.5 py-3 text-center">
        <p className="text-[11px] text-white/60">ค่างวดโดยประมาณ</p>
        <p className="text-[20px] font-extrabold text-white">{formatBaht(monthly)} / เดือน</p>
      </div>
    </Card>
  );
}

function PreTripCheck() {
  const items = ["ยางและลมยาง", "น้ำมันเครื่อง", "น้ำหล่อเย็น", "แบตเตอรี่", "เบรก", "ไฟหน้า-ไฟท้าย", "น้ำมันเชื้อเพลิง", "เอกสารประจำรถ"];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allDone = items.every((i) => checked[i]);

  return (
    <Card>
      <div className="space-y-1">
        {items.map((i) => (
          <button
            key={i}
            onClick={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
            className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left active:bg-bg"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-[11px] text-white ${
                checked[i] ? "border-status-green bg-status-green" : "border-border"
              }`}
            >
              {checked[i] && "✓"}
            </span>
            <span className={`text-[13px] ${checked[i] ? "text-ink/40 line-through" : "text-ink"}`}>{i}</span>
          </button>
        ))}
      </div>
      {allDone && (
        <div className="animate-fade-in mt-3 rounded-xl bg-status-green/10 py-3 text-center text-[13.5px] font-bold text-status-green">
          ✓ พร้อมออกเดินทาง (Trip Ready)
        </div>
      )}
    </Card>
  );
}

function AIMockAnalysis({ kind }: { kind: "image" | "sound" }) {
  const [stage, setStage] = useState<"idle" | "processing" | "done">("idle");

  useEffect(() => {
    if (stage !== "processing") return;
    const t = setTimeout(() => setStage("done"), 1600);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <Card className="text-center">
      {stage === "idle" && (
        <>
          <p className="mb-3 text-[13px] text-ink/60">
            {kind === "image" ? "อัปโหลดรูปอาการเสียเพื่อให้ AI ช่วยวิเคราะห์" : "อัดเสียงผิดปกติเพื่อให้ AI ช่วยวิเคราะห์"}
          </p>
          <PrimaryButton onClick={() => setStage("processing")}>
            {kind === "image" ? "📸 อัปโหลดรูปภาพ (ตัวอย่าง)" : "🎙️ เริ่มอัดเสียง (ตัวอย่าง)"}
          </PrimaryButton>
        </>
      )}
      {stage === "processing" && (
        <div className="py-4">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-border border-t-navy" />
          <p className="text-[13px] text-ink/50">AI กำลังวิเคราะห์...</p>
        </div>
      )}
      {stage === "done" && (
        <div className="animate-fade-in rounded-xl bg-status-orange/10 p-4 text-left">
          <p className="mb-1 text-[12px] font-bold text-status-orange">ผลการวิเคราะห์ (ตัวอย่าง)</p>
          <p className="text-[13.5px] font-semibold text-ink">
            {kind === "image" ? "พบรอยแตกบริเวณยางด้านหน้าซ้าย" : "เสียงผิดปกติอาจเกี่ยวข้องกับสายพานราวลิ้น"}
          </p>
          <p className="mt-1 text-[11.5px] text-ink/50">แนะนำให้นำรถเข้าตรวจสอบภายใน 7 วัน</p>
        </div>
      )}
    </Card>
  );
}
