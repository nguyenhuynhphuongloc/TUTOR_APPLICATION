"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TOUR_STEP_IDS } from "@/constants";
import { cn } from "@/lib/utils";
import { useStore } from "@/zustand/placement-test/provider";
import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ProgressItem } from "../types";

const TEST_TYPES = {
  grammar: "Grammar",
  vocab: "Vocabulary",
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
  speaking: "Speaking",
};

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-medium w-max text-[#6D737A] text-[18px] h-[34px] flex items-center gap-2",
        className,
      )}
    >
      {children}
    </p>
  );
}

function Section({
  children,
  isSelected,
  sectionIndex,
  className,
}: {
  children: React.ReactNode;
  isSelected: boolean;
  sectionIndex: number;
  className?: string;
}) {
  const setSection = useStore(useShallow((s) => s.setSection));

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    setSection(sectionIndex);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "border border-[#E7EAE9] cursor-pointer",
        "select-none rounded-[12px] p-4 flex items-center gap-2 hover:bg-accent",
        {
          "border-[#E72929]": isSelected,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}

function Question({
  questionNumber,
  skillType,
  question,
}: {
  questionNumber: number | string;
  skillType: string;
  question: { id: string };
}) {
  const questionNo = useStore(
    (s) => s.questionNoMap?.[skillType]?.[question?.id],
  );
  const currentAnswers = useStore(
    useShallow((s) =>
      Object.values(s.answerSheetFull[skillType] ?? {}).reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      ),
    ),
  );

  const onScrollToQuestion = () => {
    if (!question?.id) {
      return;
    }

    const questionElement = document.getElementById(question?.id);
    questionElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!questionNo) return null;

  return (
    <div
      onClick={onScrollToQuestion}
      className={cn(
        "inline-flex justify-center items-center border py-none px-none",
        "h-[34px] w-[34px] rounded-[17px]",
        "font-bold text-[14px] bg-white border-[#E7EAE9] text-[#6D737A]",
        {
          "bg-[#E729291A] border-[#E7292933] text-[#E72929]": Boolean(
            currentAnswers?.[questionNo]?.answer,
          ),
        },
      )}
    >
      {questionNo ?? questionNumber}
    </div>
  );
}

export default function ProgressBar({
  data,
  part,
}: {
  data: Array<ProgressItem>;
  part: 1 | 2 | 3[];
}) {
  const selectedSkill = useStore((s) => s.navigation.currentSkill);
  const selectedSection = useStore((s) => s.navigation.currentSection);

  const skill = data[selectedSkill]!;

  const content = part
    ? skill.content?.filter((item) => part.includes(item.part))
    : skill.content;
  const currentAnswers = useStore(
    useShallow((s) => s.answerSheetFull[skill?.type]),
  );

  if (skill.type === "speaking") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 h-[100px] w-full bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]">
      <div className="relative mx-auto max-w-[1440px] h-full px-6 py-4 flex items-center gap-3">
        {(skill?.type === "reading" || skill?.type === "listening") && (
          <ScrollArea className="w-full whitespace-nowrap">
            <div
              className="flex items-center h-[68px] w-max space-x-4"
              id={TOUR_STEP_IDS.SWITCH_QUESTION}
            >
              {content?.map((section) => {
                const isSelectedSection = selectedSection === section.part - 1;
                const filledAnswers = Object.values(
                  currentAnswers?.[section.part] ?? {},
                ).reduce((acc, val) => {
                  if (Boolean(val.answer)) {
                    return acc + 1;
                  }
                  return acc;
                }, 0);

                return (
                  <Fragment key={section.part}>
                    <Section
                      sectionIndex={section.part - 1}
                      isSelected={isSelectedSection}
                    >
                      <Label>
                        <span
                          className={cn("font-bold", {
                            "inline-block": true,
                          })}
                        >
                          {skill.type === "reading" ? "Passage" : "Part"}{" "}
                          {section.part}:
                        </span>{" "}
                        <span
                          className={cn("hidden", {
                            inline: !isSelectedSection,
                          })}
                        >
                          {filledAnswers} of {section.questions?.length}{" "}
                          questions
                        </span>
                      </Label>
                      <div
                        className={cn("flex gap-2", {
                          hidden: !isSelectedSection,
                        })}
                      >
                        {section.questions?.map((question, questionIndex) => {
                          return (
                            <Question
                              key={questionIndex}
                              questionNumber={questionIndex + 1}
                              question={question as { id: string }}
                              skillType={skill?.type}
                            />
                          );
                        })}
                      </div>
                    </Section>
                  </Fragment>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
        {skill?.type === "writing" && (
          <div className="flex-1 flex items-center h-[68px] space-x-4">
            {content?.map((section) => {
              const isSelectedSection = selectedSection === section.part - 1;

              return (
                <Fragment key={section.part}>
                  <Section
                    sectionIndex={section.part - 1}
                    isSelected={isSelectedSection}
                    className="w-full justify-center"
                  >
                    <Label className="">
                      <span
                        className={cn("font-bold", {
                          block: true,
                        })}
                      >
                        Task {section.part}
                      </span>
                    </Label>
                  </Section>
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
