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
import { TOUR_STEP_IDS } from "@/constants";
import { cn, flattenAndReindex, uploadSpeakingAudios } from "@/lib/utils";
import { useStore } from "@/zustand/placement-test/provider";
import { CircleCheckBig, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useShallow } from "zustand/react/shallow";
import { onSave } from "../actions";

export const ANSWER_SHEET_FORMAT_FULL = {
  listening: { label: "Listening", numberOfQuestions: 40, key: "listening" },
  reading: { label: "Reading", numberOfQuestions: 40, key: "reading" },
  writing: { label: "Writing", numberOfQuestions: 2, key: "writing" },
  speaking: { label: "Speaking", numberOfQuestions: 5, key: "speaking" },
};
export const ANSWER_SHEET_FORMAT = {
  reading: 40,
  listening: 40,
  writing: 2,
  speaking: 5,
};

export function countUnansweredQuestions(
  data = {},
  skill: string | undefined,
  format = ANSWER_SHEET_FORMAT,
) {
  let count = 0;
  let total = 0;

  Object.values(data || {}).forEach((section) => {
    Object.values(section as Record<string, any>).forEach((question) => {
      total++;
      const answer = question?.answer;

      let isAnswered = false;
      if (skill === "speaking") {
        isAnswered = !!answer;
      } else {
        if (typeof answer === "string") {
          isAnswered = answer.trim() !== "";
        } else if (Array.isArray(answer)) {
          isAnswered = answer.some(
            (a) => typeof a === "string" && a.trim() !== "",
          );
        } else {
          isAnswered = !!answer;
        }
      }

      if (!isAnswered) {
        count++;
      }
    });
  });

  const targetTotal = (format as any)[skill || ""] || 0;
  const unansweredQuestion = count + (targetTotal - total);

  return unansweredQuestion;
}
function SheetItem({
  data,
}: {
  data: (typeof ANSWER_SHEET_FORMAT_FULL)[number];
}) {
  type AnswerSheetItem = {
    answer: string[] | string;
    [key: string]: any;
  };

  // Add an index signature to allow number indexing
  type SheetDataType = {
    [key: number]: {
      answer: string | string[] | any;
      [key: string]: any;
    };
  };

  const sheetData: SheetDataType = useStore(
    useShallow((s) => {
      const items = s.answerSheetFull[data.key]
        ? Object.values(
            s.answerSheetFull[data.key] as Record<string, AnswerSheetItem>,
          )
        : [];
      if (data.key === "speaking") {
        const obj = {};
        Object.assign(obj, { ...items });
        return flattenAndReindex(obj);
      }

      return Object.assign({}, ...items) as Record<
        string,
        { answer: Array<string> }
      >;
    }),
  );

  const columns = 4;
  const emptyCells =
    data.numberOfQuestions % columns === 0
      ? 0
      : columns - (data.numberOfQuestions % columns);

  return (
    <div>
      <div className="font-bold text-[16px]">{data.label}:</div>
      <div className="border border-[#E8E7E7] grid grid-cols-4 rounded-[12px] overflow-hidden">
        {new Array(data.numberOfQuestions).fill(0).map((_, index) => {
          return (
            <div
              key={index}
              className="p-4 border border-[#E8E7E7] flex items-center gap-2"
            >
              <span className="text-[#6D737A]">Q{index + 1}:</span>
              <span
                className={cn(
                  "text-[#E72929] font-bold uppercase truncate max-w-[80px]",
                  {
                    hidden: data.key === "writing" || data.key === "speaking",
                  },
                )}
              >
                {(() => {
                  const val = sheetData?.[index + 1]?.answer;
                  if (typeof val === "string") return val.trim();
                  if (Array.isArray(val)) {
                    const first = val[0];
                    return typeof first === "string" ? first.trim() : "";
                  }
                  return "";
                })()}
              </span>
              <span
                className={cn("hidden text-[#E72929] font-bold uppercase", {
                  "inline-block":
                    ["writing", "speaking"].includes(data.key) &&
                    !!sheetData?.[index + 1]?.answer,
                })}
              >
                <CircleCheckBig size={16} />
              </span>
            </div>
          );
        })}
        {new Array(emptyCells).fill(0).map((_, index) => (
          <div key={`empty-${index}`} className="p-4 border border-[#E8E7E7]" />
        ))}
      </div>
    </div>
  );
}

export function ReviewAnswer({
  timeLeft,
  testSkills,
}: {
  timeLeft: number;
  testSkills?: { type: string; data: any }[];
}) {
  const [open, setOpen] = useState(false);
  const params = useParams<{
    leadId: string;
    testId: string;
    attemptId: string;
  }>();
  const currentSkill = useStore((s) => s.navigation.currentSkill);

  const skill: string | undefined = testSkills?.[currentSkill]?.type;
  // const skill: string | undefined = ANSWER_SHEET_FORMAT_FULL[currentSkill]?.key;
  const goToNextSkill = useStore((s) => s.goToNextSkill);

  const answerSheet = useStore((s) => s.answerSheetFull);
  const hasSubmittedRef = useRef(false);
  const hasTimerStartedRef = useRef(false);

  const [isSubmitting, startTransition] = useTransition();
  const unansweredQuestionsCount = countUnansweredQuestions(
    skill ? answerSheet[skill] : {},
    skill,
  );

  const onSubmit = async () => {
    // Prevent double submission
    if (hasSubmittedRef.current) {
      console.log("[SUBMIT] Already submitted, skipping...");
      return;
    }

    hasSubmittedRef.current = true;

    // Lấy snapshot mới nhất ngay trước khi submit
    const snapshot = structuredClone(answerSheet);
    console.log("[SUBMIT] Taking snapshot:", JSON.stringify(snapshot, null, 2));

    startTransition(async () => {
      try {
        const speakingResult =
          skill === "speaking" && snapshot.speaking
            ? await uploadSpeakingAudios(
                params.leadId,
                snapshot.speaking as any,
              )
            : null;

        const basePayload = {
          answerSheet: {
            ...snapshot,
            speaking: speakingResult,
          },
          currentSkill,
        };

        const payload = params.leadId
          ? { ...basePayload, leadId: params.leadId, testId: params.testId }
          : { ...basePayload, testSkills, testId: params.attemptId };

        console.log(
          "[SUBMIT] Payload to save:",
          JSON.stringify(payload, null, 2),
        );
        await onSave(payload);
        setOpen(false);
        goToNextSkill();
      } catch (error) {
        console.error("[SUBMIT] Error during submission:", error);
        // Reset flag nếu có lỗi để user có thể thử lại
        hasSubmittedRef.current = false;
      }
    });
  };

  // Đánh dấu timer đã bắt đầu khi timeLeft > 0
  useEffect(() => {
    if (timeLeft > 0 && !hasTimerStartedRef.current) {
      hasTimerStartedRef.current = true;
      console.log("[TIMER] Timer has started, timeLeft:", timeLeft);
    }
  }, [timeLeft]);

  // Reset flags khi chuyển skill
  useEffect(() => {
    hasSubmittedRef.current = false;
    hasTimerStartedRef.current = false;
    console.log(
      "[SKILL-CHANGE] Reset submission flags for skill:",
      currentSkill,
    );
  }, [currentSkill]);

  // Auto-submit khi hết giờ (chỉ khi timer đã thực sự bắt đầu)
  useEffect(() => {
    if (
      timeLeft === 0 &&
      hasTimerStartedRef.current &&
      !hasSubmittedRef.current
    ) {
      console.log("[AUTO-SUBMIT] Time's up, auto-submitting...");
      onSubmit();
    }
  }, [timeLeft]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="h-10 w-[120px] rounded-[12px] text-[14px] font-semibold"
          id={TOUR_STEP_IDS.SUBMIT}
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
              {skill &&
              ANSWER_SHEET_FORMAT_FULL[
                skill as keyof typeof ANSWER_SHEET_FORMAT_FULL
              ] ? (
                <SheetItem
                  key={skill}
                  data={
                    ANSWER_SHEET_FORMAT_FULL[
                      skill as keyof typeof ANSWER_SHEET_FORMAT_FULL
                    ] as any
                  }
                />
              ) : null}
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
            skill={skill}
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
