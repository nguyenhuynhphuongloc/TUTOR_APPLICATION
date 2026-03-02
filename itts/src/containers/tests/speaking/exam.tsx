/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import PlayCircleIcon from "@/components/icons/play-circle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Test } from "@/payload-types";
import { AnimatePresence, motion } from "motion/react";
import type { JSX } from "react";
import { useRef, useState } from "react";
import Question from "./question";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const PART_INTRODUCTION = {
  1: "INTRODUCTION AND INTERVIEW",
  2: "LONG TURN (CUE CARD)",
  3: "DISCUSSION & ABSTRACT QUESTIONS",
};
type PartInstructionProps = {
  part: 1 | 2 | 3;
};

const instructionsMap: Record<1 | 2 | 3, string> = {
  1: "In this first part, the examiner will ask you some questions about yourself.",
  2: "In this part, you will be given a topic and you have 1-2 minutes to talk about that topic.",
  3: "In this part, you will be asked some more abstract questions based on the topic from part 2.",
};

const detailMap: Record<1 | 2 | 3, string> = {
  1: "You have some time to think about each question. Click the timer to start speaking immediately.",
  2: "Before speaking, you have 1 minute to think about what you are going to say and you can take notes if you wish.",
  3: "You have some time to think about each question. Click the timer to start speaking immediately.",
};

export const PartInstruction: React.FC<PartInstructionProps> = ({ part }) => {
  return (
    <section className="flex flex-col gap-10 justify-center items-center">
      <h2 className="text-[#6D737A] text-[32px] font-extrabold">
        INSTRUCTIONS
      </h2>
      <article className="text-[#6D737A] text-[18px] text-center ">
        <p>{instructionsMap[part]}</p>
        <p>{detailMap[part]}</p>
        <p>You can start answering after the beep sound.</p>
      </article>
    </section>
  );
};

/**
 * Renders a speaking exam with a question and an editor to show the question's description.
 * The question is rendered if the test has started.
 *
 * @param {{ data: Test[]; setAnswer: (answer: string) => void }} props
 * @returns {JSX.Element}
 */
export default function Exam({
  data,
  setAnswer,
  pickedParts,
}: {
  data: Test[];
  setAnswer: (answer: string) => void;
  pickedParts: number[];
}): JSX.Element {
  const [part, setPart] = useState<1 | 2 | 3>(pickedParts?.[0] || 1);
  const [isStartTest, setStartTest] = useState<boolean>(false);
  const audioRefs = useRef<
    Array<{ part: number; topics: Array<{ audios: string[] }> }>
  >(
    data.map((_, index: number) => ({
      part: index + 1,
      topics: data[index].Topics.map(() => ({ audios: [] })),
    })),
  );
  const topics = data[part - 1].Topics;

  const handleStartTest = () => {
    setStartTest(true);
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center min-h-[calc(100vh-160px)]",
      )}
    >
      <div
        className={cn(
          "gap-[40px] py-15 w-[1038px] relative bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] rounded-[26px]",
          isStartTest ? "min-h-[544px]" : "min-h-[478px]",
        )}
      >
        <div className="h-[76px] flex justify-center items-center text-center font-bold text-[24px] border-b border-b-[#E7EAE9]">
          PART {part}: {PART_INTRODUCTION[part]}
        </div>

        <div className="py-8 px-6">
          <AnimatePresence mode="wait">
            {isStartTest && (
              <motion.div
                key="question"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Question
                  topics={topics}
                  part={part}
                  setPart={setPart}
                  audioRefs={audioRefs}
                  setAnswer={setAnswer}
                  isEnd={part === data.length}
                  setStartTest={setStartTest}
                  isStartTest={isStartTest}
                  pickedParts={pickedParts}
                />
              </motion.div>
            )}
            {!isStartTest && (
              <motion.div
                key="preview"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center flex-col"
              >
                <div className="flex items-center justify-center flex-col">
                  {<PartInstruction part={part} />}
                  <Button
                    onClick={handleStartTest}
                    variant="light"
                    className="absolute bottom-[60px]"
                    size="lg"
                  >
                    Start Now
                    <PlayCircleIcon />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
