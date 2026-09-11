import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CarDataProvider } from "@/lib/store";
import { UIProvider } from "@/lib/uiStore";
import { PhoneFrame } from "@/components/PhoneFrame";

export const metadata: Metadata = {
  title: "Cars Doctor | หมอรถ",
  description: "Clickable prototype — สมุดชีวิตรถ + ผู้ช่วยดูแลรถ + AI หมอรถ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B1F33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <CarDataProvider>
          <UIProvider>
            <PhoneFrame>{children}</PhoneFrame>
          </UIProvider>
        </CarDataProvider>
      </body>
    </html>
  );
}
