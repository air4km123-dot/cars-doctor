"use client";

export function FormField({
  label,
  suffix,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  suffix?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number";
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink/70">{label}</span>
      <div className="flex items-center rounded-xl border border-border bg-white px-3.5 py-2.5 focus-within:border-navy">
        <input
          type={type}
          inputMode={type === "number" ? "numeric" : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[14.5px] font-medium text-ink outline-none"
        />
        {suffix && <span className="ml-2 shrink-0 text-[12.5px] text-ink/50">{suffix}</span>}
      </div>
    </label>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl bg-navy py-3.5 text-center text-[15px] font-bold text-white shadow-sm active:scale-[0.98] transition-transform disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border border-border bg-white py-3.5 text-center text-[15px] font-bold text-navy active:scale-[0.98] transition-transform ${className}`}
    >
      {children}
    </button>
  );
}
