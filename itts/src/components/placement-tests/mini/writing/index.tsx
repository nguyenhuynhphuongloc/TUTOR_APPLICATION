"use client";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { Textarea } from "@/components/ui/textarea";

import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Answer, EditorValue } from "../../types";

function Writing({ writing }: Test) {
  const skill = "writing";

  const { filledAnswers, setAnswer } = useStore(
    useShallow((state) => ({
      filledAnswers: state.answerSheet?.writing,
      setAnswer: state.setAnswer,
    })),
  );

  const setWritingAnswer = ({ questionNumber, ...payload }: Answer) => {
    setAnswer(skill, questionNumber, payload);
  };

  useEffect(() => {
    if (writing?.length) {
      writing.forEach(({ id, brainstorm }, idx) => {
        setWritingAnswer({
          questionNumber: idx + 1,
          id: id!,
          answer: filledAnswers?.[idx + 1]?.answer ?? "",
          type: skill,
          correctAnswers:
            typeof brainstorm === "object" &&
            brainstorm !== null &&
            "text" in brainstorm
              ? String(brainstorm.text)
              : "",
        });
      });
    }
  }, [writing]);

  return writing?.map(({ id, description, content }, index) => {
    const questionNumber = index + 1;

    return (
      <div key={index} id={id!} className="flex flex-col gap-10">
        {index === 0 ? (
          <Editor
            value={description as EditorValue}
            theme={previewEditorTheme}
            mode="read_only"
          />
        ) : null}
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 font-bold">
            {index + 1}.
            <Editor
              value={content as EditorValue}
              theme={previewEditorTheme}
              mode="practice"
            />
          </div>
          <div>
            <div className="h-[45px] text-white font-bold text-center border border-[#E72929] p-3 bg-[#E72929] rounded-t-[12px]">
              Write your answer in the box below
            </div>
            <Textarea
              placeholder="Write your answer here..."
              className="w-full h-[200px] rounded-t-none rounded-b-[12px]"
              value={filledAnswers?.[questionNumber]?.answer ?? ""}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                event.preventDefault();
                if (!id) return;

                setWritingAnswer({
                  questionNumber,
                  id,
                  answer: event.target.value,
                  type: skill,
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  });
}

export default Writing;
