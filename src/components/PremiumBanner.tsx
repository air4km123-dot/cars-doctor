"use client";

import { useUI } from "@/lib/uiStore";

export function PremiumBanner({ description }: { description: string }) {
  const { showToast } = useUI();
  return (
    <div className="rounded-2xl border border-[#F0C419]/40 bg-[#3A2E0B] p-4 text-white">
      <div className="mb-1 flex items-center gap-1.5 text-[12px] font-bold text-[#F0C419]">★ PREMIUM FEATURE</div>
      <p className="mb-3 text-[13px] leading-relaxed text-white/85">{description}</p>
      <button
        onClick={() => showToast("นี่คือ Prototype สำหรับนำเสนอ — ยังไม่เปิดชำระเงินจริง")}
        className="w-full rounded-xl bg-[#F0C419] py-2.5 text-[13px] font-bold text-[#3A2E0B] active:scale-[0.98] transition-transform"
      >
        🔒 ปลดล็อกด้วย Cars Doctor Premium
      </button>
    </div>
  );
}

export function ComingSoonBanner({ description }: { description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="mb-1 text-[12px] font-bold text-ink/50">COMING SOON</div>
      <p className="text-[13px] leading-relaxed text-ink/70">{description}</p>
    </div>
  );
}

export function MarketplaceBanner({ description }: { description: string }) {
  return (
    <div className="rounded-2xl border border-navy/15 bg-navy/[0.04] p-4">
      <div className="mb-1 text-[12px] font-bold text-navy">MARKETPLACE</div>
      <p className="text-[13px] leading-relaxed text-ink/70">{description}</p>
    </div>
  );
}

export function NewIdeaBanner({ description }: { description: string }) {
  return (
    <div className="rounded-2xl border border-navy/20 bg-white p-4">
      <div className="mb-1 text-[12px] font-bold text-navy">NEW IDEA — เพิ่มจาก Competitor Research</div>
      <p className="text-[13px] leading-relaxed text-ink/70">{description}</p>
    </div>
  );
}
