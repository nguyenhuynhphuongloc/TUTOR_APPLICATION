"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useStore } from "@/zustand/placement-test/provider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { TOUR_STEP_MINI_IDS } from "../root";
import type { ProgressItem } from "../types";

const TEST_TYPES = {
  grammar: "Grammar",
  vocab: "Vocabulary",
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
  speaking: "Speaking",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-medium w-max text-[#6D737A] text-[18px]">{children}</p>
  );
}

function Section({
  children,
  isSelected,
}: {
  children: React.ReactNode;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "border border-[#E7EAE9] cursor-pointer",
        "select-none rounded-[12px] p-4 flex items-center gap-2 hover:bg-accent",
        {
          "border-[#E72929]": isSelected,
        },
      )}
    >
      {children}
    </div>
  );
}

function Question({
  children,
  questionNumber,
  skillType,
  questionId,
}: {
  questionId: string;
  children: React.ReactNode;
  questionNumber: number | string;
  skillType: string;
}) {
  const currentAnswer = useStore(
    (s) => s.answerSheet[skillType]?.[questionNumber]?.answer,
  );

  const onScrollToQuestion = () => {
    if (!questionId) {
      return;
    }

    const questionElement = document.getElementById(questionId);
    questionElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      onClick={onScrollToQuestion}
      className={cn(
        "inline-flex justify-center items-center border py-none px-none",
        "h-[34px] w-[80px] rounded-[17px]",
        "font-bold text-[14px] bg-white border-[#E7EAE9] text-[#6D737A]",
        {
          "bg-[#E729291A] border-[#E7292933] text-[#E72929]":
            Boolean(currentAnswer),
        },
      )}
    >
      {children}
    </div>
  );
}

export default function ProgressBar({ data }: { data: Array<ProgressItem> }) {
  const selectedSkill = useStore((s) => s.navigation.currentSkill);
  const goToNextSkill = useStore(useShallow((s) => s.goToNextSkill));
  const goToPreviousSkill = useStore(useShallow((s) => s.goToPreviousSkill));

  const [selectedSection] = useState(0);

  const skill = data[selectedSkill]!;
  const hasNextSkill = selectedSkill < data.length - 1;
  const hasPreviousSkill = selectedSkill > 0;

  const onNextSkill = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    goToNextSkill();
  };

  const onPreviousSkill = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    goToPreviousSkill();
  };

  return (
    <div className="fixed bottom-0 left-0 h-[100px] w-full bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]">
      <div className="relative mx-auto max-w-[1440px] h-full px-6 py-4 flex gap-3">
        <div
          className={cn(
            "border h-full rounded-[12px] py-4 px-4 flex items-center gap-2",
            "border-[#E72929] text-[#E72929] shadow",
          )}
          id={TOUR_STEP_MINI_IDS.SWITCH_SKILL}
        >
          <Button
            disabled={!hasPreviousSkill}
            variant="ghost"
            size="icon"
            className="border bg-white border-[#E7EAE9] rounded-[50%]"
            onClick={onPreviousSkill}
          >
            <ChevronLeft size={20} color="#6D737A" className="" />
          </Button>
          <p className="font-bold text-center select-none text-[18px] w-[100px]">
            {TEST_TYPES[skill.type]}
          </p>
          <Button
            disabled={!hasNextSkill}
            variant="ghost"
            size="icon"
            className="border bg-white border-[#E7EAE9] rounded-[50%]"
            onClick={onNextSkill}
          >
            <ChevronRight size={20} color="#6D737A" className="" />
          </Button>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div
            className="flex items-center h-[68px] w-max space-x-4"
            id={TOUR_STEP_MINI_IDS.SWITCH_QUESTION}
          >
            {skill.content?.map((section, sectionIndex) => {
              const isSelectedSection = selectedSection === sectionIndex;
              return (
                <Fragment key={section.id}>
                  <Section isSelected={isSelectedSection}>
                    <Label>
                      <span
                        className={cn("font-bold hidden", {
                          "inline-block": false,
                        })}
                      >
                        Part {sectionIndex + 1}:
                      </span>{" "}
                      <span
                        className={cn("hidden", {
                          inline: !isSelectedSection,
                        })}
                      >
                        0 of {section.questions.length} questions
                      </span>
                    </Label>
                    <div
                      className={cn("flex gap-2", {
                        hidden: !isSelectedSection,
                      })}
                    >
                      {section.questions.map((question, questionIndex) => {
                        if (!question.id) {
                          return null;
                        }

                        return (
                          <Question
                            key={question.id}
                            questionId={question.id}
                            questionNumber={questionIndex + 1}
                            skillType={skill.type}
                          >
                            {questionIndex + 1}
                          </Question>
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
      </div>
    </div>
  );
}
