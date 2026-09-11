import type { StatusLevel } from "./types";

export const TODAY = new Date("2026-09-11T09:00:00+07:00");

const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export function formatThaiDate(iso: string): string {
  const d = new Date(iso);
  const buddhistYear = d.getFullYear() + 543;
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${buddhistYear}`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const buddhistYear = (d.getFullYear() + 543).toString().slice(-2);
  return `${d.getDate()}/${d.getMonth() + 1}/${buddhistYear}`;
}

export function daysUntil(iso: string): number {
  const d = new Date(iso);
  const diff = d.getTime() - TODAY.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatBaht(n: number): string {
  return `฿${n.toLocaleString("en-US")}`;
}

export function statusFromDays(days: number): StatusLevel {
  if (days < 0) return "urgent";
  if (days <= 14) return "urgent";
  if (days <= 45) return "dueSoon";
  if (days <= 90) return "warning";
  return "healthy";
}

export function statusFromKm(remainingKm: number): StatusLevel {
  if (remainingKm < 0) return "urgent";
  if (remainingKm <= 500) return "urgent";
  if (remainingKm <= 2000) return "dueSoon";
  if (remainingKm <= 4000) return "warning";
  return "healthy";
}

export const STATUS_COLOR: Record<StatusLevel, string> = {
  healthy: "text-status-green",
  warning: "text-status-yellow",
  dueSoon: "text-status-orange",
  urgent: "text-status-red",
};

export const STATUS_BG: Record<StatusLevel, string> = {
  healthy: "bg-status-green/10",
  warning: "bg-status-yellow/10",
  dueSoon: "bg-status-orange/10",
  urgent: "bg-status-red/10",
};

export const STATUS_DOT: Record<StatusLevel, string> = {
  healthy: "bg-status-green",
  warning: "bg-status-yellow",
  dueSoon: "bg-status-orange",
  urgent: "bg-status-red",
};

export const STATUS_LABEL: Record<StatusLevel, string> = {
  healthy: "ปกติ",
  warning: "เฝ้าระวัง",
  dueSoon: "ใกล้ถึงรอบ",
  urgent: "ควรดำเนินการ",
};
