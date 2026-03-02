"use client";

import { Input } from "@/components/ui/input";
import { isFunction } from "lodash-es";
import { useDeferredValue, useEffect, useState } from "react";
import type { Answer } from "../types";
import type { BlockQuestionType, BlockType } from "./types";

function Question({
  question,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
}: {
  question: BlockQuestionType;
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
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
    if (questionNo === undefined) return;
    if (!question.id) return;

    if (isFunction(setAnswer)) {
      if (isFunction(setAnswer)) {
        setAnswer({
          id: question.id,
          questionNumber: questionNo,
          answer: value,
          correctAnswers: correctAnswers,
          isCorrect: correctAnswers.some(
            (answer) => answer.toLowerCase() === deferredValue.toLowerCase(),
          ),
          type: "short-answer",
        });
      }
    }
  }, [deferredValue, questionNo]);

  if (!question.id) {
    return null;
  }

  return (
    <div id={question.id}>
      <p className="text-[16px]">
        <span className="inline-block w-6 font-bold">{questionNo}.</span>{" "}
        {question.question}
        <Input
          className="ml-2 inline-block w-auto"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          // disabled
          // defaultValue={question.correctAnswer}
        />
      </p>
    </div>
  );
}

function ShortAnswer({
  questions,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
}: BlockType & {
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
}) {
  if (!questions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-6 flex flex-col gap-3">
        {(Array.isArray(questions) ? questions : [])?.map(
          (question: BlockQuestionType) => (
            <Question
              key={question.id}
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

export default ShortAnswer;
