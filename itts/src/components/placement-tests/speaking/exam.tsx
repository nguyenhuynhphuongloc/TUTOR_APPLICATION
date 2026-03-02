/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayCircleIcon } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";
import type { EditorValue } from "../types";
import Question from "./question";

/**
 * Renders a speaking exam with a question and an editor to show the question's description.
 * The question is rendered if the test has started.
 *
 * @param {{ name: string; data: { description: EditorValue; questions: never[] }[] }} props
 * @returns {JSX.Element}
 */
export default function Exam({
  name,
  data,
}: {
  name: string;
  data: { description: EditorValue; questions: never[] }[];
}): JSX.Element {
  const [part, setPart] = useState<number>(1);
  const [isStartTest, setStartTest] = useState<boolean>(false);
  const audioRefs = useRef(
    data.map((d, index) => ({ part: index + 1, audios: [] })),
  );

  const questions = data[part - 1].questions;

  useEffect(() => {
    setStartTest((prev) => !prev);
  }, [part]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={cn(
          "gap-[40px] py-15 w-[1038px]  bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] rounded-[26px]",
          isStartTest ? "min-h-[544px]" : "min-h-[478px]",
        )}
      >
        <div className="h-[76px] flex justify-center items-center text-center font-bold text-[24px] border-b border-b-[#E7EAE9]">
          PART {part}: INTRODUCTION AND INTERVIEW
        </div>

        <div className="p-[60px] flex items-center justify-center flex-col gap-[40px]">
          {isStartTest ? (
            <Question
              questions={questions}
              part={part}
              setPart={setPart}
              audioRefs={audioRefs}
            />
          ) : (
            <>
              <Editor
                value={data[part - 1].description}
                theme={previewEditorTheme}
                mode="practice"
              />
              <Button onClick={() => setStartTest(true)} variant="default">
                Start Now <PlayCircleIcon />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
