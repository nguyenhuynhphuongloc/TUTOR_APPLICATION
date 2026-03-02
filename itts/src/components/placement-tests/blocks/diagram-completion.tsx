"use client";

import { Media } from "@/components/media";
import { Input } from "@/components/ui/input";
import { TOUR_STEP_IDS } from "@/constants";
import { isFunction } from "lodash-es";
import { useDeferredValue, useEffect, useState } from "react";
import type { Answer, SkillAnswers } from "../types";
import type { BlockQuestionType, BlockType } from "./types";

function Question({
  question,
  filledAnswers,
  setQuestionNo,
  getQuestionNo,
  setAnswer,
}: {
  filledAnswers: SkillAnswers;
  question: BlockQuestionType;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
  setAnswer: (payload: Answer) => void;
}) {
  const [value, setValue] = useState("");
  const deferredValue = useDeferredValue(value);

  const questionNo =
    isFunction(getQuestionNo) && question.id ? getQuestionNo(question.id) : -1;

  const correctAnswers: string[] = (question.correctAnswer ?? "")
    .split("/")
    .map((answer) => answer.trim());

  useEffect(() => {
    if (isFunction(setQuestionNo) && question.id) {
      setQuestionNo(question.id);
    }
  }, []);

  useEffect(() => {
    const filledAnswer = filledAnswers?.[questionNo]?.answer;
    if (!filledAnswer) return;

    setValue(filledAnswer);
  }, [filledAnswers, questionNo]);

  useEffect(() => {
    if (questionNo === undefined) return;
    if (!question.id) return;

    if (isFunction(setAnswer)) {
      // Trim whitespace and remove leading/trailing punctuation (., ! ? ; :)
      const trimmedAnswer = deferredValue
        .trim()
        .replace(/^[.,!?;:]+|[.,!?;:]+$/g, "")
        .toLowerCase();
      setAnswer({
        id: question.id,
        questionNumber: questionNo,
        answer: deferredValue,
        correctAnswers: correctAnswers,
        isCorrect: correctAnswers.some(
          (answer) =>
            answer
              .trim()
              .replace(/^[.,!?;:]+|[.,!?;:]+$/g, "")
              .toLowerCase() === trimmedAnswer,
        ),
        type: "diagramCompletion",
      });
    }
  }, [deferredValue, questionNo]);

  if (!question.id) {
    return null;
  }

  return (
    <div id={question.id}>
      <p className="text-[16px]">
        <span className="inline-block w-6 font-bold">{questionNo}.</span>{" "}
        <Input
          className="ml-2 inline-block w-auto"
          value={deferredValue}
          onChange={(e) => setValue(e.target.value)}
        />
      </p>
    </div>
  );
}

function DiagramCompletion({
  questions,
  diagramImage,
  filledAnswers,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
}: BlockType & {
  filledAnswers: SkillAnswers;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
  setAnswer: (payload: Answer) => void;
}) {
  if (!questions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {diagramImage && (
        <div className="relative min-h-[360px] w-full select-none">
          <Media
            className=""
            imgClassName="rounded-[12px] object-contain max-h-[600px]"
            resource={diagramImage}
          />
        </div>
      )}
      <div className="mb-6 grid grid-cols-2 gap-3" id={TOUR_STEP_IDS.TAB}>
        {(Array.isArray(questions) ? questions : [])?.map(
          (question: BlockQuestionType) => (
            <Question
              key={question.id}
              filledAnswers={filledAnswers}
              question={question}
              setAnswer={setAnswer}
              setQuestionNo={setQuestionNo}
              getQuestionNo={getQuestionNo}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default DiagramCompletion;
