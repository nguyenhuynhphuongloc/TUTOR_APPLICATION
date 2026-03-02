"use client";

import SwitchSkillAlertModal from "@/components/modal/SwitchSkillAlertModal";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useStore } from "@/zustand/placement-test/provider";
import { CircleCheckBig, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useShallow } from "zustand/react/shallow";
import { onSave } from "../actions";
import { TOUR_STEP_MINI_IDS } from "../root";
import type { ProgressItem } from "../types";

const ANSWER_SHEET_FORMAT = [
  { key: "grammar", label: "Grammar", numberOfQuestions: 10 },
  { key: "vocab", label: "Vocabulary", numberOfQuestions: 10 },
  { key: "reading", label: "Reading", numberOfQuestions: 5 },
  { key: "writing", label: "Writing", numberOfQuestions: 5 },
];

const ANSWER_FORMAT = {
  grammar: 10,
  vocab: 10,
  reading: 5,
  writing: 5,
};

function countTotalUnansweredQuestions(data = {}, format = ANSWER_FORMAT) {
  let totalUnanswered = 0;

  for (const [skill, totalQuestions] of Object.entries(format)) {
    const skillData = data[skill] || {};
    const questions = Object.values(skillData);

    let blankCount = 0;

    questions.forEach((question) => {
      if (
        question &&
        typeof question.answer === "string" &&
        question.answer.trim() === ""
      ) {
        blankCount++;
      }
    });

    const missingCount = totalQuestions - questions.length;

    totalUnanswered += blankCount + missingCount;
  }

  return totalUnanswered;
}
// total Answer question in Mini Test

function SheetItem({ data }: { data: (typeof ANSWER_SHEET_FORMAT)[number] }) {
  const sheetData = useStore((s) => s.answerSheet[data.key]);

  const columns = 4;
  const emptyCells =
    data.numberOfQuestions % columns === 0
      ? 0
      : columns - (data.numberOfQuestions % columns);

  return (
    <div>
      <div className="font-bold text-[16px]">{data.label}:</div>
      <div className="border border-[#E8E7E7] grid grid-cols-4 rounded-[12px] overflow-hidden">
        {new Array(data.numberOfQuestions).fill(0).map((_, index) => (
          <div
            key={index}
            className="p-4 border border-[#E8E7E7] flex items-center gap-2"
          >
            <span className="text-[#6D737A]">Q{index + 1}:</span>
            <span
              className={cn("text-[#E72929] font-bold uppercase", {
                hidden: data.key === "writing",
              })}
            >
              {sheetData?.[index + 1]?.answer[0]}
            </span>
            <span
              className={cn("hidden text-[#E72929] font-bold uppercase ", {
                "inline-block": data.key === "writing",
              })}
            >
              {sheetData?.[index + 1]?.answer ? <CircleCheckBig /> : null}
            </span>
          </div>
        ))}
        {new Array(emptyCells).fill(0).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="p-4 border border-[#E8E7E7]"
          ></div>
        ))}
      </div>
    </div>
  );
}

export function ReviewAnswer({
  timeLeft,
  data,
}: {
  timeLeft: number;
  data: Array<ProgressItem>;
}) {
  const [open, setOpen] = useState(false);
  const params = useParams<{ leadId: string; testId: string }>();

  const answerSheet = useStore((s) => s.answerSheet);
  const selectedSkill = useStore((s) => s.navigation.currentSkill);
  const skill = data[selectedSkill]!;
  const currentAnswers = useStore(useShallow((s) => s.answerSheet[skill.type]));
  const answers = useStore(useShallow((s) => s.answerSheet));

  const unansweredQuestionsCount = countTotalUnansweredQuestions(
    answers,
    ANSWER_FORMAT,
  );
  const [isSubmitting, startTransition] = useTransition();
  const onSubmit = async () => {
    startTransition(async () => {
      await onSave({
        leadId: params.leadId,
        testId: params.testId,
        answerSheet,
      });
      setOpen(false);
    });
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setOpen(true);
      onSubmit();
    }
  }, [timeLeft]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="h-10 w-[120px] rounded-[12px] text-[14px] font-semibold"
          id={TOUR_STEP_MINI_IDS.SUBMIT}
        >
          Submit
          <Image src="/icons/send.svg" width={16} height={16} alt="send" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-sans">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-[24px] font-bold">
            Review your answers
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#6D737A] text-[16px] text-center">
            * This window is to review answers only, you cannot change the
            answers in here
          </AlertDialogDescription>
          <ScrollArea className="h-[350px] w-full">
            <div className="flex flex-col gap-6">
              {ANSWER_SHEET_FORMAT.map((item) => (
                <SheetItem key={item.key} data={item} />
              ))}
            </div>
          </ScrollArea>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={timeLeft <= 0}
            className="rounded-[12px] text-[16px] font-bold"
          >
            Cancel
          </AlertDialogCancel>
          <SwitchSkillAlertModal
            onSubmit={onSubmit}
            blankCount={unansweredQuestionsCount}
            skill={skill.type}
            type="mini"
          >
            <Button
              disabled={isSubmitting}
              className="bg-[#E72929] rounded-[12px] text-[16px] font-bold"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              Submit
            </Button>
          </SwitchSkillAlertModal>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
