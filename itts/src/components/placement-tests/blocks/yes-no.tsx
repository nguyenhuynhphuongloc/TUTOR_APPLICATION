"use client";

import TextHighlighter from "@/components/text-highlighter/TextHighlighter";
import { cn } from "@/lib/utils";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import isFunction from "lodash-es/isFunction";
import { useEffect, useState } from "react";
import type { Answer, SkillAnswers } from "../types";

type YesNoProps = {
  filledAnswers: SkillAnswers;
  setAnswer: (payload: Answer) => void;
  questions: {
    questionNumber: number;
    correctAnswer: "true" | "false" | "not_given";
    question: string;
    answerLocation?: string | null;
    explanation?: string | null;
    id?: string | null;
  }[];
  id?: string | null;
  blockName?: string | null;
  blockType: "trueFalseNotGiven";
};

type YesNoQuestionProps = {
  questionNumber: number;
  correctAnswer: "true" | "false" | "not_given";
  question: string;
  answerLocation?: string | null;
  explanation?: string | null;
  id?: string | null;
};

type BlockQuestionType = YesNoQuestionProps; // Alias for clarity based on the instruction

function Question({
  question,
  filledAnswers,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
  cacheKey,
}: {
  question: BlockQuestionType;
  filledAnswers: SkillAnswers;
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (payload: string) => void;
  getQuestionNo: (payload: string) => number;
  cacheKey?: string;
}) {
  const questionNo =
    isFunction(getQuestionNo) && question.id ? getQuestionNo(question.id) : -1;
  const [selectedAnswers, setSelectedAnswers] = useState<string>("");

  const onValueChange = (value: string) => {
    setSelectedAnswers(value);
  };

  useEffect(() => {
    if (isFunction(setQuestionNo) && question.id) {
      setQuestionNo(question.id);
    }
  }, []);

  useEffect(() => {
    const filledAnswer = filledAnswers?.[questionNo]?.answer;
    if (!filledAnswer) return;

    setSelectedAnswers(filledAnswer);
  }, [filledAnswers, questionNo]);

  useEffect(() => {
    if (questionNo === undefined) return;
    if (!question.id) return;

    setAnswer({
      id: question.id,
      questionNumber: questionNo,
      correctAnswers: question.correctAnswer,
      answer: selectedAnswers,
      isCorrect: selectedAnswers === question.correctAnswer,
      type: "yesNoNotGiven",
    });
  }, [selectedAnswers, questionNo]);

  if (!question.id) {
    return null;
  }

  return (
    <div
      key={question.id}
      id={question.id}
      className="mb-6 flex flex-col gap-3"
    >
      <p className="text-[16px] font-bold text-left">
        {questionNo}.{" "}
        <TextHighlighter cacheKey={cacheKey}>
          {question.question}
        </TextHighlighter>
      </p>
      <ToggleGroup.Root
        type="single"
        value={selectedAnswers}
        onValueChange={onValueChange}
        className="flex flex-col gap-2"
      >
        {[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "not_given", label: "Not Given" },
        ].map((answer, index) => {
          const isSelected = selectedAnswers === answer.value;
          return (
            <div
              key={index}
              className={cn(
                "inline-flex w-max items-center gap-2",
                "text-[16px] font-normal text-[#6D737A] flex items-center",
                isSelected && "text-[#E72929]",
              )}
            >
              <ToggleGroup.Item
                value={answer.value}
                className={cn(
                  "mr-2 inline-flex h-[28px] w-[28px] font-bold cursor-pointer",
                  "items-center justify-center rounded-full border border-solid",
                  "bg-[#F8F8F8] text-[12px] border-[#E7EAE9]",
                  "data-[state=on]:bg-[#E729291A]",
                  "data-[state=on]:border-[#E7292933]",
                )}
              >
                {String.fromCharCode(65 + index)}
              </ToggleGroup.Item>
              <TextHighlighter cacheKey={`${cacheKey}-ans-${answer.value}`}>
                {answer.label}
              </TextHighlighter>
            </div>
          );
        })}
      </ToggleGroup.Root>
    </div>
  );
}

function YesNo({
  questions,
  filledAnswers,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
  cacheKey,
}: YesNoProps & {
  setQuestionNo: (payload: string) => void;
  getQuestionNo: (payload: string) => number;
  cacheKey?: string;
}) {
  if (!questions) {
    return null;
  }

  return questions.map((question, index) => (
    <Question
      key={question.id}
      question={question}
      filledAnswers={filledAnswers}
      setAnswer={setAnswer}
      setQuestionNo={setQuestionNo}
      getQuestionNo={getQuestionNo}
      cacheKey={`${cacheKey}-q-${index}`}
    />
  ));
}

export default YesNo;
