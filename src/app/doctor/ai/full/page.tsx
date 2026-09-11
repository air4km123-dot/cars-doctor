"use client";

import { useCarData } from "@/lib/store";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui";
import { PremiumBanner } from "@/components/PremiumBanner";

export default function AIDoctorFullPage() {
  const { vehicle, trackers } = useCarData();
  const battery = trackers.find((t) => t.key === "battery")!;

  return (
    <div>
      <Header title="หมอรถ AI (เต็มรูปแบบ)" status="PREMIUM" />
      <div className="space-y-4 px-4 pt-4">
        <PremiumBanner description="วิเคราะห์เจาะลึกโดยอ้างอิงประวัติซ่อมบำรุงจริงของรถคันนี้ ไม่ใช่คำแนะนำทั่วไป" />

        <Card>
          <p className="mb-2 text-[12px] font-bold text-ink/40">ตัวอย่างผลการวิเคราะห์เชิงลึก</p>
          <p className="text-[13.5px] leading-relaxed text-ink/75">
            จากประวัติของ {vehicle.brand} {vehicle.model} คันนี้ พบว่าแบตเตอรี่เดิมถูกใช้งานมานาน{" "}
            {Math.round((Date.now() - new Date(battery.lastDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} เดือน
            ซึ่งเกินอายุการใช้งานเฉลี่ยของรุ่นนี้แล้ว ระบบประเมินว่ามีโอกาสสตาร์ทติดยากในสภาพอากาศเย็นเพิ่มขึ้น 68%
            แนะนำให้เปลี่ยนก่อนถึงจุดที่ส่งผลต่อระบบไฮบริด
          </p>
        </Card>

        <Card>
          <p className="mb-2 text-[12px] font-bold text-ink/40">คำแนะนำเฉพาะรุ่นนี้</p>
          <ul className="space-y-1.5 text-[13px] text-ink/75">
            <li>• ระบบไฮบริดของ Corolla Cross ควรใช้แบตเตอรี่ 12V เกรด AGM เท่านั้น</li>
            <li>• ตรวจสอบสายพานหัวฉีดร่วมกับรอบเปลี่ยนน้ำมันเครื่องครั้งถัดไป</li>
            <li>• ระยะทางเฉลี่ยของคุณ (~1,200 กม./เดือน) เหมาะกับรอบเช็คระยะทุก 6 เดือน</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
