"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/lib/uiStore";
import { IconCar, IconHistory, IconHome, IconPlus, IconStethoscope } from "./icons";

const TABS = [
  { href: "/", label: "หน้าหลัก", Icon: IconHome },
  { href: "/history", label: "ประวัติ", Icon: IconHistory },
];
const TABS_RIGHT = [
  { href: "/doctor/ai", label: "AI หมอรถ", Icon: IconStethoscope },
  { href: "/my-car", label: "รถของฉัน", Icon: IconCar },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomNavigation() {
  const pathname = usePathname();
  const { openQuickAdd } = useUI();

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-40">
      <div className="pointer-events-auto relative border-t border-border bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 items-end px-1 pt-2 pb-2">
          {TABS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-1 text-[10.5px] font-medium ${
                  active ? "text-navy" : "text-[#8A93A0]"
                }`}
              >
                <Icon active={active} />
                {label}
              </Link>
            );
          })}

          <div className="flex flex-col items-center justify-end">
            <button
              aria-label="เพิ่มข้อมูล"
              onClick={openQuickAdd}
              className="-mt-9 flex h-14 w-14 items-center justify-center rounded-full bg-navy shadow-fab active:scale-95 transition-transform"
            >
              <IconPlus />
            </button>
          </div>

          {TABS_RIGHT.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-1 text-[10.5px] font-medium ${
                  active ? "text-navy" : "text-[#8A93A0]"
                }`}
              >
                <Icon active={active} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
