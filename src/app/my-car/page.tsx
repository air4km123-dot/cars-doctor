"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarData } from "@/lib/store";
import { formatNumber, formatThaiDate } from "@/lib/utils";
import { Card, Row, SectionHeader } from "@/components/ui";
import { StatusBadge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { FormField, PrimaryButton, SecondaryButton } from "@/components/FormField";

export default function MyCarPage() {
  const { vehicle, documents, health, completenessIndex, updateMileage } = useCarData();
  const dueSoonDocs = documents.filter((d) => d.status !== "active").length;
  const [editingMileage, setEditingMileage] = useState(false);
  const [mileageInput, setMileageInput] = useState(String(vehicle.mileage));

  function saveMileage() {
    updateMileage(Number(mileageInput) || vehicle.mileage);
    setEditingMileage(false);
  }

  return (
    <div className="pb-4">
      <div className="bg-navy px-4 pb-6 pt-[calc(env(safe-area-inset-top)+18px)] text-white">
        <h1 className="text-[19px] font-bold">รถของฉัน</h1>
        <div className="mt-4 rounded-2xl bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[26px]">🚗</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold">
                {vehicle.brand} {vehicle.model}
              </p>
              <p className="text-[12px] text-white/60">{vehicle.trim}</p>
              <p className="text-[12px] text-white/60">
                {vehicle.plate} {vehicle.province}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
            <button onClick={() => { setMileageInput(String(vehicle.mileage)); setEditingMileage(true); }} className="active:opacity-70">
              <p className="text-[13px] font-bold">{formatNumber(vehicle.mileage)} ✎</p>
              <p className="text-[10px] text-white/50">กม. (แตะเพื่อแก้ไข)</p>
            </button>
            <div>
              <p className="text-[13px] font-bold">{health.overall}/100</p>
              <p className="text-[10px] text-white/50">Health Score</p>
            </div>
            <div>
              <p className="text-[13px] font-bold">{vehicle.year}</p>
              <p className="text-[10px] text-white/50">ปีที่ผลิต</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pt-4">
        <Link
          href="/passport"
          className="block rounded-2xl bg-gradient-to-br from-navy to-navy-light p-4 text-white shadow-card active:opacity-90"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0C419]/15 text-[24px]">🛂</div>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold">พาสปอร์ตดิจิทัลประจำรถ</p>
              <p className="text-[11.5px] text-white/60">✓ Certified by Cars Doctor · ครบถ้วน {completenessIndex}%</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/15">
                <div className="h-1.5 rounded-full bg-[#F0C419]" style={{ width: `${completenessIndex}%` }} />
              </div>
            </div>
            <span className="text-white/50">›</span>
          </div>
        </Link>

        <div>
          <SectionHeader title="ข้อมูลรถ" />
          <Card className="divide-y divide-border">
            <Row icon="🔢" title="เลขตัวถัง (VIN)" subtitle={vehicle.vin} href="/feature/vin-record" />
            <Row icon="🧾" title="ข้อมูลการซื้อ" subtitle={formatThaiDate(vehicle.purchaseDate)} href="/feature/purchase-info" />
            <Row icon="🆔" title="ทะเบียนรถ" subtitle={`${vehicle.plate} ${vehicle.province}`} href="/feature/registration-record" />
            <Row icon="📍" title="เลขไมล์" subtitle={`${formatNumber(vehicle.mileage)} กม. · ประวัติทั้งหมด`} href="/maintenance" />
          </Card>
        </div>

        <div>
          <SectionHeader title="เอกสาร" />
          <Card className="divide-y divide-border">
            <Row icon="🗂️" title="กระเป๋าเอกสารรถ (Wallet)" subtitle={dueSoonDocs > 0 ? `${dueSoonDocs} รายการใกล้หมดอายุ` : "เอกสารทั้งหมดปกติ"} href="/my-car/wallet" />
            <Row icon="📅" title="ปฏิทินเอกสารรถ" subtitle="ภาษี / พ.ร.บ. / ประกัน / ตรวจสภาพ" href="/legal-calendar" />
          </Card>
        </div>

        <div>
          <SectionHeader title="ผู้ขับขี่" />
          <Card>
            <Row icon="🧑‍✈️" title="โปรไฟล์ผู้ขับ / ใบขับขี่" subtitle="เก็บข้อมูลและแจ้งเตือนก่อนหมดอายุ" href="/feature/driver-profile" />
          </Card>
        </div>

        <div>
          <SectionHeader title="การเงิน" />
          <Card className="divide-y divide-border">
            <Row icon="💳" title="ข้อมูลไฟแนนซ์เบื้องต้น" href="/feature/finance-basic" />
            <Row icon="🧮" title="คำนวณเงินดาวน์ / ผ่อน" href="/feature/loan-calculator" />
            <Row icon="🏦" title="ยอดหนี้คงเหลือ" href="/feature/outstanding-finance" />
            <Row icon="📈" title="วิเคราะห์แนวโน้มไฟแนนซ์" right={<StatusBadge status="PREMIUM" />} href="/feature/finance-forecast" />
          </Card>
        </div>

        <div>
          <SectionHeader title="ประกันภัย, การรับประกัน & อุบัติเหตุ" />
          <Card className="divide-y divide-border">
            <Row icon="🛡️" title="ประกันภัยรถยนต์" href="/feature/insurance-record" />
            <Row icon="📄" title="พ.ร.บ." href="/feature/compulsory-insurance-record" />
            <Row icon="🛡️" title="ประกันศูนย์ (Warranty)" href="/feature/warranty-tracker" />
            <Row icon="⚠️" title="บันทึกอุบัติเหตุ" href="/feature/accident-record" />
            <Row icon="📋" title="ประวัติการเคลม" href="/feature/claim-history" />
            <Row icon="🧑‍💼" title="ผู้ช่วยเคลมประกัน" right={<StatusBadge status="PREMIUM" />} href="/feature/claim-assistant" />
            <Row icon="🚨" title="ช่วยเหลือฉุกเฉินข้างทาง" right={<StatusBadge status="MARKETPLACE" />} href="/feature/roadside-assistance" />
          </Card>
        </div>

        <div>
          <SectionHeader title="มูลค่ารถ" />
          <Card className="divide-y divide-border">
            <Row icon="📉" title="ค่าเสื่อมราคาโดยประมาณ" href="/feature/depreciation-preview" />
            <Row icon="💵" title="มูลค่ารถวันนี้" right={<StatusBadge status="PREMIUM" />} href="/feature/vehicle-value-today" />
            <Row icon="✅" title="ก่อนขายรถ" subtitle="เช็กลิสต์ / รายงานสุขภาพ / โอนกรรมสิทธิ์" href="/sell" />
          </Card>
        </div>

        <Link href="/product-map" className="block rounded-2xl border border-dashed border-navy/30 px-4 py-3 text-center text-[12.5px] font-semibold text-navy">
          🗺️ ดูฟีเจอร์ทั้งหมดใน Product Map
        </Link>
      </div>

      <Modal open={editingMileage} onClose={() => setEditingMileage(false)}>
        <h2 className="mb-3 text-[16px] font-bold text-ink">แก้ไขเลขไมล์</h2>
        <div className="space-y-3">
          <FormField label="เลขไมล์ปัจจุบัน" suffix="กม." type="number" value={mileageInput} onChange={setMileageInput} />
          <p className="rounded-xl bg-bg px-3.5 py-2.5 text-[12px] text-ink/50">เลขไมล์เดิม: {formatNumber(vehicle.mileage)} กม.</p>
          <PrimaryButton onClick={saveMileage}>บันทึก</PrimaryButton>
          <SecondaryButton onClick={() => setEditingMileage(false)}>ยกเลิก</SecondaryButton>
        </div>
      </Modal>
    </div>
  );
}
