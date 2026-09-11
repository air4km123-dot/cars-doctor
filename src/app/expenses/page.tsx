"use client";

import { useMemo, useState } from "react";
import { useCarData } from "@/lib/store";
import { formatNumber, formatThaiDate, TODAY } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";
import { FormField, PrimaryButton, SecondaryButton } from "@/components/FormField";
import { Modal } from "@/components/Modal";
import type { Expense } from "@/lib/types";

const ADD_CATEGORIES: { key: Expense["category"]; label: string }[] = [
  { key: "parking", label: "ที่จอดรถ" },
  { key: "toll", label: "ทางด่วน" },
  { key: "carwash", label: "ล้างรถ" },
  { key: "tax", label: "ภาษี" },
  { key: "other", label: "อื่นๆ" },
];

const CATEGORY_LABEL: Record<string, string> = {
  fuel: "น้ำมัน",
  maintenance: "ซ่อมบำรุง",
  insurance: "ประกันภัย",
  tax: "ภาษี",
  parking: "ที่จอดรถ",
  toll: "ทางด่วน",
  carwash: "ล้างรถ",
  other: "อื่นๆ",
};
const CATEGORY_ICON: Record<string, string> = {
  fuel: "⛽",
  maintenance: "🔧",
  insurance: "🛡️",
  tax: "🏷️",
  parking: "🅿️",
  toll: "🛣️",
  carwash: "🚿",
  other: "💸",
};

export default function ExpensesPage() {
  const { expenses, addExpenseManual } = useCarData();
  const [addOpen, setAddOpen] = useState(false);
  const [category, setCategory] = useState<Expense["category"]>("parking");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  function saveExpense() {
    addExpenseManual(category, title || (ADD_CATEGORIES.find((c) => c.key === category)?.label ?? "ค่าใช้จ่ายอื่นๆ"), Number(amount) || 0);
    setTitle("");
    setAmount("");
    setAddOpen(false);
  }

  const thisYear = TODAY.getFullYear();
  const thisMonth = TODAY.getMonth();

  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
  });
  const yearExpenses = expenses.filter((e) => new Date(e.date).getFullYear() === thisYear);

  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const yearTotal = yearExpenses.reduce((s, e) => s + e.amount, 0);

  const breakdown = useMemo(() => {
    const map: Record<string, number> = {};
    yearExpenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map).sort(([, a], [, b]) => b - a);
  }, [yearExpenses]);
  const maxAmount = Math.max(...breakdown.map(([, v]) => v), 1);

  return (
    <div>
      <Header title="ค่าใช้จ่าย" />
      <div className="space-y-4 px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-[11px] font-semibold text-ink/45">เดือนนี้</p>
            <p className="mt-1 text-[18px] font-extrabold text-ink">฿{formatNumber(monthTotal)}</p>
          </Card>
          <Card>
            <p className="text-[11px] font-semibold text-ink/45">ปีนี้</p>
            <p className="mt-1 text-[18px] font-extrabold text-ink">฿{formatNumber(yearTotal)}</p>
          </Card>
        </div>

        <PrimaryButton onClick={() => setAddOpen(true)}>💸 เพิ่มค่าใช้จ่าย</PrimaryButton>

        <div>
          <SectionHeader title="แยกตามหมวด (ปีนี้)" />
          <Card className="space-y-2.5">
            {breakdown.map(([cat, amount]) => (
              <div key={cat}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-ink/60">{CATEGORY_ICON[cat]} {CATEGORY_LABEL[cat] ?? cat}</span>
                  <span className="font-bold text-ink">฿{formatNumber(amount)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-bg">
                  <div className="h-1.5 rounded-full bg-navy" style={{ width: `${(amount / maxAmount) * 100}%` }} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <SectionHeader title="รายการล่าสุด" />
          <Card className="divide-y divide-border">
            {[...expenses].slice(0, 10).map((e) => (
              <Row
                key={e.id}
                icon={CATEGORY_ICON[e.category] ?? "💸"}
                title={e.title}
                subtitle={formatThaiDate(e.date)}
                right={<span className="text-[12.5px] font-bold text-ink/70">฿{formatNumber(e.amount)}</span>}
              />
            ))}
          </Card>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <h2 className="mb-3 text-[16px] font-bold text-ink">เพิ่มค่าใช้จ่าย</h2>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {ADD_CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${category === c.key ? "bg-navy text-white" : "bg-bg text-ink/60"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <FormField label="รายการ" value={title} onChange={setTitle} placeholder="ระบุรายละเอียด" />
          <FormField label="จำนวนเงิน" suffix="บาท" type="number" value={amount} onChange={setAmount} />
          <PrimaryButton onClick={saveExpense}>บันทึก</PrimaryButton>
          <SecondaryButton onClick={() => setAddOpen(false)}>ยกเลิก</SecondaryButton>
        </div>
      </Modal>
    </div>
  );
}
