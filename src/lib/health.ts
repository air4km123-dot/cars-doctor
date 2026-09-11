// Single source of truth for "how healthy is this car" — every score and status
// shown anywhere in the app (Home, Car Health, Product Map badges) is derived
// here from the same tracker/document state, never hand-set per screen.
import type { DocumentItem, HealthCategory, MaintenanceEvent, PassportEvent, StatusLevel, TrackerInfo, TrackerKey } from "./types";
import { daysUntil } from "./utils";

const CATEGORY_LABEL: Record<TrackerKey, string> = {
  oil: "เครื่องยนต์ / น้ำมันเครื่อง",
  battery: "แบตเตอรี่",
  tire: "ยาง",
  brake: "เบรก",
  aircon: "ระบบแอร์",
  injector: "หัวฉีด",
};

const CATEGORY_WEIGHT: Record<TrackerKey, number> = {
  oil: 1.0,
  battery: 1.3,
  tire: 1.2,
  brake: 1.3,
  aircon: 0.7,
  injector: 0.8,
};
const LEGAL_WEIGHT = 1.0;

function statusFromFraction(fraction: number): StatusLevel {
  if (fraction < 0) return "urgent";
  if (fraction < 0.2) return "dueSoon";
  if (fraction < 0.45) return "warning";
  return "healthy";
}

function scoreFromFraction(fraction: number): number {
  const raw = fraction >= 0 ? 60 + fraction * 40 : 60 + fraction * 80;
  return Math.max(5, Math.min(98, Math.round(raw)));
}

function trackerFraction(t: TrackerInfo, currentMileage: number): number {
  const kmFraction = (t.nextDueMileage - currentMileage) / t.intervalKm;
  const dateFraction = daysUntil(t.nextDueDate) / (t.intervalMonths * 30);
  return Math.min(kmFraction, dateFraction);
}

function summaryFor(status: StatusLevel, label: string): string {
  if (status === "urgent") return `เกินรอบ ควรดำเนินการโดยเร็ว`;
  if (status === "dueSoon") return `ใกล้ถึงรอบ ควรวางแผนเข้ารับบริการ`;
  if (status === "warning") return `เริ่มเข้าใกล้รอบ ยังไม่เร่งด่วน`;
  return `อยู่ในเกณฑ์ดี ยังไม่ต้องดำเนินการ`;
}

// Bridges a Health category to the matching AI Cars Doctor prompt, so "Action
// Required" can jump straight into a relevant diagnosis in one click.
export const CATEGORY_AI_PROMPT: Record<TrackerKey, string> = {
  oil: "น้ำมันเครื่องใกล้ครบรอบเปลี่ยนถ่าย ควรทำอย่างไร?",
  battery: "สตาร์ทไม่ติดตอนเช้า",
  tire: "ยางควรสลับหรือเปลี่ยนเมื่อไหร่?",
  brake: "เบรกมีเสียงดังตอนเหยียบ",
  aircon: "แอร์ไม่เย็นเหมือนเดิม",
  injector: "รถสั่นตอนจอดเกิดจากอะไร?",
};

const LEGAL_DOC_CATEGORIES: DocumentItem["category"][] = ["insurance", "cmi", "roadtax", "inspection", "warranty", "license"];

function legalCategory(documents: DocumentItem[]): HealthCategory {
  const tracked = documents.filter((d) => LEGAL_DOC_CATEGORIES.includes(d.category));
  const expired = tracked.filter((d) => d.status === "expired").length;
  const dueSoon = tracked.filter((d) => d.status === "dueSoon").length;
  const score = Math.max(10, Math.min(100, 100 - dueSoon * 10 - expired * 25));
  const status: StatusLevel = score >= 85 ? "healthy" : score >= 70 ? "warning" : score >= 50 ? "dueSoon" : "urgent";
  const summary =
    expired > 0
      ? `มีเอกสารหมดอายุ ${expired} รายการ`
      : dueSoon > 0
      ? `มีเอกสารใกล้หมดอายุ ${dueSoon} รายการ`
      : "เอกสารทุกรายการเป็นปัจจุบัน";
  return { key: "legal", label: "เอกสาร / กฎหมาย", score, status, summary };
}

export interface HealthResult {
  overall: number;
  tier: "excellent" | "good" | "watch" | "urgent";
  tierLabel: string;
  categories: HealthCategory[];
  groups: HealthGroup[];
}
export interface HealthGroup {
  key: string;
  label: string;
  icon: string;
  score: number;
  status: StatusLevel;
  members: HealthCategory[];
}

const GROUP_DEF: { key: string; label: string; icon: string; members: TrackerKey[] }[] = [
  { key: "engine", label: "เครื่องยนต์และของเหลว", icon: "🔧", members: ["oil", "injector", "aircon"] },
  { key: "brake", label: "ระบบเบรก", icon: "🛑", members: ["brake"] },
  { key: "tire", label: "ยาง", icon: "🛞", members: ["tire"] },
  { key: "battery", label: "แบตเตอรี่", icon: "🔋", members: ["battery"] },
];

export function tierFromScore(score: number): { tier: HealthResult["tier"]; label: string } {
  if (score >= 90) return { tier: "excellent", label: "ดีเยี่ยม" };
  if (score >= 75) return { tier: "good", label: "ดี" };
  if (score >= 55) return { tier: "watch", label: "ควรเฝ้าระวัง" };
  return { tier: "urgent", label: "ต้องดำเนินการด่วน" };
}

export function computeHealth(trackers: TrackerInfo[], documents: DocumentItem[], currentMileage: number): HealthResult {
  const trackerCategories: HealthCategory[] = trackers.map((t) => {
    const fraction = trackerFraction(t, currentMileage);
    const status = statusFromFraction(fraction);
    return {
      key: t.key,
      label: CATEGORY_LABEL[t.key],
      score: scoreFromFraction(fraction),
      status,
      summary: summaryFor(status, CATEGORY_LABEL[t.key]),
    };
  });
  const legal = legalCategory(documents);
  const categories = [...trackerCategories, legal];

  let weightedSum = 0;
  let weightTotal = 0;
  trackerCategories.forEach((c) => {
    const w = CATEGORY_WEIGHT[c.key as TrackerKey];
    weightedSum += c.score * w;
    weightTotal += w;
  });
  weightedSum += legal.score * LEGAL_WEIGHT;
  weightTotal += LEGAL_WEIGHT;
  const overall = Math.round(weightedSum / weightTotal);
  const { tier, label } = tierFromScore(overall);

  const groups: HealthGroup[] = GROUP_DEF.map((g) => {
    const members = categories.filter((c) => g.members.includes(c.key as TrackerKey));
    const score = Math.round(members.reduce((s, m) => s + m.score, 0) / members.length);
    const worst = [...members].sort((a, b) => a.score - b.score)[0];
    return { key: g.key, label: g.label, icon: g.icon, score, status: worst.status, members };
  });

  return { overall, tier, tierLabel: label, categories, groups };
}

// Rewards a car record that's actually been kept up: more history, more
// documents on file, more passport events all push this toward 100.
export function computeCompletenessIndex(maintenanceEvents: MaintenanceEvent[], documents: DocumentItem[], passportEvents: PassportEvent[]): number {
  const maintScore = (Math.min(maintenanceEvents.length, 8) / 8) * 40;
  const docScore = (Math.min(documents.length, 10) / 10) * 30;
  const passportScore = (Math.min(passportEvents.length, 13) / 13) * 30;
  return Math.round(Math.min(100, maintScore + docScore + passportScore));
}
