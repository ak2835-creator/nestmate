import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NestMate",
  description: "Shared living, without the awkward part.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-nm-sand">
        <div className="max-w-[430px] mx-auto min-h-screen bg-nm-cream shadow-[0_0_40px_rgba(0,0,0,0.08)]">
          {children}
        </div>
      </body>
    </html>
  );
}
