import { JSX } from "react";
import Answer from "./answer";
import { COLUMN_COUNT } from "./utils";

type AnswersData = {
  id: string;
  type: "diagramCompletion";
  answer: string;
  isCorrect: boolean;
  correctAnswers: string[];
}[][];

/**
 * Renders a part of a skill score, including the correct answer count and the answers.
 *
 * @param {{
 *   data: AnswersData;
 *   isPdf: boolean;
 *   isMini: boolean;
 *   totalQuestion: number;
 *   part: number;
 *   correctAnswer: number;
 *   previousLength:number
 * }} props
 * @returns {JSX.Element}
 */
function AnswerPart({
  data,
  isPdf,
  isMini,
  totalQuestion,
  part,
  correctAnswer,
  previousLength = 0,
}: {
  data: AnswersData;
  isPdf?: boolean;
  isMini?: boolean;
  totalQuestion: number;
  part?: number;
  correctAnswer: number;
  previousLength?: number;
}): JSX.Element {
  return (
    <div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[#6D737A] font-bold text-[20px]">
          {!isMini ? `Part ${part}: ` : ""}Question {1 + previousLength} -{" "}
          {totalQuestion + previousLength}
        </p>
        <p className="text-[#6D737A] text-[16px]">
          Total number of correct questions:
          <span className="text-[#23BD33] font-bold">
            {correctAnswer}/{totalQuestion}
          </span>
        </p>
      </div>

      <div className="w-full mx-auto mt-4">
        <div className="grid grid-cols-5 gap-4">
          {data.map((column, colIdx) => {
            const rowCount = Math.ceil(data.flat().length / COLUMN_COUNT);

            return (
              <div key={column[0]?.id} className="flex flex-col space-y-2">
                {column.map((c, index) => {
                  const { id, answer, correctAnswers, isCorrect } = c;
                  return (
                    <Answer
                      key={id}
                      isPdf={isPdf}
                      answer={answer}
                      isCorrect={isCorrect}
                      correctAnswers={correctAnswers}
                      number={index + 1 + colIdx * rowCount + previousLength}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AnswerPart;
