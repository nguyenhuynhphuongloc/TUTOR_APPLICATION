"use client";

import BrainstormModal from "@/components/modal/BrainstormModal";
import { useNote } from "@/components/note/NoteContext";
import { useTour } from "@/components/tour/tour";
import { Button } from "@/components/ui/button";
import {
  TIME_FORMAT_PLACEMENT_TEST_FULL,
  TIME_FORMAT_TEST_FULL_MAPPING,
} from "@/constants";
import { cn } from "@/lib/utils";
import { useStore } from "@/zustand/placement-test/provider";
import { add, differenceInSeconds } from "date-fns";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import CountdownTimer from "./countdown-timer";
import { ReviewAnswer } from "./review-answer";

// Listening, Reading, Writing, Speaking

export default function ActionBar({
  // isTourCompleted,
  mode,
  testSkills,
  time,
  brainstormData,
}: {
  mode?: string;
  testSkills?: { type: string; data: any }[];
  time?: string;
  brainstormData?: any;
  // isTourCompleted: boolean;
}) {
  console.log("brainstormData", brainstormData);
  const timeLeft = useStore((s) => s.navigation.timeLeft);
  const currentSkill = useStore((s) => s.navigation.currentSkill);

  const setTimeLeft = useStore((s) => s.setTimeLeft);
  const decreaseTimeLeft = useStore((s) => s.decreaseTimeLeft);
  const setCurrentSkill = useStore((s) => s.setCurrentSkill);
  const { notes, openModal } = useNote();
  const { isTourCompleted, forceStartTour, currentStep } = useTour();

  useEffect(() => {
    console.log(
      "[TIMER-DEBUG] currentSkill changed to:",
      currentSkill,
      "Current timeLeft in store:",
      timeLeft,
    );

    // Chỉ khởi tạo lại timer nếu timeLeft hiện tại đang là 0 (chưa có dữ liệu restore hoặc vừa chuyển skill)
    if (timeLeft === 0) {
      const currentSkillType = testSkills?.[currentSkill]?.type;
      const defaultMinutes =
        mode === "practice"
          ? Number(time)
          : currentSkillType
            ? TIME_FORMAT_TEST_FULL_MAPPING[
                currentSkillType as keyof typeof TIME_FORMAT_TEST_FULL_MAPPING
              ]
            : TIME_FORMAT_PLACEMENT_TEST_FULL[currentSkill];

      console.log(
        "[TIMER-DEBUG] timeLeft is 0, session type:",
        currentSkillType,
        "initializing with default minutes:",
        defaultMinutes,
      );

      const seconds = differenceInSeconds(
        add(new Date(), {
          minutes: defaultMinutes || 0,
          seconds: 0,
        }),
        new Date(),
      );

      console.log("[TIMER-DEBUG] Calculated seconds to set:", seconds);
      setTimeLeft(seconds);
    } else {
      console.log(
        "[TIMER-DEBUG] timeLeft is already set (Restored), skipping initialization.",
      );
    }
  }, [currentSkill]);

  useEffect(() => {
    if (!isTourCompleted || currentStep !== -1) {
      console.log(
        "[TIMER-DEBUG] Timer paused. isTourCompleted:",
        isTourCompleted,
        "currentStep:",
        currentStep,
      );
      return;
    }

    console.log("[TIMER-DEBUG] Starting countdown interval...");
    const interval = setInterval(() => {
      decreaseTimeLeft();
    }, 1000);

    return () => {
      console.log("[TIMER-DEBUG] Clearing countdown interval");
      clearInterval(interval);
    };
  }, [isTourCompleted, currentStep]);

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-10 h-[80px] w-full bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 py-4">
        <div className="flex-1">
          <Image src="/logo.png" width={94} height={49} alt="logo" />
        </div>
        <CountdownTimer timeLeft={timeLeft} />
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* <Button variant="ghost" size="icon">
            <Image
              src="/icons/task-square.svg"
              width={24}
              height={24}
              alt="task-square"
            />
          </Button> */}
          {mode === "practice" && brainstormData && (
            <BrainstormModal brainstorm={brainstormData}>
              <Button
                variant="ghost"
                size="icon"
                title="Brainstorm"
                className="text-amber-500 hover:text-amber-600"
              >
                <Image
                  src="/icons/light-bulb.svg"
                  width={24}
                  height={24}
                  alt="light-bulb"
                />{" "}
              </Button>
            </BrainstormModal>
          )}
          {notes.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={openModal}
            >
              <Image src="/icons/note.svg" width={24} height={24} alt="note" />
            </Button>
          )}
          {(currentSkill === 0 || currentSkill === 1) && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              onClick={forceStartTour}
              title="Xem hướng dẫn"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
          )}
          <ReviewAnswer timeLeft={timeLeft} testSkills={testSkills} />
        </div>
      </div>
    </header>
  );
}
