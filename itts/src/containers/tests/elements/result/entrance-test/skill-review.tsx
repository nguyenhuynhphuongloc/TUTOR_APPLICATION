/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import CriteriaCard from "@/components/card/CriteriaCard";
import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import type { Answer, EditorValue } from "@/components/placement-tests/types";
import { cn, flattenData } from "@/lib/utils";
import {
  CheckIcon,
  CircleCheck,
  LightbulbIcon,
  Wrench,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, type JSX } from "react";

export const FOUR_CRITERIAS_WRITING = [
  { name: "Task Achievement (TA)", key: "ta" },
  {
    name: "Lexical Resources (LR)",
    key: "lr",
  },
  { name: "Coherence & Cohesion (CC)", key: "cc" },
  { name: "Grammatical Range & Accuracy (GRA)", key: "gra" },
];

export const FOUR_CRITERIAS_SPEAKING = [
  { name: "Fluency and Coherence (FC)", key: "fc" },
  {
    name: "Lexical Resource (LR)",
    key: "lr",
  },
  { name: "Grammatical Range and Accuracy (GRA)", key: "gra" },
  { name: "Pronunciation (PR)", key: "pr" },
];

/**
 * A functional component that renders a card with information about the user's answer.
 *
 * @param {{
 *   isCorrect: boolean;
 *   answer: string | null;
 *   type: "mini" | "full";
 *   isPdf: boolean;
 *   isMini: boolean;
 *   description: EditorValue;
 *   content: EditorValue;
 *   image: MediaResource | string | null;
 *   brainstorm: EditorValue | null;
 *   number: number | null;
 * }} props - The properties passed to the component.
 * @returns {JSX.Element} A div containing the user's answer information.
 */
const WritingResultCard = ({
  isCorrect,
  answer,
  type,
  isPdf,
  isMini,
  description,
  content,
  image,
  brainstorm,
  number,
}: {
  isCorrect: boolean;
  answer: string | null;
  type: "mini" | "full";
  isPdf: boolean;
  isMini: boolean;
  description: EditorValue;
  content: EditorValue;
  image: string | null;
  brainstorm: EditorValue | null;
  number: number | null;
}): JSX.Element => {
  return (
    <div
      className={cn(
        "border rounded-[16px] p-6 relative",
        isCorrect
          ? "border-[#23BD334D]"
          : answer
            ? "border-[#E729294D]"
            : "border-[#EBA3524D]",
      )}
    >
      {type === "mini" && (
        <div
          className={cn(
            "absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center",
            isCorrect
              ? "bg-[#23BD33]"
              : answer
                ? "bg-[#E72929]"
                : "bg-[#EBA352]",
          )}
        >
          {isCorrect ? (
            <CheckIcon width={15} height={15} stroke="white" />
          ) : answer ? (
            <XIcon width={12} height={12} stroke="white" />
          ) : (
            <span className="text-white text-[12px]">!</span>
          )}
        </div>
      )}
      <div className="flex gap-3 flex-col">
        <div className="flex gap-2 font-extrabold text-[16px]">
          {`${number ? `${number}. ` : ""}`}
          <span style={{ marginTop: isPdf ? -14 : 0 }}>
            {!isMini && (
              <Editor
                value={description}
                theme={previewEditorTheme}
                mode="practice"
              />
            )}
            {image && (image as any).url && (
              <div
                className="relative mb-4 select-none"
                style={{ marginTop: isPdf ? 14 : 0 }}
              >
                <Image
                  src={(image as any).url}
                  width={(image as any).width}
                  height={(image as any).height}
                  alt="hehe"
                  priority
                  unoptimized
                />
              </div>
            )}
            <Editor
              value={content}
              theme={previewEditorTheme}
              mode="practice"
            />
          </span>
        </div>
        <div
          className="text-[#6D737A] font-medium whitespace-pre-line"
          // style={{ marginBottom: isPdf ? 14 : 0 }}
        >
          {answer && answer}
        </div>
        {isMini && (
          <div style={{ marginTop: isPdf ? 14 : 0 }}>
            <span className="text-[#23BD33] font-extrabold flex gap-2">
              Suggested answer:{" "}
              {brainstorm && (
                <Editor
                  value={brainstorm}
                  mode="practice"
                  theme={previewEditorTheme}
                />
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * A functional component that renders a review of the user's answers.
 *
 * @param {{ type: "mini" | "full"; skillResult: {id: number, answer: string | null, isCorrect: boolean, correctAnswers: string}[]; isPdf: boolean; writingQuestions: string[] }} props - The properties passed to the component.
 * @returns {JSX.Element} A div containing the text 'skill-review'.
 */

const MAX = 9;
export default function SkillReview({
  type,
  skillResult,
  isPdf,
  writingQuestions,
  skill,
}: {
  type: "mini" | "full";
  skillResult: any[];
  isPdf: boolean;
  writingQuestions: any[];
  skill: string;
}): JSX.Element {
  // const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [part, setPart] = useState<number>(1);
  const isWriting = skill === "writing";
  const isMini = type === "mini";

  const data = isMini ? skillResult : flattenData(skillResult.slice(0, 2));

  const partScore = isMini
    ? undefined
    : Number(data[part - 1]?.overallScore || 0);

  // const handleChooseQuestion = (number: number) => {
  //   setActiveQuestion(number);
  // };

  const handleChoosePart = (number: number) => {
    setPart(number);
    // setActiveQuestion(1);
  };

  return (
    <div>
      {type === "full" && (
        <div>
          {isWriting && (
            <div className="flex flex-col items-center ">
              <div className="flex items-center justify-center gap-[10px] mt-4">
                {data.map((item: any, index: number) => {
                  return (
                    <div
                      key={item?.id || index}
                      className={cn(
                        "w-[118px] h-[44px] rounded-[8px] text-center flex items-center justify-center cursor-pointer",
                        part === index + 1
                          ? "bg-[#E72929]"
                          : "bg-white  border border-[#F1F1F1]",
                      )}
                      onClick={() => handleChoosePart(index + 1)}
                    >
                      <p
                        className={cn(
                          "text-[16px]  font-semibold",
                          part === index + 1 ? "text-white" : "text-[#151515]",
                        )}
                        style={{ marginTop: isPdf ? -14 : 0 }}
                      >
                        Task {index + 1}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="w-[127px] mt-6">
                <CircleProgressBar
                  value={
                    !isNaN(Number(partScore))
                      ? (Number(partScore) * 100) / Number(MAX)
                      : 0
                  }
                >
                  <div className="text-center">
                    <div
                      className={cn(
                        "mt-6 text-2xl font-bold text-[#E72929] text-[32px]",
                      )}
                    >
                      {isNaN(Number(partScore)) ? "0.0" : partScore}
                    </div>
                  </div>
                </CircleProgressBar>
                <p className="text-center text-[#A8ABB2] text-[16px] mt-[-16px]">
                  Score
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-6 my-10">
              {(skill === "writing"
                ? FOUR_CRITERIAS_WRITING
                : FOUR_CRITERIAS_SPEAKING
              ).map((item, index) => {
                const source = data && isWriting ? data[part - 1] : data?.[0];

                const strongItems = source[item.key]?.strongPoints
                  ? source[item.key]?.strongPoints
                      .split("\n")
                      .map((text: string, i: number) => (
                        <div
                          key={`strong-${i}`}
                          className="flex items-center gap-2"
                        >
                          <CircleCheck size={18} color="#23BD33" />
                          <p>{text}</p>
                        </div>
                      ))
                  : [];

                const improveItems = source[item.key]?.improvementPoints
                  ? source[item.key]?.improvementPoints
                      .split("\n")
                      .map((text: string, i: number) => (
                        <div
                          key={`improve-${i}`}
                          className="flex items-center gap-2 "
                        >
                          <Wrench size={18} />
                          <p>{text}</p>
                        </div>
                      ))
                  : [];
                const suggestItems = source[item.key]?.suggest
                  ? source[item.key]?.suggest
                      .split("\n")
                      .map((text: string, i: number) => (
                        <div
                          key={`suggest-${i}`}
                          className="flex items-center gap-2"
                        >
                          <LightbulbIcon size={18} color="#FBA631" />
                          <p>{text}</p>
                        </div>
                      ))
                  : [];
                const lines = [
                  ...strongItems,
                  ...improveItems,
                  ...suggestItems,
                ];

                return (
                  <CriteriaCard
                    key={item.key}
                    name={item.name}
                    score={source?.[`${item.key}Score`] as any}
                    criteria={lines}
                    index={index}
                    isPdf={isPdf}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      {skill === "speaking" ? (
        <div>
          {/* <div className="flex items-center justify-center gap-[10px] mb-4">
            {data.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-[118px] h-[44px] rounded-[8px] text-center flex items-center justify-center cursor-pointer",
                  part === index + 1
                    ? "bg-[#E72929]"
                    : "bg-white  border border-[#F1F1F1]",
                )}
                onClick={() => handleChoosePart(index + 1)}
              >
                <p
                  className={cn(
                    "text-[13px]  font-semibold",
                    part === index + 1 ? "text-white" : "text-[#151515]",
                  )}
                >
                  Part {index + 1}
                </p>
              </div>
            ))}
          </div> */}
          {/* <div className="flex items-center justify-center gap-[10px] mb-10">
            {Object.keys(data[part - 1]).map(
              (questionNumber: string, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-[8px] text-center flex items-center justify-center cursor-pointer",
                    activeQuestion === index + 1
                      ? "bg-[#E72929]"
                      : "bg-white border border-[#F1F1F1]",
                  )}
                  onClick={() => handleChooseQuestion(+questionNumber)}
                >
                  <p
                    className={cn(
                      "text-[13px]  font-semibold",
                      activeQuestion === +questionNumber
                        ? "text-white"
                        : "text-[#151515]",
                    )}
                  >
                    {questionNumber}
                  </p>
                </div>
              ),
            )}
          </div> */}

          {/* <AudioPlayer
            audioURL={data[part - 1][activeQuestion]?.answer?.url as string}
          /> */}
        </div>
      ) : (
        <div className="w-[1392px] flex flex-col justify-start gap-6 text-start font-semibold text-[16px] text-[#151515] mt-10">
          {isMini ? (
            data.map((result: Answer, index: number) => {
              return (
                result && (
                  <WritingResultCard
                    key={result.id}
                    isPdf={isPdf}
                    isMini={isMini}
                    number={index + 1}
                    {...writingQuestions?.[index]}
                    {...result}
                  />
                )
              );
            })
          ) : (
            <WritingResultCard
              {...data[part - 1]}
              isPdf={isPdf}
              isMini={isMini}
              {...writingQuestions?.[part - 1]}
            />
          )}
        </div>
      )}
    </div>
  );
}
