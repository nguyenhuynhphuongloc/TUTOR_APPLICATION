"use client";

import { lazy } from "react";
import type { Answer } from "../types";
import type { BlockQuestionType, BlockType } from "./types";

const Editor = lazy(() => import("@/components/editor"));

import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { SentenceCompletionContext } from "@/contexts/CompletionContext";

function SentenceCompletion({
  questions,
  ...otherProps
}: BlockType & {
  question: BlockQuestionType;
  setAnswer: (payload: Answer) => void;
  setQuestionNo: (id: string) => void;
  getQuestionNo: (id: string) => number;
}) {
  return (
    <SentenceCompletionContext value={otherProps}>
      <div className="mb-6">
        <Editor
          value={questions as any}
          theme={previewEditorTheme}
          mode="practice"
        />
      </div>
    </SentenceCompletionContext>
  );
}

export default SentenceCompletion;
