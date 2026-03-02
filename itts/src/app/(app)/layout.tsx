import { type Metadata } from "next";
import { Bebas_Neue, Belanosima, Public_Sans } from "next/font/google";

import { QueryProvider } from "@/trpc/react";
import { AuthProvider } from "./_providers/Auth";

import "@/components/circle-progress-bar/styles.css";
import ToasterProvider from "@/components/toast/ToastProvider";
import { TourProvider } from "@/components/tour/tour";
import { isMobileUserAgent } from "@/lib/utils";
import "@/styles/globals.css";
import { StoreProvider } from "@/zustand/placement-test/provider";
import { headers } from "next/headers";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

const belanosima = Belanosima({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-belanosima",
});

export const metadata: Metadata = {
  title: "IELTS - The Tutors",
  description:
    "IELTS - The Tutors is your ultimate guide to IELTS success, offering expert tutoring, personalized study plans, and essential resources to help you achieve your target score with confidence. 🚀",
  icons: [{ rel: "icon", url: "/mini-icon.png" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const header = await headers();
  const userAgent: string = header.get("user-agent") ?? "";
  const isMobile = isMobileUserAgent(userAgent);

  if (isMobile) {
    return (
      <html
        lang="en"
        className={`${publicSans.variable} ${belanosima.variable} ${bebasNeue.variable}`}
      >
        <body className="flex min-h-screen items-center justify-center bg-white p-6 text-center">
          <div>
            <h2 className="text-2xl font-bold text-[#151515]">
              This app is not available on mobile and tablet
            </h2>
            <p className="mt-2 text-[#6D737A]">
              Please use a desktop device to access this application.
            </p>
          </div>
        </body>
      </html>
    );
  }
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${belanosima.variable} ${bebasNeue.variable}`}
    >
      <body className="font-sans">
        <div className="block">
          <StoreProvider>
            <TourProvider>
              <AuthProvider api="rest">
                <QueryProvider>{children}</QueryProvider>
              </AuthProvider>
            </TourProvider>
          </StoreProvider>
        </div>
        <ToasterProvider />
      </body>
    </html>
  );
}
