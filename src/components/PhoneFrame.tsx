import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { QuickAddSheet } from "./QuickAddSheet";
import { VoiceInputModal } from "./VoiceInputModal";
import { OCRModal } from "./OCRModal";
import { Toast } from "./Toast";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#E7EAEE] sm:p-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-bg sm:h-[926px] sm:max-h-[926px] sm:w-[428px] sm:rounded-[46px] sm:border-[6px] sm:border-black sm:shadow-2xl">
        {/* Dynamic island (desktop frame only) */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-50 hidden h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-black sm:block" />

        <div id="app-scroll" className="no-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden pb-[110px]">
          {children}
        </div>

        <BottomNavigation />
        <QuickAddSheet />
        <VoiceInputModal />
        <OCRModal />
        <Toast />
      </div>
    </div>
  );
}
