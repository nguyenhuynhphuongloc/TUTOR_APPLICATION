/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHint } from "@/hooks/useHint";
import { useMotivationMessage } from "@/hooks/useMotivationMessage";
import { playSound } from "@/lib/utils";
import { shuffleArray } from "@/payload/utilities/shuffleArray";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Stage1Props, Word } from "./stage-1";

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const glowVariants = {
  normal: {
    backgroundColor: "#ffffff",
    border: "1px solid #E5E7EB",
    boxShadow: "none",
  },
  error: {
    backgroundColor: "#E729291A",
    border: "1px solid #E7292933",
    boxShadow: "0 0 8px 4px rgba(231, 41, 41, 0.1)",
    color: "#E72929",
  },
  success: {
    backgroundColor: "#23BD331A",
    border: "1px solid #23BD3333",
    boxShadow: "0 0 8px 4px rgba(35, 189, 51, 0.1)",
    color: "#23BD33",
  },
};

export default function Stage5({ data, setStage }: Stage1Props) {
  const [index, setIndex] = useState(0);
  const [writePhase, setWritePhase] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [indicateText, setIndicateText] = useState("Now write the word");
  const [shuffledData, setShuffledData] = useState<Word[]>([]);
  const { motivationMessage, registerWrongAnswer, resetForNewWord } =
    useMotivationMessage(2, 2000);
  const { hint, registerWrongAttemptForHint, resetHint } = useHint(2);
  const currentWord = shuffledData[index];
  const [wrongCount, setWrongCount] = useState(0);
  const [locked, setLocked] = useState(false);

  // Shuffle words once on mount
  useEffect(() => {
    setShuffledData(shuffleArray(data));
  }, [data]);

  useEffect(() => {
    resetForNewWord(); // reset khi sang word mới
    resetHint(); // reset khi sang từ mới
  }, [index]);

  useEffect(() => {
    setIndicateText("Now write the word");
    setIsCorrect(undefined);
    setInputValue("");
    setWritePhase(false);
  }, [index]);

  const handleContinue = () => {
    if (index < shuffledData.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setStage((stage: number) => stage + 1);
    }
  };

  const handleCheck = () => {
    if (locked) return;

    const correctWord = shuffledData[index]?.word.toLowerCase().trim();
    const enteredWord = inputValue.toLowerCase().trim();

    if (enteredWord === correctWord) {
      setIsCorrect(true);
      setIndicateText("Congratulations! You entered the correct word.");
      playSound("vocab-correct");

      setLocked(true);

      setTimeout(() => {
        handleContinue();
        setLocked(false);
      }, 1000);
    } else {
      setWrongCount((prev) => prev + 1);
      registerWrongAnswer();
      registerWrongAttemptForHint("fill", currentWord?.word, inputValue);
      setIsCorrect(false);
      setIndicateText("Your answer is incorrect. Try again.");
      playSound("vocab-error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <p className="mt-6 text-2xl font-bold">Stage 5 - Spelling Check</p>
      <div
        className="mt-6 flex w-full flex-col items-center rounded-[26px] bg-white py-[60px]"
        style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.1)" }}
      >
        <AnimatePresence mode="wait">
          {writePhase ? (
            <motion.div
              key="write"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariant}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="text-[18px] font-normal text-[#6D737A]">
                {indicateText}
              </div>

              <motion.div
                animate={
                  isCorrect === undefined
                    ? "normal"
                    : isCorrect
                      ? "success"
                      : "error"
                }
                variants={glowVariants}
                transition={{ duration: 0.2 }}
                className="mt-10 h-[51px] w-[500px] rounded-[12px]"
              >
                <Input
                  autoFocus
                  className="h-full w-full rounded-[12px]"
                  placeholder="Enter the word"
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  size="lg"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCheck();
                  }}
                />
              </motion.div>

              {hint && (
                <p className="mt-4 text-gray-500 flex gap-1">
                  <Image
                    src="/icons/light-bulb.svg"
                    width={24}
                    height={24}
                    alt="light-bulb"
                  />
                  Hint: {hint}
                </p>
              )}
              <AnimatePresence>
                {motivationMessage && (
                  <motion.p
                    className="mt-4 text-center text-lg font-medium text-grey-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {motivationMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                className="mt-[40px]"
                size="lg"
                onClick={handleCheck}
                disabled={locked}
              >
                Check now
              </Button>

              {wrongCount >= 5 && (
                <Button
                  className="mt-[40px]"
                  size="lg"
                  variant="light"
                  onClick={() => setWritePhase(false)}
                >
                  Learn Again
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="read"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariant}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <p className="text-4xl font-extrabold text-[#151515] select-none">
                {currentWord?.word}
              </p>

              <div className="mt-[40px] text-[18px] font-normal text-[#6D737A]">
                Read the word
              </div>

              <Button
                className="mt-[40px]"
                size="lg"
                onClick={() => setWritePhase(true)}
                autoFocus
              >
                Write the word
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
