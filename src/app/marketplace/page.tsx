"use client";

import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";
import { MarketplaceBanner } from "@/components/PremiumBanner";
import { StatusBadge } from "@/components/Badge";

export default function MarketplacePage() {
  return (
    <div>
      <Header title="Marketplace" status="MARKETPLACE" />
      <div className="space-y-5 px-4 pt-4">
        <MarketplaceBanner description="Cars Doctor Marketplace จะเปิดใช้งานเต็มรูปแบบใน Phase 3 — เชื่อมต่อกับผู้ให้บริการหลังจากระบบตรวจพบความต้องการจริงจากข้อมูลรถของคุณ ไม่ใช่การยัดเยียดโฆษณา" />

        <div>
          <SectionHeader title="ค้นหา & จองบริการ" />
          <Card className="divide-y divide-border">
            <Row icon="🔍" title="ค้นหาผู้ให้บริการ" subtitle="ร้าน/ศูนย์บริการใกล้คุณ" href="/marketplace/providers" />
            <Row icon="📆" title="จองคิวบริการ" href="/feature/service-booking" />
            <Row icon="⭐" title="คะแนนและรีวิว" href="/feature/rating-review" />
            <Row icon="💳" title="การชำระเงิน" href="/feature/payment" />
          </Card>
        </div>

        <div>
          <SectionHeader title="ประกันภัย & แนะนำอัจฉริยะ" />
          <Card className="divide-y divide-border">
            <Row icon="🛡️" title="เปรียบเทียบ / ซื้อประกัน" href="/feature/insurance-marketplace" />
            <Row icon="🎯" title="แนะนำผู้ให้บริการจากข้อมูลรถ" right={<StatusBadge status="MARKETPLACE" />} href="/feature/provider-recommendation" />
            <Row icon="🚨" title="ช่วยเหลือฉุกเฉินข้างทาง" href="/feature/roadside-assistance" />
            <Row icon="♻️" title="ตลาดซากรถ / รีไซเคิล" href="/feature/salvage-marketplace" />
          </Card>
        </div>
      </div>
    </div>
  );
}
