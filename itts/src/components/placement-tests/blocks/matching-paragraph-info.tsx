"use client";

import isString from "lodash-es/isString";

import TextHighlighter from "@/components/text-highlighter/TextHighlighter";
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
import type { BlockQuestionType } from "./types";

function Question({
  question,
  filledAnswers,
  options,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
  mode,
  cacheKey,
}: {
  question: BlockQuestionType;
  options: string;
  filledAnswers: SkillAnswers;
  setQuestionNo: (payload: string) => void;
  getQuestionNo: (payload: string) => number;
  setAnswer: (payload: Answer) => void;
  mode?: any;
  cacheKey?: string;
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
    if (questionNo === undefined || !question.id || mode !== "practice") return;

    if (isFunction(setAnswer)) {
      setAnswer({
        id: question.id,
        questionNumber: questionNo,
        answer: value,
        correctAnswers: question.correctAnswer,
        isCorrect: question.correctAnswer === value,
        type: "matchingParagraphInfo",
      });
    }
  }, [value, questionNo, mode]);

  if (!question.id) {
    return null;
  }

  return (
    <div id={question.id} className="text-[16px]">
      <span className="inline-block w-6 font-bold">{questionNo}.</span>{" "}
      <TextHighlighter cacheKey={cacheKey}>{question.question}</TextHighlighter>
      <Select
        value={value}
        onValueChange={setValue}
        disabled={mode !== "practice"}
      >
        <SelectTrigger className="ml-2 inline-flex w-max">
          <SelectValue placeholder="Select " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {isString(options)
              ? new Array(options.toUpperCase().charCodeAt(0) - 64)
                  .fill(0)
                  .map((_, index) => (
                    <SelectItem
                      key={index}
                      value={String.fromCharCode(65 + index)}
                      className="text-center"
                    >
                      {String.fromCharCode(65 + index)}
                    </SelectItem>
                  ))
              : null}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function MatchingParagraphInfo({
  questions,
  filledAnswers,
  options,
  setAnswer,
  setQuestionNo,
  getQuestionNo,
  mode,
  cacheKey,
}: {
  questions?: BlockQuestionType[];
  filledAnswers: SkillAnswers;
  options: string;
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (payload: string) => void;
  getQuestionNo: (payload: string) => number;
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
              filledAnswers={filledAnswers}
              question={question}
              options={options}
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

export default MatchingParagraphInfo;
