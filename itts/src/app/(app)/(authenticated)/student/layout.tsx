"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav/TopNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import confetti from "@/lottie/confetti.json";
import { VocabularyProvider } from "@/app/(app)/_providers/Vocabulary";
import LottieAnimation from "@/components/lottie";
import confetti2 from "@/lottie/confetti2.json";
import { useEffect, useState } from "react";

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: confetti2,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("confettiShown");
    if (!alreadyShown) {
      setShowConfetti(true);
      localStorage.setItem("confettiShown", "true");
    }
  }, []);

  return (
    <SidebarProvider>
      {showConfetti && (
        <LottieAnimation
          options={defaultOptions}
          className="absolute bottom-5 z-[2]"
          isActive
          name="confetti"
        />
      )}

      <AppSidebar />
      <SidebarTrigger />

      <div className="mr-8 ml-2 w-full mb-8">
        <TopNav />
        <VocabularyProvider>{children}</VocabularyProvider>
      </div>
    </SidebarProvider>
  );
}
