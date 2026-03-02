import Volume from "@/components/icons/volume";
import { Button } from "@/components/ui/button";
import useTextToSpeech from "@/hooks/use-speaking";
import { useHint } from "@/hooks/useHint";
import { useMotivationMessage } from "@/hooks/useMotivationMessage";
import { playSound } from "@/lib/utils";
import { shuffleArray } from "@/payload/utilities/shuffleArray";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Fragment, useEffect, useState, type JSX } from "react";
import type { Stage1Props, Word } from "./stage-1";

export default function Stage6({ data, setStage }: Stage1Props): JSX.Element {
  const [shuffledData, setShuffledData] = useState<Word[]>([]);
  const [index, setIndex] = useState<number>(0);
  const { speak, isSpeaking } = useTextToSpeech();
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { motivationMessage, registerWrongAnswer, resetForNewWord } =
    useMotivationMessage(2, 2000);
  const { hint, registerWrongAttemptForHint, resetHint } = useHint(2);

  useEffect(() => {
    resetForNewWord();
    resetHint();
  }, [index]);

  // shuffle data once
  useEffect(() => {
    setShuffledData(shuffleArray(data));
  }, [data]);

  const currentWord = shuffledData[index]?.word ?? "";

  useEffect(() => {
    if (!currentWord) return;

    const incorrectAnswers = shuffleArray(
      shuffledData.filter((w) => w.word !== currentWord),
    ).slice(0, data.length - 1);
    setOptions(
      shuffleArray([currentWord, ...incorrectAnswers.map((w) => w.word)]),
    );
  }, [index, shuffledData]);

  useEffect(() => {
    if (currentWord) speak(currentWord);
  }, [index, currentWord]);

  const handleAnswerClick = (answer: string) => {
    if (isCorrect || isDisabled) return;

    setSelectedAnswer(answer);
    if (answer === currentWord) {
      setIsCorrect(true);
      playSound("vocab-correct");

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (index + 1 === shuffledData.length) {
          setIsFinished(true);
        } else {
          setIndex((prevIndex) => prevIndex + 1);
        }
      }, 1000);
    } else {
      registerWrongAnswer();
      registerWrongAttemptForHint("select", currentWord);
      setIsDisabled(true);
      playSound("vocab-error");

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsDisabled(false);
      }, 2000);
    }
  };

  const handleContinue = () => {
    setStage((stage: number) => stage + 1);
  };

  return (
    <div>
      <p className="mt-6 text-2xl font-bold">Stage 6 - Listen and match 1</p>
      <div
        className="my-6 flex w-full flex-col items-center rounded-[26px] bg-white py-[60px] shadow-[0px_0px_60px_0px_rgba(0,0,0,0.1)]"
        style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.1)" }}
      >
        {!isFinished && (
          <Fragment>
            <div
              className={`w-[100px] h-[100px] rounded-full bg-[#F8F8F8] flex items-center justify-center cursor-pointer
              hover:bg-[#FFE5E5] hover:text-[#E72929] transition ${
                isSpeaking ? "bg-[#FFE5E5] text-[#E72929]" : ""
              }`}
              onClick={() => speak(currentWord)}
            >
              <Volume />
            </div>

            <p className="text-[18px] font-normal text-[#6D737A] my-10">
              Listen and tap the correct word
            </p>
            <div className="grid grid-cols-2 gap-6">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(option)}
                  disabled={isDisabled}
                  className={`h-[60px] w-[330px] rounded-lg px-6 py-3 text-lg font-medium transition-all ${
                    selectedAnswer === option
                      ? option === currentWord
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-white hover:bg-gray-100 text-[#6D737A]"
                  }`}
                  style={{ boxShadow: "0px 0px 60px 0px #0000001A" }}
                >
                  {option}
                </button>
              ))}
            </div>
          </Fragment>
        )}
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
        <AnimatePresence>
          {isFinished && (
            <motion.div
              key="continue-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                className="mt-[20px]"
                onClick={handleContinue}
                size={"lg"}
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
