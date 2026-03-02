/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import type { Lead, Test } from "@/payload-types";

import {
  cn,
  flattenData,
  getBandScoreListeningAndReading,
  roundIELTS,
} from "@/lib/utils";
import { FileTextIcon } from "lucide-react";
import { type JSX } from "react";
import AnswerPart from "./answer-part";
import SkillReview from "./skill-review";
import { transformData } from "./utils";

interface SkillInfoProps {
  name: string;
  icon?: JSX.Element;
  value: string;
}
interface SkillScoreProps {
  skillInfo: SkillInfoProps;
  testResult: Record<string, { isCorrect: boolean }[]>;
  lead: Lead;
  test?: Test[];
  type: "mini" | "full";
  isPdf: boolean;
  writingQuestions: any[];
}

interface SkillCircleProps {
  id: string;
  name: string;
  value: number | string;
  max: string | number;
  hideMax?: boolean;
}

export function countCorrectAnswersByIndex(data: any[]) {
  const result: {
    totalCorrect: number;
    totalQuestions: number;
    [key: number]: number;
  } = {
    totalCorrect: 0,
    totalQuestions: 0,
  };

  if (!Array.isArray(data)) return result;

  data.forEach((topLevelGroup, topIndex) => {
    let correctInGroup = 0;
    let totalInGroup = 0;

    if (Array.isArray(topLevelGroup)) {
      topLevelGroup.forEach((questionGroup) => {
        if (Array.isArray(questionGroup)) {
          questionGroup.forEach((question) => {
            totalInGroup++;
            if (question?.isCorrect) {
              correctInGroup++;
            }
          });
        }
      });
    }

    result.totalCorrect += correctInGroup;
    result.totalQuestions += totalInGroup;
    result[topIndex] = correctInGroup;
  });

  return result;
}

export const getOverallScore = ({
  skill,
  writingData,
  speakingData,
  fullTestData,
}: {
  skill: string;
  writingData: any;
  speakingData: any;
  fullTestData: any;
}) => {
  if (skill === "writing") {
    return writingData;
  }
  if (skill === "speaking") {
    return speakingData;
  }
  return fullTestData;
};

export default function SkillScore({
  skillInfo,
  testResult,
  type,
  isPdf,
  writingQuestions,
}: SkillScoreProps): JSX.Element {
  const skill = skillInfo?.value;
  if (!skill || !testResult || !testResult[skill]) {
    return <></>;
  }

  const skillResult = Object.values(testResult[skill] ?? []);
  const isMini = type === "mini";

  // Don't proceed if there are no results for this skill
  if (skillResult.length === 0) {
    return <></>;
  }

  // Ensure we have data to transform
  const results = isMini
    ? transformData(skillResult)
    : skillResult.map((i) => transformData(Object.values(i)));

  const correctCount: number = (skillResult || []).reduce(
    (acc: number, answer: any) => (answer?.isCorrect ? acc + 1 : acc),
    0,
  );

  const scoreInfo = isMini
    ? { totalCorrect: 0, totalQuestions: 0 }
    : countCorrectAnswersByIndex(results);

  const dataWriting =
    !isMini && skill === "writing" ? flattenData(skillResult.slice(0, 2)) : [];

  let overallScoreWriting = 0;

  console.log("dataWriting", skillResult);

  dataWriting.forEach((task: any, index: number) => {
    const scoreVal = Number(task?.overallScore || 0);
    overallScoreWriting += index === 1 ? scoreVal * 2 : scoreVal;
  });
  const invidualTestResult: SkillCircleProps[] = [
    {
      id: "correct_ans",
      name: "Correct Answers",
      value: isMini ? correctCount : scoreInfo.totalCorrect,
      max: isMini ? skillResult.length : scoreInfo.totalQuestions,
    },
    {
      id: "overall_score",
      name: "Overall score",
      value: isMini
        ? correctCount.toFixed(1)
        : getOverallScore({
            skill,
            writingData: roundIELTS(overallScoreWriting / 3),
            speakingData:
              skillResult?.[0] && Array.isArray(skillResult[0])
                ? Number(skillResult[0][1]?.overallScore || 0).toFixed(1)
                : "0.0",
            fullTestData: getBandScoreListeningAndReading(
              scoreInfo.totalCorrect,
            ),
          }),

      max: "9.0",
      hideMax: true,
    },
  ];
  let aggQuestion = 0;

  return (
    <div className="w-screen flex flex-col items-center justify-center">
      <div className=" flex flex-col items-center justify-center">
        {skillResult.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-[32px] font-bold">{skillInfo?.name}</p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-[120px]">
          {invidualTestResult.map((r: SkillCircleProps) =>
            (["reading", "grammar", "vocab", "writing"].includes(skill) &&
              r.id === "overall_score" &&
              isMini) ||
            (["speaking", "writing"].includes(skill) &&
              r.id === "correct_ans" &&
              !isMini)
              ? null
              : skillResult.length > 0 && (
                  <div className="w-[127px]" key={r.id}>
                    <CircleProgressBar
                      value={
                        !isNaN(Number(r.value))
                          ? (Number(r.value) * 100) / Number(r.max)
                          : 0
                      }
                    >
                      <div className="text-center">
                        <div
                          className={cn(
                            "mt-6 text-2xl font-bold text-[#E72929]",
                            !r.hideMax ? "" : "text-[32px]",
                          )}
                        >
                          {isNaN(Number(r.value)) ? "0.0" : r.value}
                        </div>
                        {r.hideMax ? (
                          ""
                        ) : (
                          <div className="text-md mt-[-6px] text-[#151515]">
                            ({r.max})
                          </div>
                        )}
                      </div>
                    </CircleProgressBar>
                    <p className="text-center text-[#A8ABB2] text-[16px] mt-[-16px]">
                      {r.name}
                    </p>
                  </div>
                ),
          )}
        </div>
      </div>

      <div>
        {["writing", "speaking"].includes(skill) ? (
          <div className="mb-2">
            <SkillReview
              type={type}
              skillResult={skillResult}
              isPdf={isPdf}
              writingQuestions={writingQuestions}
              skill={skill}
            />
          </div>
        ) : (
          <div className="mt-10 w-[1392px]">
            <div className="flex gap-2 items-center justify-start font-extrabold text-[20px] text-[#151515]">
              <FileTextIcon
                className="fill-[#151515] stroke-white"
                style={{ marginBottom: isPdf ? -16 : 0 }}
              />
              Answer Keys
            </div>
            {isMini ? (
              <AnswerPart
                isPdf={isPdf}
                isMini={isMini}
                totalQuestion={skillResult.length}
                correctAnswer={correctCount}
                data={results as any}
              />
            ) : (
              results.map((item: any, index: number) => {
                const totalQuestion = Object.keys(
                  skillResult[index] || {},
                ).length;
                const correctAnswer = scoreInfo[index];
                aggQuestion +=
                  index > 0 ? (results[index - 1] as any)?.flat().length : 0;

                return (
                  <AnswerPart
                    key={item[0]?.id || index}
                    data={item}
                    isPdf={isPdf}
                    isMini={isMini}
                    totalQuestion={totalQuestion}
                    part={index + 1}
                    correctAnswer={correctAnswer || 0}
                    previousLength={aggQuestion}
                  />
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
