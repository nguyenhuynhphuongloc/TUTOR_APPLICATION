"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  PeriodicTestAttempt,
  PlacementAttempt,
  Test,
} from "@/payload-types";
import { StoreProvider, useStore } from "@/zustand/placement-test/provider";
import { format } from "date-fns";
import { BookTextIcon, HeadphonesIcon, MicIcon, PenIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type JSX } from "react";
import ListeningResult from "./listening";
import ReadingResult from "./reading";
import SpeakingResult from "./speaking";
import WritingResult from "./writing";

interface TabSkill {
  name: string;
  icon: JSX.Element;
  value: "reading" | "listening" | "speaking" | "writing";
}

const tabs: TabSkill[] = [
  {
    name: "Listening",
    icon: <HeadphonesIcon />,
    value: "listening",
  },
  {
    name: "Reading",
    icon: <BookTextIcon />,
    value: "reading",
  },
  {
    name: "Writing",
    icon: <PenIcon />,
    value: "writing",
  },
  {
    name: "Speaking",
    icon: <MicIcon />,
    value: "speaking",
  },
];

const componentResolver = {
  listening: ListeningResult,
  speaking: SpeakingResult,
  writing: WritingResult,
  reading: ReadingResult,
};

function PeriodicTestResult({
  tests,
  data,
  questionMap,
  testResult,
  allAttempts,
}: {
  data: PlacementAttempt;
  tests: Test[];
  questionMap: Record<
    "listening" | "reading" | "writing" | "speaking",
    Record<string, number>
  >;
  testResult: any;
  allAttempts: PeriodicTestAttempt[];
}) {
  const router = useRouter();
  const testSkills = tests.map((s) => s.type);
  const filteredTabs = tabs.filter(
    (tab) => testSkills.includes(tab.value) && Boolean(testResult[tab.value]),
  );
  const [currentTab, setCurrentTabs] = useState(filteredTabs[0]);
  const Component =
    currentTab && componentResolver[currentTab.value]
      ? componentResolver[currentTab.value]
      : null;
  const currentSkill = tests.find((s) => s.type === currentTab?.value);

  const setQuestionNo = useStore((s) => s.setQuestionNoMap);

  setQuestionNo(questionMap);

  const handleBack = () => {
    router.push(
      ["homework", "extra_homework"].includes(data.type)
        ? "/student/exercise"
        : "/student/question-bank",
    );
  };

  return (
    <StoreProvider
      initialState={{
        questionNoMap: questionMap as any,
        answerSheetFull: testResult || {},
        navigation: {
          currentSkill: currentTab
            ? tests.findIndex((s) => s.type === currentTab.value)
            : 0,
          currentSection: 0,
          timeLeft: 0,
        },
      }}
    >
      <div>
        <div className="h-[81px] shadow-[0_0_60px_0_rgba(0,0,0,0.05)] px-6 flex items-center justify-between">
          <Image src="/logo.svg" alt="logo-white" width={94} height={49} />
          <Button className="h-10 rounded-[12px]" onClick={handleBack}>
            Back to home{" "}
            <Image src="/send.svg" alt="send" width={16} height={16} />
          </Button>
        </div>

        <div className="pt-4 px-6 w-full">
          <div className="text-[14px]">
            Thời gian nộp bài:{" "}
            <b>
              {data.completedAt &&
                format(data.completedAt, "HH:mm:ss - dd/MM/yyyy")}
            </b>
          </div>
          <div className="flex items-center justify-center mt-2 gap-4 w-full">
            {filteredTabs.map((tab) => (
              <div
                key={tab.name}
                className={cn(
                  "transition-colors duration-200 hover:bg-[#E729291A] hover:border-[#E72929] cursor-pointer w-[113px] h-[48px] border border-[#E7EAE9] text-[#6D737A] hover:text-[#E72929] rounded-[10px] flex items-center justify-center gap-2",
                  tab.value === currentTab?.value
                    ? "bg-[#E729291A] border-[#E72929] text-[#E72929]"
                    : "",
                )}
                onClick={() => setCurrentTabs(tab)}
              >
                {tab.icon}
                <p className="text-center font-semibold text-[16px]">
                  {tab.name}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <div className="text-[32px] font-bold">{currentSkill?.name}</div>
            {Component && currentSkill && (
              <Component
                data={data}
                test={currentSkill}
                allAttempts={allAttempts}
                currentAttemptId={data.id}
              />
            )}
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default PeriodicTestResult;
