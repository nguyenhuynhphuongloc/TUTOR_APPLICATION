"use client";

import TextHighlighter from "@/components/text-highlighter/TextHighlighter";
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
  mode,
  cacheKey,
}: {
  question: BlockQuestionType;
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
  mode?: any;
  cacheKey?: string;
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
    if (questionNo === undefined || !question.id || mode !== "practice") return;

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
  }, [deferredValue, questionNo, mode]);

  if (!question.id) {
    return null;
  }

  return (
    <div id={question.id}>
      <p className="text-[16px]">
        <span className="inline-block w-6 font-bold">{questionNo}.</span>{" "}
        <TextHighlighter cacheKey={cacheKey}>
          {question.question}
        </TextHighlighter>
        <Input
          className="ml-2 inline-block w-auto"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={mode !== "practice"}
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
  mode,
  cacheKey,
}: BlockType & {
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
  mode?: any;
  cacheKey?: string;
}) {
  if (!questions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-6 flex flex-col gap-3">
        {(Array.isArray(questions) ? questions : [])?.map(
          (question: BlockQuestionType, index) => (
            <Question
              key={question.id}
              question={question}
              setAnswer={setAnswer}
              setQuestionNo={setQuestionNo}
              getQuestionNo={getQuestionNo}
              mode={mode}
              cacheKey={`${cacheKey}-q-${index}`}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default ShortAnswer;
