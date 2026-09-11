"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui";
import { PremiumBanner, ComingSoonBanner, MarketplaceBanner, NewIdeaBanner } from "@/components/PremiumBanner";
import { getFeature } from "@/lib/features";
import { FeatureExtra } from "@/components/FeatureExtra";

export default function FeaturePage({ params }: { params: { id: string } }) {
  const feature = getFeature(params.id);
  if (!feature) return notFound();

  return (
    <div>
      <Header title={feature.englishTitle ?? feature.title} status={feature.status} newIdea={feature.newIdea} />
      <div className="space-y-4 px-4 pt-4">
        <div>
          <h2 className="mb-1 text-[16px] font-bold text-ink">{feature.title}</h2>
          <p className="text-[13px] leading-relaxed text-ink/60">{feature.description}</p>
        </div>

        {feature.status === "PREMIUM" && <PremiumBanner description={premiumCopy(feature.id)} />}
        {feature.status === "COMING_SOON" && <ComingSoonBanner description={comingSoonCopy(feature.id)} />}
        {feature.status === "MARKETPLACE" && <MarketplaceBanner description={marketplaceCopy(feature.id)} />}
        {feature.newIdea && feature.status === "FREE" && <NewIdeaBanner description={newIdeaCopy(feature.id)} />}

        <FeatureExtra id={feature.id} />

        <Card>
          <p className="mb-2 text-[12px] font-bold text-ink/40">เชื่อมโยงกับ</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedFeatures(feature.id).map((r) => (
              <Link key={r} href={`/feature/${r}`} className="rounded-full bg-bg px-2.5 py-1 text-[11px] font-semibold text-ink/60">
                {getFeature(r)?.title ?? r}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function premiumCopy(id: string) {
  const map: Record<string, string> = {
    "finance-forecast": "คาดการณ์ภาระดอกเบี้ยและยอดผ่อนที่เหลือ พร้อมเปรียบเทียบทางเลือกในการรีไฟแนนซ์",
    "health-advanced": "วิเคราะห์เชิงลึกจากพฤติกรรมการขับขี่ ระยะทางเฉลี่ยต่อวัน และสภาพอากาศ เพื่อประเมินความเสี่ยงล่วงหน้า",
    "ai-doctor-full": "วิเคราะห์อาการโดยอ้างอิงประวัติซ่อมบำรุงและรุ่นรถของคุณโดยเฉพาะ แม่นยำกว่าคำแนะนำทั่วไป",
    "ai-image-analysis": "อัปโหลดรูปถ่ายอาการเสีย เช่น รอยรั่ว รอยแตก คราบน้ำมัน ให้ AI ช่วยระบุจุดที่น่าสงสัย",
    "ai-sound-analysis": "อัดเสียงผิดปกติ เช่น เสียงเครื่องยนต์ เสียงเบรก ให้ AI เทียบกับฐานข้อมูลเสียงรถยนต์",
    "predictive-maintenance": "ใช้ข้อมูลระยะทางเฉลี่ยต่อเดือนของคุณ คาดการณ์ว่าควรเข้ารับบริการแต่ละระบบเมื่อไหร่ ก่อนถึงวันจริง",
    "repair-cost-estimate": "ประเมินช่วงราคาค่าซ่อมจากอาการที่ระบุ พร้อมแยกค่าอะไหล่และค่าแรงโดยประมาณ",
    "claim-assistant": "ผู้เชี่ยวชาญด้านประกันช่วยแนะนำขั้นตอน เอกสาร และเจรจากับบริษัทประกันแทนคุณ",
    "vehicle-value-today": "ประเมินมูลค่ารถแบบเรียลไทม์จากข้อมูลตลาดซื้อขายรถมือสอง เทียบกับรุ่น ปี และเลขไมล์ของคุณ",
    "future-value-forecast": "แบบจำลองคาดการณ์มูลค่ารถในอนาคต ช่วยวางแผนว่าจะขายหรือเก็บไว้ใช้ต่อ",
    "resale-price": "ราคาขายต่อจากข้อมูลตลาดจริงล่าสุด อัปเดตทุกสัปดาห์",
    "trade-in-estimate": "ราคาประเมินจากพาร์ทเนอร์ศูนย์บริการ สำหรับใช้เป็นส่วนลดเมื่อซื้อรถคันใหม่",
    "vehicle-equity": "คำนวณส่วนต่างระหว่างมูลค่ารถกับยอดหนี้คงเหลือ เพื่อดูว่าคุณมี 'ทุน' ในรถเท่าไหร่",
    "keep-vs-sell": "วิเคราะห์ค่าใช้จ่ายในการเก็บรถต่อ เทียบกับมูลค่าที่จะได้จากการขายวันนี้",
    "best-time-to-sell": "แนะนำช่วงเวลาที่ราคาขายต่อของรุ่นนี้มักจะดีที่สุดในรอบปี",
    "health-report": "รวมสุขภาพรถ ประวัติซ่อมบำรุง อุบัติเหตุ และเอกสาร เป็นรายงาน PDF ให้ผู้ซื้อดูได้ทันที",
  };
  return map[id] ?? "ฟีเจอร์นี้เป็นส่วนหนึ่งของ Cars Doctor Premium ช่วยให้คุณดูแลรถได้แม่นยำและล่วงหน้ามากขึ้น";
}

function comingSoonCopy(id: string) {
  const map: Record<string, string> = {
    "passport-certified": "พาสปอร์ตรถที่ผ่านการตรวจสอบโดยศูนย์บริการในเครือข่าย Cars Doctor เพิ่มความน่าเชื่อถือเมื่อขายต่อ กำลังพัฒนาอยู่",
    "eol-checklist": "รายการเอกสารและขั้นตอนที่ต้องทำเมื่อเลิกใช้งานรถอย่างถูกต้องตามกฎหมาย กำลังพัฒนาอยู่",
  };
  return map[id] ?? "ฟีเจอร์นี้อยู่ระหว่างการพัฒนา จะเปิดให้ใช้งานในเวอร์ชันถัดไป";
}

function marketplaceCopy(id: string) {
  const map: Record<string, string> = {
    "roadside-assistance": "เรียกความช่วยเหลือฉุกเฉินจากพาร์ทเนอร์ใกล้คุณที่สุด — รถลาก แบตเตอรี่พ่วง เปลี่ยนยาง",
    "salvage-marketplace": "เชื่อมต่อกับผู้รับซื้อซากรถและชิ้นส่วนรีไซเคิลที่ผ่านการรับรอง",
  };
  return map[id] ?? "ฟีเจอร์นี้จะเปิดใช้งานเมื่อ Cars Doctor Marketplace เปิดให้บริการ (Phase 3)";
}

function newIdeaCopy(id: string) {
  return "แนวคิดใหม่ที่เพิ่มเข้ามาจากการวิเคราะห์คู่แข่งและพฤติกรรมผู้ใช้จริง เพื่อให้ Cars Doctor ช่วยเหลือผู้ใช้รถได้ครบวงจรมากขึ้น";
}

function relatedFeatures(id: string): string[] {
  const map: Record<string, string[]> = {
    "vin-record": ["vehicle-profile", "registration-record"],
    "purchase-info": ["vehicle-profile", "depreciation-preview"],
    "warranty-tracker": ["maintenance-history", "reminders"],
    "finance-basic": ["loan-calculator", "outstanding-finance"],
    "loan-calculator": ["finance-basic", "finance-forecast"],
    "finance-forecast": ["outstanding-finance", "vehicle-equity"],
    "insurance-record": ["insurance", "legal-calendar"],
    "compulsory-insurance-record": ["compulsory-insurance", "legal-calendar"],
    "registration-record": ["road-tax", "legal-calendar"],
    "driver-profile": ["legal-calendar", "reminders"],
    "road-tax": ["legal-calendar", "reminders"],
    "inspection": ["legal-calendar"],
    insurance: ["insurance-record", "claim-history"],
    "compulsory-insurance": ["compulsory-insurance-record"],
    "useful-today": ["fuel-price-today", "traffic-fine"],
    "fuel-price-today": ["fuel-tracker", "fuel-dashboard"],
    "traffic-fine": ["legal-calendar"],
    "pretrip-check": ["battery-tracker", "tire-tracker", "emergency-contacts"],
    "emergency-contacts": ["accident-record", "roadside-assistance"],
    "voice-input": ["maintenance-history", "expense-tracking"],
    "health-advanced": ["health-score", "predictive-maintenance"],
    "symptom-record": ["ai-doctor-basic", "maintenance-history"],
    "ai-doctor-full": ["ai-doctor-basic", "health-advanced"],
    "ai-image-analysis": ["ai-doctor-full", "symptom-record"],
    "ai-sound-analysis": ["ai-doctor-full", "symptom-record"],
    "predictive-maintenance": ["health-advanced", "reminders"],
    "repair-cost-estimate": ["service-cost-estimate", "ai-doctor-full"],
    "service-cost-estimate": ["repair-cost-estimate", "provider-search"],
    "accident-record": ["claim-history", "passport"],
    "claim-history": ["accident-record", "claim-assistant"],
    "claim-assistant": ["claim-history", "roadside-assistance"],
    "roadside-assistance": ["emergency-contacts", "claim-assistant"],
    "depreciation-preview": ["vehicle-value-today", "future-value-forecast"],
    "vehicle-value-today": ["depreciation-preview", "resale-price"],
    "future-value-forecast": ["vehicle-value-today", "keep-vs-sell"],
    "resale-price": ["vehicle-value-today", "trade-in-estimate"],
    "trade-in-estimate": ["resale-price", "vehicle-equity"],
    "outstanding-finance": ["vehicle-equity", "finance-basic"],
    "vehicle-equity": ["outstanding-finance", "vehicle-value-today"],
    "keep-vs-sell": ["best-time-to-sell", "vehicle-equity"],
    "best-time-to-sell": ["keep-vs-sell", "resale-price"],
    "buyer-history-summary": ["passport", "health-report"],
    "health-report": ["health-score", "buyer-history-summary"],
    "transfer-checklist": ["transfer-vehicle", "passport"],
    "transfer-vehicle": ["passport-certified", "passport"],
    "passport-certified": ["passport", "health-report"],
    "total-loss-record": ["claim-history", "eol-checklist"],
    "eol-checklist": ["total-loss-record", "salvage-marketplace"],
    "salvage-marketplace": ["eol-checklist", "marketplace"],
    "service-booking": ["provider-search", "availability"],
    availability: ["service-booking", "provider-search"],
    "rating-review": ["provider-search", "provider-comparison"],
    payment: ["service-booking"],
    "insurance-marketplace": ["insurance", "insurance-record"],
    "provider-recommendation": ["provider-search", "health-score"],
  };
  return map[id] ?? ["marketplace"];
}
