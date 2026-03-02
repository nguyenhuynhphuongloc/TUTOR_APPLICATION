"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isFunction } from "lodash-es";
import { useEffect, useState } from "react";
import type { Answer, SkillAnswers } from "../types";
import type { BlockOptionType, BlockQuestionType, BlockType } from "./types";

function Question({
  question,
  options,
  filledAnswers,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
}: {
  question: BlockQuestionType;
  filledAnswers: SkillAnswers;
  options: BlockOptionType[];
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
}) {
  const [value, setValue] = useState("");

  const questionNo =
    isFunction(getQuestionNo) && question.id ? getQuestionNo(question.id) : -1;

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
      if (isFunction(setAnswer)) {
        setAnswer({
          id: question.id,
          questionNumber: questionNo,
          answer: value,
          correctAnswers: question.correctAnswer,
          isCorrect: question.correctAnswer === value,
          type: "matching",
        });
      }
    }
  }, [value, questionNo]);

  if (!question.id) {
    return null;
  }

  return (
    <div id={question.id}>
      <p className="text-[16px]">
        <span className="inline-block w-6 font-bold">{questionNo}.</span>{" "}
        {question.question}
      </p>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-max">
          <SelectValue placeholder="Select a heading" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(Array.isArray(options) ? options : [])?.map(
              (option: BlockOptionType) => (
                <SelectItem key={option.id} value={option.value}>
                  <span className="inline-block w-9 font-bold">
                    {option.value?.toUpperCase()}.
                  </span>{" "}
                  {option.label}
                </SelectItem>
              ),
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function Matching({
  questions,
  filledAnswers,
  options,
  matchingLabel,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
}: BlockType & {
  filledAnswers: SkillAnswers;
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
}) {
  if (!questions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-[#E7EAE9] px-6 py-4">
        {matchingLabel ? (
          <h3 className="mb-3 text-[16px] font-bold text-[#151515]">
            {matchingLabel}
          </h3>
        ) : null}
        <div className="flex flex-col gap-1">
          {(Array.isArray(options) ? options : [])?.map(
            (option: BlockOptionType) => (
              <p key={option.id} className="text-[14px]">
                <span className="inline-block w-9 font-bold">
                  {option.value?.toUpperCase()}.
                </span>{" "}
                {option.label}
              </p>
            ),
          )}
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        {(Array.isArray(questions) ? questions : [])?.map(
          (question: BlockQuestionType) => (
            <Question
              key={question.id}
              question={question}
              filledAnswers={filledAnswers}
              options={Array.isArray(options) ? options : []}
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

export default Matching;
