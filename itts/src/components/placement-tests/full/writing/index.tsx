"use client";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";

import { Media } from "@/components/media";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/zustand/placement-test/provider";
import { isFunction } from "lodash-es";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Answer, EditorValue, SkillAnswers } from "../../types";

function Question({
  id,
  task,
  filledAnswers,
  setAnswer,
}: {
  id: string | undefined | null;
  task: number;
  filledAnswers?: SkillAnswers;
  setAnswer: (payload: Answer) => void;
}) {
  const [value, setValue] = useState("");
  const deferredValue = useDeferredValue(value);
  const wordCount = useMemo(
    () =>
      deferredValue
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    [deferredValue],
  );

  useEffect(() => {
    if (!id) return;
    const filledAnswer = filledAnswers?.[task]?.answer;
    if (!filledAnswer) return;

    setValue(filledAnswer);
  }, [filledAnswers]);

  useEffect(() => {
    if (!id) return;
    if (!isFunction(setAnswer)) return;

    setAnswer({
      id,
      questionNumber: 1,
      answer: deferredValue,
      type: "writing",
      correctAnswers: undefined,
      isCorrect: false,
    });
  }, [deferredValue]);

  return (
    <>
      <div className="h-[45px] text-white font-bold text-center border border-[#E72929] p-3 bg-[#E72929] rounded-t-[12px]">
        Your Answer
      </div>
      <Textarea
        placeholder="Write your answer here..."
        className="w-full rounded-t-none rounded-b-[12px] border-[#E0E0E0] border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#E72929] resize-none transition-colors"
        rows={20}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          event.preventDefault();
          setValue(event.target.value);
        }}
        onPaste={(e) => {
          e.preventDefault();
        }}
      />
      <div className="mt-4 font-medium text-[16px] text-[#151515]">
        Words Count: {wordCount}
      </div>
    </>
  );
}

function Writing({ writing, pickedParts }: any) {
  const selectedSection = useStore(
    useShallow((s) => s.navigation.currentSection),
  );
  const filledAnswers = useStore(useShallow((s) => s.answerSheetFull.writing));

  const setAnswer = useStore(useShallow((state) => state.setAnswer));
  const setSection = useStore(useShallow((s) => s.setSection));

  const currentSection = writing?.[selectedSection];

  useEffect(() => {
    if (!pickedParts) return;
    setSection(pickedParts[0] - 1);
  }, []);

  if (!currentSection) {
    return null;
  }

  const { id, description, content, writingType, image } = currentSection;
  const task = selectedSection + 1;

  const setWritingAnswer = ({ questionNumber, ...payload }: Answer) => {
    setAnswer("writing", task, payload, String(task));
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      key={id}
      className="grid  grid-cols-[1fr_auto_1fr]"
    >
      <ResizablePanel>
        <ScrollArea className="h-[calc(100vh-116px-80px)] w-full">
          <div className="flex flex-col gap-10 pr-2">
            <div>
              <div className="text-[32px] font-bold text-[#151515]">
                Writing Task {writingType}
              </div>
              <Editor
                value={description as EditorValue}
                theme={previewEditorTheme}
                mode="practice"
              />
            </div>
            <div className="">
              {image && typeof image !== "string" && (
                <div className="relative mb-4 min-h-[360px] w-full select-none">
                  <Media
                    fill
                    className=""
                    imgClassName="rounded-[12px] object cover !relative"
                    resource={image}
                  />
                </div>
              )}
              <Editor
                value={content as EditorValue}
                theme={previewEditorTheme}
                mode="practice"
              />
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle className="border-l border-dashed border-[#CBCBCB] mx-2 h-[calc(100vh-116px-80px)]"></ResizableHandle>
      <ResizablePanel className="p-6">
        <ScrollArea className="h-[calc(100vh-116px-80px)] w-full">
          <Question
            id={id}
            task={task}
            setAnswer={setWritingAnswer}
            filledAnswers={filledAnswers?.[task] as any}
          />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Writing;
