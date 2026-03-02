"use client";

import { NodeKey } from "lexical";
import isFunction from "lodash-es/isFunction";
import { useCallback, useContext, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { SentenceCompletionContext } from "@/contexts/CompletionContext";

export default function InputComponent({
  uuid,
  answer,
  readOnly,
}: {
  nodeKey: NodeKey;
  uuid: string;
  answer: string;
  answerLocation?: string;
  explanation?: string;
  readOnly?: boolean;
}): React.JSX.Element {
  const { getQuestionNo, filledAnswers, setAnswer } = useContext(
    SentenceCompletionContext,
  );
  const questionNo = isFunction(getQuestionNo) ? getQuestionNo(uuid) : -1;

  const [value, setValue] = useState("");

  const correctAnswers: string[] = answer
    .split("/")
    .map((answer) => answer.trim());

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  useEffect(() => {
    const filledAnswer = filledAnswers?.[questionNo]?.answer;

    if (filledAnswer) {
      setValue(filledAnswer);
    }
  }, [filledAnswers, questionNo]);

  useEffect(() => {
    if (questionNo === undefined || !uuid || !isFunction(setAnswer) || readOnly)
      return;

    setAnswer({
      id: uuid,
      questionNumber: questionNo,
      answer: value,
      correctAnswers: correctAnswers,
      isCorrect: correctAnswers.some(
        (answer) => answer.toLowerCase().trim() === value.toLowerCase().trim(),
      ),
      type: "diagramCompletion",
    });
  }, [value, questionNo, readOnly]);

  return (
    <div className="flex items-center px-2">
      <span className="mr-2 font-bold">{questionNo}</span>
      <Input
        type="text"
        className="flex-1 my-0.5"
        value={value}
        onChange={onChange}
        disabled={readOnly}
      />
    </div>
  );
}
