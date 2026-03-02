/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button } from "@/components/ui/button";
import { useHint } from "@/hooks/useHint";
import { useMotivationMessage } from "@/hooks/useMotivationMessage";
import { playSound } from "@/lib/utils";
import { shuffleArray } from "@/payload/utilities/shuffleArray";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Fragment, JSX, useEffect, useState } from "react";
import type { Stage1Props, Word } from "./stage-1";

/**
 * Stage 3 of the vocabulary game.
 *
 * @param {Stage3Props} props The props to render the component.
 * @param {Word[]} props.data.words The words to learn.
 * @param {(stage: number) => void} props.setStage The function to call when the stage is completed.
 * @returns {JSX.Element} The rendered JSX element.
 */
export default function Stage4({ data, setStage }: Stage1Props): JSX.Element {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(15);
  const [options, setOptions] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { motivationMessage, registerWrongAnswer, resetForNewWord } =
    useMotivationMessage(2, 2000);
  const { hint, registerWrongAttemptForHint, resetHint } = useHint(2);

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    resetForNewWord();
    resetHint();
  }, [currentIndex]);

  useEffect(() => {
    setShuffledWords(shuffleArray(data));
  }, [data]);

  useEffect(() => {
    if (!currentWord) return;

    const incorrectAnswers = shuffleArray(
      shuffledWords.filter((w) => w.word !== currentWord.word),
    ).slice(0, shuffledWords.length - 1);

    setOptions(
      shuffleArray([currentWord.word, ...incorrectAnswers.map((w) => w.word)]),
    );
  }, [currentIndex, shuffledWords, currentWord]);

  useEffect(() => {
    if (isFinished || !currentWord) return;

    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setSelectedAnswer(currentWord.word);
      playSound("vocab-error");
      setIsDisabled(true);

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsDisabled(false);

        setTimer(15);
        if (currentIndex + 1 === shuffledWords.length) {
          setIsFinished(true);
        } else {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      }, 1000);
    }
  }, [timer, currentWord, currentIndex, shuffledWords.length, isFinished]);

  const handleAnswerClick = (answer: string) => {
    if (isCorrect || isDisabled) return;

    setSelectedAnswer(answer);
    if (answer === currentWord?.word) {
      setIsCorrect(true);
      playSound("vocab-correct");

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimer(15);
        if (currentIndex + 1 === shuffledWords.length) {
          setIsFinished(true);
        } else {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      }, 1000);
    } else {
      registerWrongAnswer();
      registerWrongAttemptForHint("select", currentWord?.word);

      setIsDisabled(true);
      playSound("vocab-error");

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsDisabled(false);
      }, 2000);
    }
  };

  const handleContinue: () => void = () => {
    setStage((stage: number): number => stage + 1);
  };

  return (
    <div>
      <p className="mt-6 text-2xl font-bold">Stage 4 - Speed read 2</p>
      <div
        className="flex  flex-col items-center justify-center rounded-[26px] bg-white p-4 shadow-md"
        style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.1)" }}
      >
        {!isFinished && (
          <Fragment>
            <h1 className="mb-4 text-[32px] font-extrabold">
              {currentWord?.["meaning-en"]}
            </h1>
            <div className="relative mb-4">
              <svg className="h-20 w-20" viewBox="0 0 100 100">
                <circle
                  className="stroke-current text-gray-200"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                />
                <circle
                  className="stroke-current text-red-500"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * timer) / 15}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="51"
                  y="58"
                  textAnchor="middle"
                  className="text-2xl font-bold text-red-500"
                >
                  {timer}s
                </text>
              </svg>
            </div>
            <p className="mb-4 text-gray-500">Tap the correct meaning</p>
            <div className="grid grid-cols-2 gap-6">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(option)}
                  disabled={isDisabled}
                  className={`h-[60px] w-[330px] rounded-lg px-6 py-3 text-lg font-medium transition-all ${
                    selectedAnswer === option
                      ? option === currentWord?.word
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  } `}
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
        <Button
          className={`mt-[20px] transition-opacity duration-500 ${isFinished ? "visible opacity-100" : "invisible opacity-0"}`}
          onClick={handleContinue}
          size={"lg"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
