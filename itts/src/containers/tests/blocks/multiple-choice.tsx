"use client";

import { cn } from "@/lib/utils";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import isArray from "lodash-es/isArray";
import isEqual from "lodash-es/isEqual";
import isFunction from "lodash-es/isFunction";
import { useEffect, useState } from "react";
import type { Answer, SkillAnswers } from "../types";

type MultipleChoiceProps = {
  filledAnswers: SkillAnswers;
  setAnswer: (payload: Answer) => void;
  questions: {
    questionNo: number;
    question: string;
    answerLocation?: string | null;
    explanation?: string | null;
    isMultipleCorrectAnswer?: boolean | null;
    answer: {
      answer: string;
      correctAnswer: boolean;
      id?: string | null;
    }[];
    id?: string | null;
  }[];
  id?: string | null;
  blockName?: string | null;
  blockType: "multipleChoice";
};

function Option({
  answer,
  idx,
}: {
  answer: string;
  correctAnswer: boolean;
  id?: string | null;
  idx: number;
}) {
  return (
    <>
      <span
        className={cn(
          "mr-2 inline-flex h-[28px] w-[28px] font-bold",
          "items-center justify-center rounded-full border border-solid",
          "bg-[#F8F8F8] text-[12px] border-[#E7EAE9]",
          "group-data-[state=on]:bg-[#E729291A]",
          "group-data-[state=on]:border-[#E7292933]",
        )}
      >
        {String.fromCharCode(65 + idx)}
      </span>
      <span>{answer}</span>
    </>
  );
}

function Question({
  question,
  setAnswer,
  filledAnswers,
  setQuestionNo,
  getQuestionNo,
}: {
  question: MultipleChoiceProps["questions"][number];
  setAnswer: (payload: Answer) => void;
  filledAnswers: SkillAnswers;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
}) {
  const questionNo =
    isFunction(getQuestionNo) && question.id ? getQuestionNo(question.id) : -1;

  const type = question.isMultipleCorrectAnswer ? "multiple" : "single";
  const [selectedAnswers, setSelectedAnswers] = useState<string | string[]>();

  const correctAnswers: string[] = (question.answer ?? []).reduce(
    (values: string[], currValue, index) => {
      if (currValue.correctAnswer) {
        values.push(String.fromCharCode(65 + index));
      }
      return values;
    },
    [],
  );

  const onValueChange = (value: string | string[]) => {
    setSelectedAnswers(value);
  };

  useEffect(() => {
    const filledAnswer = filledAnswers?.[questionNo]?.answer;

    if (!filledAnswer) return;
    if (isArray(filledAnswer)) return;

    const answerIndex = filledAnswer.charCodeAt(0) - 65;

    setSelectedAnswers(String(answerIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filledAnswers, questionNo]);

  useEffect(() => {
    if (isFunction(setQuestionNo) && question.id) {
      setQuestionNo(question.id);
    }
  }, []);

  useEffect(() => {
    if (questionNo === undefined) return;
    if (!question.id) return;

    if (!isFunction(setAnswer)) return;
    if (isArray(selectedAnswers)) return;
    let alphabet = "";

    if (selectedAnswers) {
      alphabet = String.fromCharCode(65 + Number(selectedAnswers));
    }
    setAnswer({
      id: question.id,
      questionNumber: questionNo,
      answer: alphabet,
      correctAnswers,
      isCorrect: isEqual(correctAnswers, [alphabet]),
      type: "multipleChoice",
    });
  }, [selectedAnswers, questionNo]);

  if (!question.id) {
    return null;
  }

  return (
    <div id={question.id}>
      <p className="text-[16px] font-bold">
        {questionNo}. {question.question}
      </p>
      {/* @ts-expect-error type mismatch issue */}
      <ToggleGroup.Root
        type={type}
        value={selectedAnswers}
        onValueChange={onValueChange}
        className="flex flex-col gap-2"
      >
        {question?.answer?.map((answer, index) => (
          <ToggleGroup.Item
            key={index}
            value={String(index)}
            className={cn(
              "inline-flex w-max items-center gap-2 cursor-pointer",
              "text-[16px] font-normal text-[#6D737A] flex items-center",
              "data-[state=on]:text-[#E72929]",
              "group",
            )}
          >
            <Option {...answer} idx={index} />
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}

function MultipleChoice({
  questions,
  filledAnswers,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
  id,
}: MultipleChoiceProps & {
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
  id: string;
}) {
  return questions.map((question, index) => (
    <div key={question.id} className="mb-6 flex flex-col gap-3" id={id}>
      <Question
        question={question}
        filledAnswers={filledAnswers}
        setAnswer={setAnswer}
        setQuestionNo={setQuestionNo}
        getQuestionNo={getQuestionNo}
      />
    </div>
  ));
}

export default MultipleChoice;
