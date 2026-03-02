/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import AudioPlayer from "@/components/audio-player";
import CriteriaCard from "@/components/card/CriteriaCard";
import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import { Tab } from "@/components/tab/Tab";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateDuration, formatSecondsToHMS } from "@/lib/utils";
import type {
  PeriodicTestAttempt,
  PlacementAttempt,
  Test,
} from "@/payload-types";
import { CircleCheck, LightbulbIcon, Wrench } from "lucide-react";
import { type JSX, useMemo, useState } from "react";
import { FOUR_CRITERIAS_SPEAKING } from "../entrance-test/skill-review";
import CommentItem from "./TabSwitch/CommentItem";
import VocabularySuggestion from "./TabSwitch/VocabularySuggestion";
import SpeakingSample from "./speaking-sample";

import PreviousTestScores from "./previous-test-scores";
import "./speaking.css";

const MAX = 9;
const TIME = 1800;
const maxTime = formatSecondsToHMS(TIME);

/**
 * A functional component that renders the result of a speaking test.
 * @param {{
 *   data: PlacementAttempt;
 *   test: Test;
 * }} props - The properties passed to the component.
 * @returns {JSX.Element} A div containing the test result.
 */
function SpeakingResult({
  data,
  test,
  allAttempts,
  currentAttemptId,
}: {
  data: PlacementAttempt;
  test: Test;
  allAttempts: PeriodicTestAttempt[];
  currentAttemptId: string;
}): JSX.Element {
  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [activeTopic, setActiveTopic] = useState<number>(1);
  const [part, setPart] = useState<number>(1);
  const [bandSample, setBandSample] = useState<number>(1);

  const playerRef = useState<HTMLAudioElement | null>(null);
  const passageRef = useState<HTMLParagraphElement | null>(null);

  const handleSeek = (locateTime: number) => {
    if (playerRef.current && locateTime) {
      playerRef.current.seekTo(locateTime);
    }
  };
  const handleChooseQuestion = (number: number) => {
    setActiveQuestion(number);
  };

  const handleChooseTopic = (number: number) => {
    setActiveQuestion(1);
    setActiveTopic(number);
  };

  const handleChooseBandSample = (number: number) => {
    setBandSample(number);
  };

  const handleChoosePart = (number: number) => {
    setActiveQuestion(1);
    setActiveTopic(1);
    setPart(number);
  };

  const {
    1: {
      comment,
      fc,
      fcScore,
      gra,
      graScore,
      lr,
      lrScore,
      pr,
      prScore,
      overallScore,
      ...restLevel1
    },
    ...rest
  } = data?.answerSheet?.speaking || {};

  const speakingData = {
    1: restLevel1,
    ...rest,
  };
  const { startedAt, statusDetails } = data;

  const { formattedTime, totalSeconds } = useMemo(
    () => calculateDuration(startedAt, statusDetails!.completionTimes.speaking),
    [startedAt],
  );

  const { speaking } = test;

  const criteriaMap: Record<
    string,
    { criteria: Record<string, string>; score: number }
  > = {
    fc: { criteria: fc, score: fcScore },
    lr: { criteria: lr, score: lrScore },
    gra: { criteria: gra, score: graScore },
    pr: { criteria: pr, score: prScore },
  };

  const currentPart = speakingData[part];
  const currentTopic = currentPart[activeTopic];
  const currentQuestion = currentTopic![activeQuestion];

  const question =
    speaking![part - 1]!.Topics[activeTopic - 1]!.questions[activeQuestion - 1];
  const words = question!.vocabs!.map((vocab) => vocab.word);

  return (
    <div className="mt-8">
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
          </p>
        </div>
      </div>
      <PreviousTestScores
        attempts={allAttempts}
        currentAttemptId={currentAttemptId}
        skill="speaking"
      />
      <div className="grid grid-cols-2 gap-4 my-4 place-items-center">
        {FOUR_CRITERIAS_SPEAKING.map((item, index) => {
          const { criteria, score } = criteriaMap[item.key];

          const strongItems = criteria.strongPoints
            .split("\n")
            .map((text: string, i: number) => (
              <div key={`strong-${i}`} className="flex items-center gap-2">
                <CircleCheck size={18} color="#23BD33" />
                <p>{text}</p>
              </div>
            ));

          const improveItems = criteria.improvementPoints
            .split("\n")
            .map((text: string, i: number) => (
              <div key={`improve-${i}`} className="flex items-center gap-2 ">
                <Wrench size={18} />
                <p>{text}</p>
              </div>
            ));
          const suggestItems = criteria.suggest
            .split("\n")
            .map((text: string, i: number) => (
              <div key={`suggest-${i}`} className="flex items-center gap-2">
                <LightbulbIcon size={18} color="#FBA631" />
                <p>{text}</p>
              </div>
            ));
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

      <div className="flex flex-col items-center justify-center gap-[10px] mt-6 mb-4">
        <div className="flex gap-2">
          <Tab
            data={Object.keys(speakingData)}
            name="Part"
            activeTab={part}
            onClickTab={(index) => handleChoosePart(index + 1)}
            size="lg"
          />
        </div>
        {Object.keys(currentPart).length > 1 && (
          <div className="flex gap-2">
            <Tab
              data={Object.keys(currentPart)}
              name="Topic"
              activeTab={activeTopic}
              onClickTab={(index) => handleChooseTopic(index + 1)}
              size="lg"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Tab
            data={Object.keys(currentTopic)}
            activeTab={activeQuestion}
            onClickTab={(index) => handleChooseQuestion(index + 1)}
            size="sm"
          />
        </div>
      </div>

      <p className="text-[#E72929] font-semibold text-[24px] my-2 text-center ">
        {question!.question}
      </p>
      <div className="w-full mb-6 mt-4">
        <AudioPlayer
          audioURL={currentQuestion!.answer.url || ""}
          ref={playerRef}
        />
      </div>

      {currentQuestion.comments && currentQuestion.comments.length > 0 && (
        <div className="flex flex-col gap-6 mx-[101px] p-6 rounded-[24px] border border-[#E7EAE9] shadow-[0_0_60px_0_RGBA(0,0,0,0.04)] mb-6">
          {currentQuestion.comments.map((item: CommentItem) => (
            <CommentItem
              key={item.id}
              data={item}
              handleClick={handleSeek}
              type="comment"
            />
          ))}
        </div>
      )}

      <div className="w-full rounded-[12px] mb-10">
        <div className="rounded-t-[12px] bg-[#E72929] text-white text-center flex font-bold">
          <div className="text-center w-[50%] px-4 py-3">Sample</div>
          <div className="text-center w-[50%] px-4 py-3">Vocab</div>
        </div>
        <div className="flex border rounded-b-[12px]">
          <ScrollArea className="h-[360px] w-[50%] p-4 border-r border-[#E7EAE9] whitespace-pre-wrap">
            <div className="flex gap-2 items-center justify-center mb-2">
              <Tab
                data={[" < 7", " > 7"]}
                name="Sample"
                activeTab={bandSample}
                onClickTab={(index) => handleChooseBandSample(index + 1)}
                size="lg"
              />
            </div>

            <SpeakingSample
              passageRef={passageRef}
              sample={
                bandSample === 1
                  ? question!.sampleBelow7
                  : question!.sampleAbove7
              }
              vocabs={words}
            />
          </ScrollArea>
          <ScrollArea className="w-[50%] p-4">
            <VocabularySuggestion
              words={question!.vocabs}
              onlyShowHigherWord={false}
              ref={passageRef}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
export default SpeakingResult;
