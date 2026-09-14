"use client";

import { useRouter } from "next/navigation";
import { useCarData } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { IconChevronRight, IconClose } from "./icons";

function MenuRow({
  icon,
  title,
  subtitle,
  onClick,
  danger = false,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left active:bg-bg">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg text-[17px]">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-[13.5px] font-semibold ${danger ? "text-status-red" : "text-ink"}`}>{title}</p>
        {subtitle && <p className="truncate text-[11px] text-ink/45">{subtitle}</p>}
      </div>
      {!danger && <span className="text-ink/25"><IconChevronRight /></span>}
    </button>
  );
}

export function ProfileMenu() {
  const { profileMenuOpen, closeProfileMenu, showToast } = useUI();
  const { appUser } = useCarData();
  const router = useRouter();

  if (!profileMenuOpen) return null;

  function go(path: string) {
    closeProfileMenu();
    router.push(path);
  }

  return (
    <div className="absolute inset-0 z-50 flex justify-end">
      <div className="animate-fade-in absolute inset-0 bg-black/50" onClick={closeProfileMenu} />
      <div className="animate-slide-in-right no-scrollbar relative flex h-full w-[82%] max-w-[320px] flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="bg-navy px-5 pb-5 pt-[calc(env(safe-area-inset-top)+16px)] text-white">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[13px] font-bold text-white/70">บัญชีของฉัน</span>
            <button onClick={closeProfileMenu} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
              <IconClose />
            </button>
          </div>
          <button onClick={() => go("/profile")} className="flex w-full items-center gap-3 text-left active:opacity-80">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-[26px]">{appUser.avatar}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold">{appUser.name}</p>
              <p className="truncate text-[11.5px] text-white/60">{appUser.email}</p>
              <span className="mt-1 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white/80">แผน {appUser.plan}</span>
            </div>
          </button>
        </div>

        <div className="flex-1 space-y-1 px-3 py-3">
          <MenuRow icon="🧑" title="ข้อมูลส่วนตัว" subtitle="ชื่อ อีเมล เบอร์โทร" onClick={() => go("/profile")} />
          <MenuRow icon="⚙️" title="ตั้งค่า" subtitle="การแจ้งเตือน บัญชี ภาษา" onClick={() => go("/settings")} />
          <MenuRow icon="🛂" title="พาสปอร์ตรถ" subtitle="ดูประวัติรถแบบเต็ม" onClick={() => go("/passport")} />
          <MenuRow
            icon="⭐"
            title="Cars Doctor Premium"
            subtitle="ปลดล็อกฟีเจอร์ขั้นสูงทั้งหมด"
            onClick={() => {
              closeProfileMenu();
              showToast("นี่คือ Prototype สำหรับนำเสนอ — ยังไม่เปิดชำระเงินจริง");
            }}
          />
          <MenuRow
            icon="🆘"
            title="ช่วยเหลือ & ติดต่อเรา"
            onClick={() => {
              closeProfileMenu();
              showToast("นี่คือ Prototype — ยังไม่เปิดใช้งานช่องทางช่วยเหลือจริง");
            }}
          />
        </div>

        <div className="border-t border-border px-3 py-3">
          <MenuRow
            icon="🚪"
            title="ออกจากระบบ"
            danger
            onClick={() => {
              closeProfileMenu();
              showToast("นี่คือ Prototype — ยังไม่เปิดใช้งานระบบ Login จริง");
            }}
          />
          <p className="mt-2 px-2 text-[10px] text-ink/35">Cars Doctor Prototype · v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
