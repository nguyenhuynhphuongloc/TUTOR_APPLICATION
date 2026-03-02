"use client";

import type { Test } from "@/payload-types";
import type { Answer, EditorValue } from "../../types";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { Media } from "@/components/media";
import {
  TourAlertDialog,
  type TourStep,
  useTour,
} from "@/components/tour/tour";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

import { TOUR_KEYS, TOUR_READING_IDS } from "@/constants";
import { useStore } from "@/zustand/placement-test/provider";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../../blocks";

export const steps: TourStep[] = [
  {
    content: (
      <div>
        In the <b>Reading</b> Section: Use your left mouse button to highlight
        text and select your preferred highlight color.
        <Image
          src="/Tour_Highlight.png"
          alt="highlight"
          width={200}
          height={200}
        />
      </div>
    ),
    selectorId: TOUR_READING_IDS.HIGHLIGHT,
    position: "right",
  },
];

const Description = () => (
  <div>
    <p>This is your tour in Reading</p>
    <p>
      {`When you're ready, click `}
      <b>{`"Start Tour" to get familiar with the test interface.`}</b>
    </p>
  </div>
);

function Reading({
  reading,
  pickedParts,
  testType,
}: Test & { testType?: "placement" | "periodic"; pickedParts?: any }) {
  const selectedSection = useStore(
    useShallow((s) => s.navigation.currentSection),
  );
  const filledAnswers = useStore(useShallow((s) => s.answerSheetFull.reading));
  const setSection = useStore(useShallow((s) => s.setSection));

  const setAnswer = useStore(useShallow((state) => state.setAnswer));
  const setSkillQuestionNo = useStore(
    useShallow((state) => state.setQuestionNo),
  );
  const getSkillQuestionNo = useStore(
    useShallow((state) => state.getQuestionNo),
  );
  const { setSteps, isTourCompleted, startTour, nextStep, setStorageKey } =
    useTour();
  const [openTour, setOpenTour] = useState(false);

  useEffect(() => {
    const key =
      testType === "periodic"
        ? TOUR_KEYS.PERIODIC_FULL_READING
        : TOUR_KEYS.PLACEMENT_FULL_READING;
    setStorageKey(key);
  }, [setStorageKey, testType]);

  useEffect(() => {
    if (!pickedParts) return;
    setSection(pickedParts[0] - 1);
  }, []);

  useEffect(() => {
    setSteps(steps);
    setOpenTour(true);
  }, [setSteps]);

  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo("reading", questionId);
  };
  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo("reading", questionId);
  };

  useStore(useShallow((state) => state.questionNoMap));

  const currentSection = reading?.[selectedSection];

  if (!currentSection) {
    return null;
  }

  const {
    description,
    image,
    passage: passageText,
    sections,
    passageType,
  } = currentSection;
  const part = selectedSection + 1;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr]"
    >
      <ResizablePanel>
        <ScrollArea className="h-[calc(100vh-116px-90px)] w-full">
          <div className="flex flex-col gap-6 pr-3">
            <div className="font-bold text-[32px] text-[#E72929]">
              READING PASSAGE {passageType}
            </div>
            <div className="relative">
              <Editor
                key={`reading-part-${part}-description`}
                value={description as EditorValue}
                theme={previewEditorTheme}
                mode="practice"
                cacheKey={`reading-part-${part}-description`}
              />
            </div>
            {image && typeof image !== "string" && (
              <div className="relative min-h-[360px] w-full select-none">
                <Media
                  fill
                  className=""
                  imgClassName="rounded-[12px] object-cover"
                  resource={image}
                />
              </div>
            )}
            <div className="relative" id={TOUR_READING_IDS.HIGHLIGHT}>
              <Editor
                key={`reading-part-${part}-passage`}
                value={passageText as EditorValue}
                theme={previewEditorTheme}
                mode="practice"
                cacheKey={`reading-part-${part}-passage`}
              />
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle className="border border-dashed border-[#CBCBCB]" />
      <ResizablePanel className="pl-6">
        <ScrollArea className="h-[calc(100vh-116px-90px)] w-full pr-3">
          {sections?.map((section) => {
            return (
              <div key={section?.id}>
                <div className="relative mb-6">
                  <Editor
                    key={`reading-part-${part}-section-${section?.id}`}
                    value={section?.description as EditorValue}
                    theme={previewEditorTheme}
                    mode="practice"
                    cacheKey={`reading-part-${part}-section-${section?.id}`}
                  />
                </div>
                {section?.content.map((block, index) => {
                  const setReadingAnswer = ({
                    questionNumber,
                    ...payload
                  }: Answer) => {
                    setAnswer("reading", questionNumber, payload, String(part));
                  };
                  const BlockComponent =
                    blockResolver[
                      block?.blockType as keyof typeof blockResolver
                    ];

                  if (!BlockComponent) {
                    return null;
                  }

                  return (
                    <BlockComponent
                      key={block?.id}
                      filledAnswers={filledAnswers?.[part]}
                      setAnswer={setReadingAnswer}
                      setQuestionNo={setQuestionNo}
                      getQuestionNo={getQuestionNo}
                      mode="practice"
                      cacheKey={`reading-part-${part}-block-${block?.id ?? index}`}
                      {...(block as any)}
                    />
                  );
                })}
              </div>
            );
          })}
        </ScrollArea>
      </ResizablePanel>
      <TourAlertDialog
        isOpen={openTour && !isTourCompleted}
        setIsOpen={setOpenTour}
        title="Welcome to Reading Test"
        description={<Description />}
      />
    </ResizablePanelGroup>
  );
}

export default Reading;
