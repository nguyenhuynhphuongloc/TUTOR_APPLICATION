"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  cn,
  flattenData,
  getBandScoreListeningAndReading,
  roundIELTS,
} from "@/lib/utils";
import type { PeriodicTest, PeriodicTestAttempt } from "@/payload-types";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { flattenResults } from "../entrance-test/utils";

const typeLabels: Record<string, string> = {
  homework: "Bài tập về nhà",
  extra_homework: "Bài tập bổ trợ",
  mini_test: "Bài kiểm tra nhỏ",
  mid_term: "Giữa kỳ",
  final_term: "Cuối kỳ",
  bank: "Kho đề",
  entrance_test: "Bài thi đầu vào",
};

interface PreviousTestScoresProps {
  attempts: PeriodicTestAttempt[];
  currentAttemptId: string;
  skill: "listening" | "reading" | "writing" | "speaking";
}

export default function PreviousTestScores({
  attempts,
  currentAttemptId,
  skill,
}: PreviousTestScoresProps) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Filter attempts that have a score for the given skill
  const filteredAttempts = attempts.filter((attempt) => {
    if (!attempt.answerSheet || typeof attempt.answerSheet !== "object")
      return false;
    const sheet = attempt.answerSheet as Record<string, unknown>;
    return Boolean(sheet[skill]);
  });

  if (filteredAttempts.length === 0) return null;

  // Compute score for each attempt
  const items = filteredAttempts.map((attempt) => {
    const sheet = attempt.answerSheet as Record<string, any>;
    const skillData = sheet[skill];

    let score: string | number = "—";

    if (skill === "speaking") {
      // Speaking: overallScore is in skillResult[0][1]
      const skillResult = Object.values(skillData || {}) as any[];
      const scoreVal = skillResult?.[0]?.[1]?.overallScore || 0;
      score = Number(scoreVal).toFixed(1);
    } else if (skill === "writing") {
      // Writing: compute overall from task scores using flattenData and roundIELTS
      const dataWriting = flattenData(
        Object.values(skillData || {}).slice(0, 2),
      );
      let overallScoreWriting = 0;
      dataWriting.forEach((task: any, index: number) => {
        const scoreVal = Number(task?.overallScore || 0);
        overallScoreWriting += index === 1 ? scoreVal * 2 : scoreVal;
      });
      score = roundIELTS(overallScoreWriting / 3).toFixed(1);
    } else {
      // Listening/Reading: use common band score utility
      const results = flattenResults(skillData || {});
      const totalCorrect = results.filter((i) => i?.isCorrect).length;
      score = getBandScoreListeningAndReading(totalCorrect).toFixed(1);
    }

    const testInfo = attempt.test as PeriodicTest;

    return {
      id: attempt.id,
      score,
      date: attempt.completedAt
        ? format(new Date(attempt.completedAt), "dd/MM/yyyy")
        : "—",
      type: typeLabels[attempt.type] || attempt.type,
      testName: testInfo?.title ?? "—",
      isCurrent: attempt.id === currentAttemptId,
      totalCorrect:
        skill === "listening" || skill === "reading"
          ? flattenResults(skillData || {}).filter((i) => i?.isCorrect).length
          : undefined,
      totalQuestions:
        skill === "listening" || skill === "reading"
          ? flattenResults(skillData || {}).length
          : undefined,
    };
  });

  return (
    <div className="mt-6 mb-2">
      <div className="flex gap-2 items-center mb-3">
        <Image src="/ranking.svg" alt="ranking" width={20} height={20} />
        <p className="font-bold text-[20px] text-[#E72929]">Band Score</p>
      </div>
      <div className="flex gap-2 items-start overflow-x-auto pb-2">
        {items.map((item) => (
          <Popover
            key={item.id}
            open={openPopoverId === item.id}
            onOpenChange={(open) => setOpenPopoverId(open ? item.id : null)}
          >
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex font-bold flex-col items-center cursor-pointer min-w-[60px] px-2 py-1 rounded-lg transition-all duration-200",
                  item.isCurrent
                    ? "text-[#E72929]"
                    : "text-[#6D737A] hover:text-[#E72929]",
                  openPopoverId === item.id && "bg-[#FFF1F1] text-[#E72929]",
                )}
                onMouseEnter={() => setOpenPopoverId(item.id)}
                onMouseLeave={() => setOpenPopoverId(null)}
              >
                <span className={cn("text-[18px] font-bold")}>
                  {item.score}
                </span>
                <span className="text-[11px] text-[#A8ABB2] mt-0.5 whitespace-nowrap">
                  {item.date}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[240px] p-4"
              side="bottom"
              align="center"
              onMouseEnter={() => setOpenPopoverId(item.id)}
              onMouseLeave={() => setOpenPopoverId(null)}
            >
              <div className="space-y-2">
                <div>
                  <p className="text-[12px] text-[#A8ABB2]">Tên bài kiểm tra</p>
                  <p className="text-[14px] font-semibold text-[#151515] truncate">
                    {item.testName}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[#A8ABB2]">Loại</p>
                  <p className="text-[14px] font-medium text-[#151515]">
                    {item.type}
                  </p>
                </div>
                {item.totalCorrect !== undefined &&
                  item.totalQuestions !== undefined && (
                    <div>
                      <p className="text-[12px] text-[#A8ABB2]">Số câu đúng</p>
                      <p className="text-[14px] font-medium text-[#151515]">
                        {item.totalCorrect}/{item.totalQuestions}
                      </p>
                    </div>
                  )}
                <div>
                  <p className="text-[12px] text-[#A8ABB2]">Ngày hoàn thành</p>
                  <p className="text-[14px] font-medium text-[#151515]">
                    {item.date}
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
