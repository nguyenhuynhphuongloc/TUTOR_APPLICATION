"use client";

import type {
  PeriodicTestAttempt,
  PlacementAttempt,
  Test,
} from "@/payload-types";
import type { ProgressItem } from "./types";

import dynamic from "next/dynamic";

import ActionBar from "./_components/action-bar";
import Content from "./_components/content";

const NoSSRProgressBar = dynamic(() => import("./_components/progress-bar"), {
  ssr: false,
});

import { EditorStateCacheProvider } from "@/components/editor/context/EditorStateCache";
import { NoteProvider } from "@/components/note/NoteContext";
import { NotePanelList } from "@/components/note/NotePanelList";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useStore } from "@/zustand/placement-test/provider";
import { useParams } from "next/navigation";
import { useMemo } from "react";

function Root({
  attempt,
  tests,
  progress,
  questionMap,
  testType,
}: {
  attempt: PlacementAttempt | PeriodicTestAttempt;
  tests: Test[];
  progress: ProgressItem[];
  questionMap: Record<
    "listening" | "reading" | "writing" | "speaking",
    Record<string, number>
  >;
  testType?: "placement" | "periodic";
}) {
  const params = useParams<{ leadId: string; testId: string }>();
  const currentSkill = useStore((s) => s.navigation.currentSkill);
  const currentSection = useStore((s) => s.navigation.currentSection);

  // Auto-save mỗi 3 phút
  useAutoSave({
    leadId: params.leadId,
    testId: attempt.id as string,
    enabled: true,
  });

  const testSkills = useMemo(
    () => tests.map((test) => ({ data: test[test.type], type: test.type })),
    [tests],
  );

  const pickedParts =
    (attempt as any).mode === "practice" &&
    (attempt as any).part &&
    (attempt as any).part !== "full"
      ? (attempt as any).part
          .split(",")
          .map((item: string) => parseInt(item.match(/\d+/)?.[0] ?? "", 10))
          .filter((n: number) => !isNaN(n))
          .sort((a: any, b: any) => a - b)
      : null;

  // Tính toán brainstorm data dựa trên skill và section hiện tại
  const brainstormData = useMemo(() => {
    const currentTest = tests[currentSkill];
    if (!currentTest) return null;

    const skillType = currentTest.type;
    const skillData = currentTest[skillType] as any;

    if (!skillData) return null;

    // Listening và Reading: brainstorm nằm trong từng phần tử array
    if (skillType === "listening" || skillType === "reading") {
      const sectionData = skillData[currentSection];
      return sectionData?.brainstorm || null;
    }

    // Writing: brainstorm nằm trong từng task
    if (skillType === "writing") {
      const taskData = skillData[currentSection];
      return taskData?.brainstorm || null;
    }

    return null;
  }, [tests, currentSkill, currentSection]);

  return (
    <EditorStateCacheProvider>
      <NoteProvider>
        <NotePanelList />
        <ActionBar
          mode={(attempt as any).mode}
          time={(attempt as any).time}
          testSkills={testSkills as any}
          brainstormData={brainstormData}
        />
        <div className="relative mt-[90px] mb-[100px] mx-auto max-w-[1440px] px-6">
          <Content data={tests as any} part={pickedParts} testType={testType} />
        </div>
        <NoSSRProgressBar data={progress} part={pickedParts} />
      </NoteProvider>
    </EditorStateCacheProvider>
  );
}

export default Root;
