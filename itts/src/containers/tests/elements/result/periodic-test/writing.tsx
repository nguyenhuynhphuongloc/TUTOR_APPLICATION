/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import CriteriaCard from "@/components/card/CriteriaCard";
import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { Media } from "@/components/media";
import type { EditorValue } from "@/components/placement-tests/types";
import { Tab } from "@/components/tab/Tab";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { calculateDuration, formatSecondsToHMS, roundIELTS } from "@/lib/utils";
import type {
  PeriodicTestAttempt,
  PlacementAttempt,
  Test,
} from "@/payload-types";
import { CircleCheck, LightbulbIcon, Minus, Plus, Wrench } from "lucide-react";
import { Fragment, useRef, useState } from "react";
import { FOUR_CRITERIAS_WRITING } from "../entrance-test/skill-review";
import { countTotalWords } from "../entrance-test/utils";
import TabSwitch from "./TabSwitch/TabSwitch";
import PreviousTestScores from "./previous-test-scores";

const MAX = 9;
const TIME = 3600;

const collapsibleData = [
  { title: "Topic: Writing Task", value: "question" },
  { title: "Answer: Writing Task", value: "answer" },
  { title: "Sample", value: "sample" },
];

export default function WritingResult({
  data,
  test,
  allAttempts,
  currentAttemptId,
}: {
  data: PlacementAttempt;
  test: Test;
  allAttempts: PeriodicTestAttempt[];
  currentAttemptId: string;
}) {
  const [part, setPart] = useState<number>(1);
  const [tabOpened, setTabOpened] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);

  const { mistakes, vocabs, feedbacks, ...writing } =
    data?.answerSheet?.writing || {};

  const results = Object.entries(writing).map(([parentKey, parentValue]) => {
    const child = parentValue[parentKey];
    const feedbacks = parentValue.feedbacks;

    return {
      ...parentValue,
      ...child,
      feedbacks: feedbacks || [],
      overallScore: parentValue.overallScore,
    };
  });

  const { startedAt, statusDetails } = data;

  const partOneScore = Number(results[0]?.overallScore || 0);
  const partTwoScore = Number(results[1]?.overallScore || 0);

  const partScore = part === 1 ? partOneScore : partTwoScore;

  const overallScore = roundIELTS(
    (partOneScore + 2 * partTwoScore) / 3,
  ).toFixed(1);

  const { description, image, content } = test?.writing?.[part - 1];

  const handleChooseTopic = (index: number) => {
    setPart(index);
  };

  const { formattedTime, totalSeconds } = calculateDuration(
    startedAt,
    statusDetails?.completionTimes?.writing,
  );

  const maxTime = formatSecondsToHMS(TIME);

  const handleOpenTab = (value: string) => {
    if (tabOpened.includes(value)) {
      return setTabOpened(tabOpened.filter((item) => item !== value));
    }
    setTabOpened((prev) => [...prev, value]);
  };

  const wordCount = countTotalWords(results[part - 1]?.answer);

  return (
    <div className="flex flex-col items-center">
      <div className="mt-10 flex items-center gap-10">
        <div className="w-full flex items-center justify-center gap-10">
          <div className="flex flex-col items-center">
            <div className="w-[127px] h-[155px]">
              <CircleProgressBar
                value={
                  !isNaN(Number(overallScore))
                    ? (Number(overallScore) * 100) / Number(MAX)
                    : 0
                }
              >
                <div className="text-[32px] mt-6 text-2xl font-bold text-[#E72929]">
                  {isNaN(Number(overallScore)) ? "0.0" : overallScore}
                </div>
              </CircleProgressBar>
            </div>
            <p className="text-center text-[#A8ABB2] mt-[-48px] text-[18px] whitespace-nowrap">
              Overall Score
              {/* :{" "} */}
              {/* <span className="font-bold text-[20px] text-[#151515]">
              {formattedTime}
            </span> */}
            </p>
          </div>
          <div className=" flex flex-col items-center">
            <div className="w-[127px] h-[155px]">
              <CircleProgressBar
                value={
                  !isNaN(Number(totalSeconds))
                    ? (Number(totalSeconds) * 100) / Number(TIME)
                    : 0
                }
              >
                <div className="text-center">
                  <div className="mt-6 text-2xl font-bold text-[#E72929]">
                    {formattedTime}
                  </div>
                  <div className="text-md mt-[-6px] text-[#151515]">
                    ({maxTime})
                  </div>
                </div>
              </CircleProgressBar>
            </div>
            <p className="text-center text-[#A8ABB2] mt-[-48px] text-[18px] whitespace-nowrap">
              Test time
              {/* :{" "} */}
              {/* <span className="font-bold text-[20px] text-[#151515]">
              {formattedTime}
            </span> */}
            </p>
          </div>
        </div>
      </div>
      <PreviousTestScores
        attempts={allAttempts}
        currentAttemptId={currentAttemptId}
        skill="writing"
      />
      <div className="flex gap-2 items-center justify-center mt-8">
        <Tab
          data={
            results && results.length > 0
              ? Array.from({ length: results.length }, (_, index) => index + 1)
              : []
          }
          name="Task"
          activeTab={part}
          onClickTab={(index) => handleChooseTopic(index + 1)}
          size="lg"
        />
      </div>
      <div className="mt-10 flex items-center gap-10">
        <div className="w-full flex flex-col items-center justify-center gap-10">
          <div className="w-[127px]">
            <CircleProgressBar
              value={
                !isNaN(Number(partScore))
                  ? (Number(partScore) * 100) / Number(MAX)
                  : 0
              }
            />
          </div>
          <p className="text-center text-[#A8ABB2] mt-[-48px] text-[18px] whitespace-nowrap">
            Score:{" "}
            <span className="font-bold text-[20px] text-[#151515]">
              {isNaN(Number(partScore)) ? "0.0" : partScore}
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-14 my-10">
        {FOUR_CRITERIAS_WRITING.map((item, index) => {
          const source = results?.[part - 1];
          const score: string = source?.[`${item.key}Score`];

          const strongItems = source?.[item.key]?.strongPoints
            ? source[item.key].strongPoints
                .split("\n")
                .map((text: string, i: number) => (
                  <div key={`strong-${i}`} className="flex items-center gap-2">
                    <CircleCheck size={18} color="#23BD33" />
                    <p>{text}</p>
                  </div>
                ))
            : [];

          const improveItems = source?.[item.key]?.improvementPoints
            ? source[item.key].improvementPoints
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
          const suggestItems = source?.[item.key]?.suggest
            ? source[item.key].suggest
                .split("\n")
                .map((text: string, i: number) => (
                  <div key={`suggest-${i}`} className="flex items-center gap-2">
                    <LightbulbIcon size={18} color="#FBA631" />
                    <p>{text}</p>
                  </div>
                ))
            : [];
          const lines = [...strongItems, ...improveItems, ...suggestItems];

          return (
            <CriteriaCard
              key={item.key}
              name={item.name}
              score={score}
              criteria={lines}
              index={index}
            />
          );
        })}
      </div>
      <div className="w-full">
        <p className="text-[32px] font-bold mt-10 mb-8">Review & Explanation</p>
        <div className="flex justify-between gap-8 w-full mb-10">
          <div className="flex flex-col gap-6 w-full">
            {collapsibleData.map((item) => (
              <Collapsible
                key={item.value}
                open={tabOpened.includes(item.value)}
                onOpenChange={() => handleOpenTab(item.value)}
                className="flex flex-col border border-[#E3DBD8] rounded-[20px]"
              >
                <div className="flex items-center justify-between gap-4 border border-[#E3DBD8] rounded-[20px] p-[18px]">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <CollapsibleTrigger asChild>
                    {!tabOpened.includes(item.value) ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-[#FFEEF0] text-[#E72929]"
                      >
                        <Plus width={20} height={20} />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full bg-[#E72929] text-white"
                      >
                        <Minus width={20} height={20} />
                      </Button>
                    )}
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="flex flex-col gap-2">
                  <div className="mt-2 text-justify whitespace-pre-wrap p-[18px]">
                    {item.value === "question" ? (
                      <Fragment>
                        <Editor
                          value={description as EditorValue}
                          theme={previewEditorTheme}
                          mode="practice"
                        />
                        <div className="">
                          {image && typeof image !== "string" && (
                            <div className="relative mb-4 select-none">
                              <Media
                                imgClassName="rounded-[12px] object cover !relative"
                                resource={image}
                              />
                            </div>
                          )}
                          <Editor
                            value={content as EditorValue}
                            theme={previewEditorTheme}
                            mode="practice"
                          />
                        </div>
                      </Fragment>
                    ) : item.value === "sample" ? (
                      <div>
                        {test?.writing?.[part - 1]?.sample ? (
                          test?.writing?.[part - 1]?.sample
                        ) : (
                          <p className="font-semibold text-[20px] text-center">
                            Không có bài mẫu
                          </p>
                        )}
                      </div>
                    ) : (
                      <div ref={passageRef}>{results[part - 1].answer}</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
          <TabSwitch
            mistakes={mistakes}
            passageRef={passageRef}
            wordCount={wordCount}
            vocabs={vocabs}
            feedbacks={results[part - 1].feedbacks}
          />
        </div>
      </div>
    </div>
  );
}
