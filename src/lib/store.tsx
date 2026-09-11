"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import {
  vehicle as initialVehicle,
  initialTrackers,
  initialMaintenanceEvents,
  initialExpenses,
  initialReminders,
  initialDocuments,
  initialPassportEvents,
  symptomRecords as initialSymptoms,
} from "./mockData";
import type {
  DocumentItem,
  Expense,
  MaintenanceEvent,
  PassportEvent,
  ReminderItem,
  SymptomRecord,
  TrackerInfo,
  TrackerKey,
  Vehicle,
} from "./types";
import { TODAY, formatThaiDate } from "./utils";
import { computeHealth, computeCompletenessIndex, type HealthResult } from "./health";

export interface QuickAddInput {
  trackerKey?: TrackerKey;
  category: MaintenanceEvent["category"];
  title: string;
  cost: number;
  mileage: number;
  location?: string;
}

export interface QuickAddResultStep {
  label: string;
  detail: string;
}

interface CarDataState {
  vehicle: Vehicle;
  trackers: TrackerInfo[];
  maintenanceEvents: MaintenanceEvent[];
  expenses: Expense[];
  reminders: ReminderItem[];
  documents: DocumentItem[];
  passportEvents: PassportEvent[];
  symptomRecords: SymptomRecord[];
  health: HealthResult;
  completenessIndex: number;
}

interface CarDataContextValue extends CarDataState {
  applyQuickAdd: (input: QuickAddInput) => QuickAddResultStep[];
  addFuelExpense: (liters: number, pricePerLiter: number, mileage: number) => void;
  addDocument: (doc: DocumentItem) => void;
  addExpenseManual: (category: Expense["category"], title: string, amount: number) => void;
  updateMileage: (mileage: number) => void;
  addSymptomRecord: (title: string, severity: SymptomRecord["severity"], notes?: string) => void;
  addReminderCustom: (title: string, dueDate?: string, dueMileage?: number) => void;
}

const CarDataContext = createContext<CarDataContextValue | null>(null);

const TODAY_ISO = TODAY.toISOString().slice(0, 10);

function addMonths(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

let idCounter = 1000;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}

export function CarDataProvider({ children }: { children: React.ReactNode }) {
  const [vehicle, setVehicle] = useState<Vehicle>(initialVehicle);
  const [trackers, setTrackers] = useState<TrackerInfo[]>(initialTrackers);
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>(initialMaintenanceEvents);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [reminders, setReminders] = useState<ReminderItem[]>(initialReminders);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [passportEvents, setPassportEvents] = useState<PassportEvent[]>(initialPassportEvents);
  const [symptoms, setSymptoms] = useState<SymptomRecord[]>(initialSymptoms);

  const health = useMemo(() => computeHealth(trackers, documents, vehicle.mileage), [trackers, documents, vehicle.mileage]);
  const completenessIndex = useMemo(
    () => computeCompletenessIndex(maintenanceEvents, documents, passportEvents),
    [maintenanceEvents, documents, passportEvents]
  );

  function applyQuickAdd(input: QuickAddInput): QuickAddResultStep[] {
    const steps: QuickAddResultStep[] = [];
    const newMileage = Math.max(vehicle.mileage, input.mileage);

    // 1. Maintenance history
    const event: MaintenanceEvent = {
      id: nextId("m"),
      category: input.category,
      title: input.title,
      date: TODAY_ISO,
      mileage: input.mileage,
      cost: input.cost,
      location: input.location,
    };
    setMaintenanceEvents((prev) => [event, ...prev]);
    steps.push({ label: "Maintenance History Updated", detail: `เพิ่มรายการ "${input.title}" แล้ว` });

    // 2. Expense
    if (input.cost > 0) {
      setExpenses((prev) => [
        { id: nextId("e"), category: "maintenance", title: input.title, date: TODAY_ISO, amount: input.cost },
        ...prev,
      ]);
      steps.push({ label: "Expense Updated", detail: `เพิ่มค่าใช้จ่าย +${input.cost.toLocaleString()} บาท` });
    }

    // 3. Tracker
    if (input.trackerKey) {
      setTrackers((prev) =>
        prev.map((t) => {
          if (t.key !== input.trackerKey) return t;
          const nextDueMileage = input.mileage + t.intervalKm;
          const nextDueDate = addMonths(TODAY_ISO, t.intervalMonths);
          return {
            ...t,
            lastDate: TODAY_ISO,
            lastMileage: input.mileage,
            nextDueMileage,
            nextDueDate,
            status: "healthy",
          };
        })
      );
      const trackerLabel = trackers.find((t) => t.key === input.trackerKey)?.label ?? input.title;
      steps.push({ label: `${trackerLabel} Tracker Updated`, detail: "รีเซ็ตรอบติดตามใหม่จากข้อมูลล่าสุด" });

      // 4. Health score — recomputed automatically from the tracker update above
      // (see lib/health.ts), no separate mutation needed here.
      steps.push({ label: "Car Health Updated", detail: "คะแนนสุขภาพรถคำนวณใหม่จากข้อมูลล่าสุดโดยอัตโนมัติ" });

      // 5. Reminder — replace old one for this category, create fresh
      setReminders((prev) => {
        const filtered = prev.filter((r) => !(r.category === "maintenance" && r.icon === trackers.find((t) => t.key === input.trackerKey)?.icon));
        const tracker = trackers.find((t) => t.key === input.trackerKey);
        return [
          {
            id: nextId("r"),
            title: `รอบถัดไป: ${tracker?.label ?? input.title}`,
            type: "mileage",
            dueMileage: input.mileage + (tracker?.intervalKm ?? 10000),
            category: "maintenance",
            status: "healthy",
            icon: tracker?.icon ?? "🔧",
          },
          ...filtered,
        ];
      });
      steps.push({ label: "Next Reminder Created", detail: "ตั้งการแจ้งเตือนรอบถัดไปให้อัตโนมัติ" });
    }

    // 6. Vehicle mileage
    if (newMileage !== vehicle.mileage) {
      setVehicle((prev) => ({ ...prev, mileage: newMileage }));
    }

    // 7. Vehicle Passport
    setPassportEvents((prev) => [
      {
        id: nextId("p"),
        date: TODAY_ISO,
        type: "maintenance",
        title: input.title,
        detail: `${input.location ?? "บันทึกโดยเจ้าของรถ"} ที่เลขไมล์ ${input.mileage.toLocaleString()} กม.`,
        icon: trackers.find((t) => t.key === input.trackerKey)?.icon ?? "🔧",
        source: "Quick Add",
      },
      ...prev,
    ]);
    steps.push({ label: "Vehicle Passport Updated", detail: `เพิ่มเหตุการณ์ใหม่วันที่ ${formatThaiDate(TODAY_ISO)}` });

    return steps;
  }

  function addFuelExpense(liters: number, pricePerLiter: number, mileage: number) {
    const totalCost = Math.round(liters * pricePerLiter);
    setExpenses((prev) => [
      { id: nextId("e"), category: "fuel", title: "เติมน้ำมัน", date: TODAY_ISO, amount: totalCost },
      ...prev,
    ]);
    setVehicle((prev) => ({ ...prev, mileage: Math.max(prev.mileage, mileage) }));
  }

  function addDocument(doc: DocumentItem) {
    setDocuments((prev) => [doc, ...prev]);
  }

  function addExpenseManual(category: Expense["category"], title: string, amount: number) {
    setExpenses((prev) => [{ id: nextId("e"), category, title, date: TODAY_ISO, amount }, ...prev]);
  }

  function updateMileage(mileage: number) {
    setVehicle((prev) => ({ ...prev, mileage: Math.max(prev.mileage, mileage) }));
  }

  function addSymptomRecord(title: string, severity: SymptomRecord["severity"], notes?: string) {
    setSymptoms((prev) => [{ id: nextId("s"), title, date: TODAY_ISO, severity, notes: notes ?? "" }, ...prev]);
  }

  function addReminderCustom(title: string, dueDate?: string, dueMileage?: number) {
    setReminders((prev) => [
      {
        id: nextId("r"),
        title,
        type: dueDate ? "date" : "mileage",
        dueDate,
        dueMileage,
        category: "custom",
        status: "warning",
        icon: "🔔",
      },
      ...prev,
    ]);
  }

  const value = useMemo<CarDataContextValue>(
    () => ({
      vehicle,
      trackers,
      maintenanceEvents,
      expenses,
      reminders,
      documents,
      passportEvents,
      symptomRecords: symptoms,
      health,
      completenessIndex,
      applyQuickAdd,
      addFuelExpense,
      addDocument,
      addExpenseManual,
      updateMileage,
      addSymptomRecord,
      addReminderCustom,
    }),
    [vehicle, trackers, maintenanceEvents, expenses, reminders, documents, passportEvents, symptoms, health, completenessIndex]
  );

  return <CarDataContext.Provider value={value}>{children}</CarDataContext.Provider>;
}

export function useCarData() {
  const ctx = useContext(CarDataContext);
  if (!ctx) throw new Error("useCarData must be used within CarDataProvider");
  return ctx;
}
