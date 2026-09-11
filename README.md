# Cars Doctor | หมอรถ — Clickable Prototype

Front-end only prototype (Next.js 14 + TypeScript + Tailwind CSS) built for
executive demo/decision-making — **not** a production app. All data is mock
data wired through one shared in-memory store so the "Input Once → System
Uses Data Everywhere" concept can actually be demonstrated live.

## 1. วิธี Run

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000` — หน้าเว็บจะแสดงแอปอยู่ใน Mobile Phone Frame
(อิง iPhone 13 Pro Max, 428×926) กึ่งกลางจอ ถ้าเปิดบนมือถือจริงจะเต็มจอโดยอัตโนมัติ

```bash
npm run build   # production build / type-check ทั้งโปรเจกต์
npm start       # serve production build
```

## 2. Screen หลักมีอะไรบ้าง

Bottom Navigation 5 ตำแหน่ง (`src/components/BottomNavigation.tsx`):

| Tab | Route | ไฟล์ |
|---|---|---|
| หน้าหลัก | `/` | `src/app/page.tsx` |
| รถของฉัน | `/my-car`, `/my-car/wallet` | `src/app/my-car/**` |
| **+** (Quick Add) | Bottom Sheet ทุกหน้า | `src/components/QuickAddSheet.tsx` |
| หมอรถ | `/doctor`, `/doctor/health`, `/doctor/ai`, `/doctor/ai/full` | `src/app/doctor/**` |
| ประวัติ | `/history` | `src/app/history/page.tsx` |

Screen อื่น ๆ ที่สำคัญ:

- `/passport` — Vehicle Passport (Timeline ชีวิตรถ)
- `/maintenance`, `/tracker/[key]` — ประวัติบำรุงรักษา + Tracker แต่ละหมวด (oil, battery, tire, brake, aircon, injector)
- `/reminders`, `/legal-calendar` — การแจ้งเตือนและปฏิทินเอกสารรถ
- `/fuel`, `/expenses` — น้ำมันและค่าใช้จ่าย
- `/marketplace`, `/marketplace/providers` — Marketplace Preview
- `/sell` — ก่อนขายรถ (Checklist / มูลค่ารถ / โอนกรรมสิทธิ์)
- `/product-map` — **หน้าพิเศษสำหรับผู้บริหาร** สรุปฟีเจอร์ทั้งหมดตาม Lifecycle (เกิด → ใช้ชีวิต → เจ็บ → ก่อนขาย → ส่งต่อ → จบชีวิตรถ → Marketplace) พร้อม filter ตาม Badge
- `/feature/[id]` — Generic template สำหรับฟีเจอร์ที่เหลือทั้งหมด (Premium / Coming Soon / Marketplace / New Idea preview) ขับเคลื่อนจาก `src/lib/features.ts`

Global overlays (mount ครั้งเดียวใน `src/components/PhoneFrame.tsx`, ใช้ได้ทุกหน้า):

- `QuickAddSheet.tsx` — ปุ่ม + กลาง Bottom Nav
- `VoiceInputModal.tsx` — จำลอง Voice Input (สคริปต์ตัวอย่าง: เปลี่ยนแบตเตอรี่ 2,800 บาท เลขไมล์ 88,450)
- `OCRModal.tsx` — จำลอง OCR scan เอกสาร (ประกัน / พ.ร.บ. / ใบเสร็จ / ใบซ่อม / Warranty)

## 3. Mock Data อยู่ตรงไหน

ทุกอย่างมาจากแหล่งเดียว ห้ามมี hardcode แยกแต่ละหน้า:

- `src/lib/mockData.ts` — ข้อมูลตั้งต้นทั้งหมด: รถ (Toyota Corolla Cross HEV 2022,
  88,450 กม., Health 82/100), trackers, ประวัติซ่อมบำรุง, ค่าใช้จ่าย, เอกสาร,
  ผู้ให้บริการ, อุบัติเหตุ/เคลม, Vehicle Passport เริ่มต้น ฯลฯ
- `src/lib/types.ts` — TypeScript types ของโมเดลข้อมูลทั้งหมด
- `src/lib/utils.ts` — ตัวช่วยฟอร์แมตวันที่ไทย/ตัวเลข และคำนวณสถานะ (healthy/warning/dueSoon/urgent) — `TODAY` ถูก fix ไว้ที่ `2026-09-11` เพื่อให้ตัวเลขทุกหน้าตรงกัน

**State ที่แก้ไขได้จริงระหว่างใช้งาน** (เพื่อสาธิต Data Connection) อยู่ใน
`src/lib/store.tsx` (`CarDataProvider` / `useCarData()`) — เป็น React Context
ที่ครอบทั้งแอป เมื่อ Quick Add / Voice / OCR confirm ข้อมูลจะถูกอัปเดตที่นี่
จุดเดียว แล้วทุกหน้าที่ใช้ `useCarData()` จะเห็นข้อมูลใหม่ทันที (Home,
Maintenance, Tracker, Health, Reminders, Passport, Expenses ฯลฯ)

> หมายเหตุ: state อยู่ใน memory ของฝั่ง client เท่านั้น (ไม่มี backend/DB จริง
> ตามสโคปของ prototype) — การกด refresh browser หรือพิมพ์ URL ใหม่ตรง ๆ จะรีเซ็ต
> ข้อมูลกลับไปเป็นค่าตั้งต้น ให้ใช้การกดลิงก์ภายในแอป (Client-side navigation)
> เพื่อดู state ที่เชื่อมกันระหว่างหน้า

## 4. Feature Status จัดเก็บตรงไหน

`src/lib/features.ts` คือ **Feature Registry กลาง** ของทั้งโปรดักต์
(ครบทุกฟีเจอร์ตาม Product Map — Birth / Life / Sick / Pre-sell / Transfer /
EOL / Marketplace) แต่ละ entry มี:

```ts
{
  id, title, englishTitle, description,
  status: "FREE" | "PREMIUM" | "COMING_SOON" | "MARKETPLACE",
  newIdea?: boolean,
  stage: "birth" | "life" | "sick" | "presell" | "transfer" | "eol" | "marketplace",
  category, icon, route,
}
```

`/product-map` และ Header Badge (`src/components/Badge.tsx`,
`src/components/Header.tsx`) อ่านค่าจากตรงนี้โดยตรง —
เปลี่ยน `status`/`newIdea` ที่เดียว จะอัปเดตทั้ง Badge บนหน้า Feature และ
Product Map พร้อมกัน

เนื้อหาตัวอย่าง/Preview ของแต่ละฟีเจอร์ (ข้อความอธิบาย Premium, Coming Soon,
Marketplace, ตัวอย่างผลลัพธ์) อยู่ใน:

- `src/components/PremiumBanner.tsx` — banner 4 แบบ (Premium/ComingSoon/Marketplace/NewIdea)
- `src/components/FeatureExtra.tsx` — เนื้อหาตัวอย่าง/Interactive preview เฉพาะของแต่ละฟีเจอร์ (ประมาณ 50 ฟีเจอร์) เช่น Loan Calculator, Pre-trip Checklist, AI Image/Sound mock analysis, Vehicle Equity ฯลฯ

## 5. จะเพิ่ม Feature ใหม่ตรงไหน

1. เพิ่ม entry ใหม่ใน `src/lib/features.ts` (กำหนด `status`, `stage`, `route`)
   — จะไปโผล่ใน Product Map ทันที
2. ถ้าใช้ path เริ่มต้น `/feature/[id]` (ค่า default) ไม่ต้องสร้างหน้าใหม่เลย
   — ระบบจะ render ผ่าน `src/app/feature/[id]/page.tsx` อัตโนมัติ
   (แสดง Header + Badge + Description + Banner ตาม status)
3. ถ้าอยากมี preview/ตัวอย่างเฉพาะของฟีเจอร์นั้น ให้เพิ่ม `case` ใหม่ใน
   `src/components/FeatureExtra.tsx`
4. ถ้าฟีเจอร์ต้องมี custom flow/state เต็มรูปแบบ (เหมือน Health Score,
   AI Doctor, Passport) ให้สร้างโฟลเดอร์ใหม่ใน `src/app/` แล้วตั้ง `route`
   ใน registry ให้ชี้ไปที่ path นั้นแทน

## 6. Component หลัก (`src/components/`)

`AppShell` แยกเป็น `PhoneFrame` (กรอบมือถือ + responsive), `BottomNavigation`,
`Header` (ระบบ Header เดียวกันทั้งแอปตาม spec ข้อ 11), `Badge`, `StatusChip`,
`ui.tsx` (Card/Row/HealthRing/SectionHeader/PillTab), `QuickAddSheet`,
`VoiceInputModal`, `OCRModal`, `PremiumBanner`, `ProductMapCard`, `FormField`

## 7. Known Limitations (ตามสโคป Prototype)

ไม่มี Backend/Database จริง, ไม่มี Login จริง, ไม่มี Payment จริง, ไม่มี OCR/AI/
DLT/Insurance/Maps API จริง — ทั้งหมด mock ตามที่ระบุในสเปกข้อ 96
