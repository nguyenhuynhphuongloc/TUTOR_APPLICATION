import Volume from "@/components/icons/volume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTextToSpeech from "@/hooks/use-speaking";
import { useHint } from "@/hooks/useHint";
import { useMotivationMessage } from "@/hooks/useMotivationMessage";
import { playSound } from "@/lib/utils";
import { shuffleArray } from "@/payload/utilities/shuffleArray";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type JSX } from "react";
import type { Stage1Props, Word } from "./stage-1";

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

export default function Stage8({ data, setStage }: Stage1Props): JSX.Element {
  const { speak, isSpeaking } = useTextToSpeech();
  const [shuffledData, setShuffledData] = useState<Word[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<undefined | boolean>(undefined);
  const [inputValue, setInputValue] = useState<string>("");
  const { motivationMessage, registerWrongAnswer, resetForNewWord } =
    useMotivationMessage(2, 2000);
  const { hint, registerWrongAttemptForHint, resetHint } = useHint(2);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setShuffledData(shuffleArray(data));
  }, [data]);

  useEffect(() => {
    resetForNewWord(); // reset khi sang word mới
    resetHint(); // reset khi sang từ mới
  }, [index]);

  const currentWord = shuffledData[index]?.word;

  const speakText = () => {
    if (currentWord) speak(currentWord);
  };

  useEffect(() => {
    if (currentWord) speakText();
    setInputValue("");
    setIsCorrect(undefined);
  }, [index, currentWord]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleContinue = () => {
    if (index === shuffledData.length - 1) {
      setStage((stage: number) => stage + 1);
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  const handleCheck = () => {
    if (locked) return;
    if (!currentWord) return;

    if (currentWord.toLowerCase() === inputValue.trim().toLowerCase()) {
      setIsCorrect(true);
      playSound("vocab-correct");
      setLocked(true);

      setTimeout(() => {
        handleContinue();
        setLocked(false);
      }, 1000);
    } else {
      registerWrongAnswer();
      registerWrongAttemptForHint("fill", currentWord, inputValue);
      setIsCorrect(false);
      playSound("vocab-error");
    }
  };

  return (
    <div>
      <p className="mt-6 text-2xl font-bold">Stage 8 - Listen and write</p>
      <div
        className="mt-6 mb-6 flex w-full flex-col items-center rounded-[26px] bg-white py-[60px]"
        style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="text-[#6D737A] font-normal text-[18px]">
          Listen to the word, and then write the word in the box below.
        </div>

        <div
          className={`mt-10 w-[100px] h-[100px] rounded-full bg-[#F8F8F8] flex items-center justify-center cursor-pointer
            hover:bg-[#FFE5E5] hover:text-[#E72929] transition ${
              isSpeaking ? "bg-[#FFE5E5] text-[#E72929]" : ""
            }`}
          onClick={speakText}
        >
          <Volume />
        </div>

        <motion.div
          animate={
            isCorrect === undefined ? "normal" : isCorrect ? "success" : "error"
          }
          variants={glowVariants}
          transition={{ duration: 0.2 }}
          className="mt-10 w-[500px] h-[51px] rounded-[12px]"
        >
          <Input
            className="w-full h-full rounded-[12px]"
            placeholder="Enter the word"
            onChange={handleChange}
            type="text"
            value={inputValue}
            size="lg"
            autoFocus
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
          className={`mt-[40px] transition-opacity duration-500`}
          size="xl"
          onClick={handleCheck}
          disabled={locked}
        >
          Check now
        </Button>
      </div>
    </div>
  );
}
