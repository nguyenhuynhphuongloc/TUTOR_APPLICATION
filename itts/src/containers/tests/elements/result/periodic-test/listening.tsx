/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import buildStyles from "@/components/circle-progress-bar/buildStyles";
import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import {
  calculateDuration,
  cn,
  getBandScoreListeningAndReading,
} from "@/lib/utils";
import type {
  PeriodicTestAttempt,
  PlacementAttempt,
  Test,
} from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import AnswerPart from "../entrance-test/answer-part";
import { countCorrectAnswersByIndex } from "../entrance-test/skill-score";
import { transformData } from "../entrance-test/utils";
import PreviousTestScores from "./previous-test-scores";
import ReviewExplain from "./ReviewExplain/ReviewExplain";

function ListeningResult({
  data,
  test,
  allAttempts,
  currentAttemptId,
}: {
  data: PlacementAttempt;
  test: Test;
  allAttempts: PeriodicTestAttempt[];
  currentAttemptId: string;
}) {
  useStore(useShallow((state) => state.questionNoMap));
  const skillResult = Object.values(data.answerSheet?.listening ?? []);
  const results = skillResult.map((i) => transformData(Object.values(i)));
  const scoreInfo = countCorrectAnswersByIndex(results);
  const { startedAt, statusDetails } = data;

  const { formattedTime, totalSeconds } = calculateDuration(
    startedAt,
    statusDetails.completionTimes?.listening,
  );

  const attributes = [
    {
      name: "Correct Answers",
      value: scoreInfo.totalCorrect,
      maxValue: scoreInfo.totalQuestions,
      max: scoreInfo.totalQuestions,
    },
    {
      name: "Overall score",
      value: getBandScoreListeningAndReading(scoreInfo.totalCorrect),
      hideMax: true,
      maxValue: 9,
      max: 9,
    },
    {
      name: "Test time",
      value: totalSeconds,
      displayValue: formattedTime,
      max: "1:00:00",
      maxValue: 3600,
    },
  ];
  let aggQuestion = 0;

  return (
    <div>
      <div className="mt-8 flex items-center justify-center gap-[120px]">
        {attributes.map((r) => {
          return (
            <div className="w-[127px]" key={r.id}>
              <CircleProgressBar
                value={r.max ? (Number(r.value) * 100) / Number(r.maxValue) : 0}
                styles={buildStyles({
                  rotation: 1 / 2 + 1 / 6,
                  trailColor: "#F8EFE2",
                  pathColor: "#E72929",
                })}
              >
                <div className="text-center">
                  <div
                    className={cn(
                      "mt-6 text-2xl font-bold text-[#E72929]",
                      !r.hideMax ? "" : "text-[32px]",
                    )}
                  >
                    {r.displayValue ?? r.value}
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
          );
        })}
      </div>

      <PreviousTestScores
        attempts={allAttempts}
        currentAttemptId={currentAttemptId}
        skill="listening"
      />
      <div className="mt-10">
        <div className="flex gap-2 items-center justify-start font-extrabold text-[20px] text-[#151515]">
          <Image
            src="/document-text.svg"
            alt="document-text"
            width={24}
            height={24}
            className="fill-[#151515] stroke-white"
          />
          Answer Keys
        </div>
        {results.map((item, index) => {
          const totalQuestion = Object.keys(skillResult[index]).length;
          const correctAnswer = scoreInfo[index];
          aggQuestion += index > 0 ? results[index - 1]?.flat().length : 0;

          return (
            <AnswerPart
              key={item[0].id}
              data={item}
              totalQuestion={totalQuestion}
              part={index + 1}
              correctAnswer={correctAnswer}
              previousLength={aggQuestion}
            />
          );
        })}
      </div>
      <ReviewExplain
        data={test.listening}
        audioURL={test["listening-audio"].url}
        vocabs={test.vocabs}
      />
    </div>
  );
}
export default ListeningResult;
