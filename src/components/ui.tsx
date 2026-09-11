import Link from "next/link";
import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white p-4 shadow-card ${className}`}>{children}</div>;
}

export function SectionHeader({ title, href, actionLabel = "ดูทั้งหมด" }: { title: string; href?: string; actionLabel?: string }) {
  return (
    <div className="mb-2.5 flex items-center justify-between px-1">
      <h2 className="text-[14.5px] font-bold text-ink">{title}</h2>
      {href && (
        <Link href={href} className="text-[12px] font-semibold text-navy">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

export function Row({
  icon,
  title,
  subtitle,
  right,
  href,
  onClick,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex items-center gap-3 py-2.5">
      {icon && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg text-[17px]">{icon}</div>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-ink">{title}</p>
        {subtitle && <p className="truncate text-[11.5px] text-ink/45">{subtitle}</p>}
      </div>
      {right}
      <span className="text-ink/25">›</span>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block active:bg-bg/60 -mx-1 px-1 rounded-xl">
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="block w-full text-left active:bg-bg/60 -mx-1 px-1 rounded-xl">
      {content}
    </button>
  );
}

export function HealthRing({ score, size = 88 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? "#2E9E5B" : score >= 60 ? "#F08A2C" : "#E14848";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#EDF0F3" strokeWidth={8} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] font-extrabold leading-none text-ink">{score}</span>
        <span className="text-[9px] font-semibold text-ink/40">/ 100</span>
      </div>
    </div>
  );
}

export function PillTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active ? "bg-navy text-white" : "bg-bg text-ink/55"
      }`}
    >
      {children}
    </button>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <div className="rounded-xl bg-bg px-3.5 py-3 text-center text-[12px] text-ink/45">{children}</div>;
}
