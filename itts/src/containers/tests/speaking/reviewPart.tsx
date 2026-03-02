/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import AudioPlayer from "@/components/audio-player";
import { Tab } from "@/components/tab/Tab";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkipForwardIcon } from "lucide-react";

import { Word } from "@/payload-types";
import { motion } from "motion/react";
import { type JSX, type RefObject, useState } from "react";
import VocabularySuggestion from "../elements/result/periodic-test/TabSwitch/VocabularySuggestion";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
/**
 * Renders a review part of a speaking test, including the part number, topics, and audio player.
 *
 * @param {{ part: number, topics: Array<{ questions: Array<{ question: string }>, audios: string[] }>, isEnd: boolean, audioRefs: React.MutableRefObject<Array<{ part: number, topics: Array<{ audios: string[] }> }>>, handleNextPart: () => void }} props
 * @returns {JSX.Element}
 */
export default function ReviewPart({
  part,
  topics,
  isEnd,
  audioRefs,
  handleNextPart,
}: {
  part: number;
  topics: Array<{
    questions: Array<{
      question: any;
      vocabs: Word[];
      sampleBelow7: string;
      sampleAbove7: string;
    }>;
    audios: string[];
  }>;
  isEnd: boolean;
  audioRefs: RefObject<
    Array<{ part: number; topics: Array<{ audios: string[] }> }>
  >;
  handleNextPart: () => void;
}): JSX.Element {
  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [activeTopic, setActiveTopic] = useState<number>(1);
  const [bandSample, setBandSample] = useState<number>(1);

  const currentTopic = topics[activeTopic - 1];
  const currentQuestion = currentTopic!.questions[activeQuestion - 1];

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

  return (
    <ScrollArea>
      <motion.div
        key="review-mode"
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="items-center justify-center"
      >
        <div className="text-center mb-4">
          <p className="text-[32px] font-extrabold text-[#6D737A]">
            IT’S THE END OF PART {part}
          </p>
          <p className="text-[#E72929] text-[16px]">
            You can review your part {part} recording by clicking the Play
            button below
          </p>
          {part === 3 && (
            <p className="text-[#E72929] text-[16px]">
              {`and click "Submit" to finish the Speaking test.`}
            </p>
          )}
        </div>

        {part !== 2 && (
          <div className="flex flex-col items-center justify-center gap-[10px]">
            {part !== 3 && (
              <div className="flex gap-2">
                <Tab
                  data={topics}
                  name="Topic"
                  activeTab={activeTopic}
                  onClickTab={(index) => handleChooseTopic(index + 1)}
                  size="lg"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Tab
                data={topics[activeTopic - 1]!.questions}
                activeTab={activeQuestion}
                onClickTab={(index) => handleChooseQuestion(index + 1)}
                size="sm"
              />
            </div>
          </div>
        )}

        <p className="text-[#E72929] font-semibold text-[24px] my-2 text-center ">
          {currentQuestion!.question}
        </p>
        <div className="w-full mb-4">
          <AudioPlayer
            audioURL={
              audioRefs.current[part - 1]!.topics[activeTopic - 1]!.audios[
                activeQuestion - 1
              ] as string
            }
          />
        </div>

        <div className="w-full rounded-[12px] ">
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
              {bandSample === 1 ? (
                <p>{currentQuestion!.sampleBelow7}</p>
              ) : (
                <p>{currentQuestion!.sampleAbove7}</p>
              )}
            </ScrollArea>
            <ScrollArea className="w-[50%] p-4">
              <VocabularySuggestion
                words={currentQuestion!.vocabs}
                onlyShowHigherWord={false}
              />
            </ScrollArea>
          </div>
        </div>

        <div className="flex items-center justify-center gap-[24px] mt-10">
          {!isEnd && (
            <Button onClick={handleNextPart} size="lg" variant="light">
              Next Part
              <SkipForwardIcon />
            </Button>
          )}
        </div>
      </motion.div>
    </ScrollArea>
  );
}
