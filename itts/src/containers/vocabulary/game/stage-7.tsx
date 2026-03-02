import Volume from "@/components/icons/volume";
import { Button } from "@/components/ui/button";
import useTextToSpeech from "@/hooks/use-speaking";
import { playSound } from "@/lib/utils";
import { shuffleArray } from "@/payload/utilities/shuffleArray";
import { Fragment, useEffect, useState, type JSX } from "react";
import type { Stage1Props, Word } from "./stage-1";

export default function Stage7({ data, setStage }: Stage1Props): JSX.Element {
  const [shuffledData, setShuffledData] = useState<Word[]>([]);
  const [index, setIndex] = useState<number>(0);
  const { speak, isSpeaking } = useTextToSpeech();
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setShuffledData(shuffleArray(data));
  }, [data]);

  const currentItem = shuffledData[index];
  const meaningEn = currentItem?.["meaning-en"];
  const word = currentItem?.word;

  useEffect(() => {
    if (!meaningEn) return;
    const incorrectAnswers = shuffleArray(
      shuffledData.filter((w) => w["meaning-en"] !== meaningEn),
    ).slice(0, data.length - 1);

    setOptions(
      shuffleArray([
        meaningEn,
        ...incorrectAnswers
          .map((w) => w["meaning-en"])
          .filter((m): m is string => !!m),
      ]),
    );
  }, [index, shuffledData]);

  useEffect(() => {
    if (word) speak(word);
  }, [index, word]);

  const speakText = () => {
    if (word) speak(word);
  };

  const handleAnswerClick = (answer: string) => {
    if (isCorrect || isDisabled) return;

    setSelectedAnswer(answer);
    if (answer === meaningEn) {
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
      setIsDisabled(true);
      playSound("vocab-error");

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsDisabled(false);
      }, 2000);
    }
  };

  const handleContinue: () => void = () => {
    (setStage as any)((stage: number): number => stage + 1);
  };

  return (
    <div>
      <p className="mt-6 text-2xl font-bold">Stage 7 - Listen and match 2</p>
      <div
        className="mt-6 mb-6 flex w-full flex-col items-center rounded-[26px] bg-white py-[60px] gap-10"
        style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.1)" }}
      >
        {!isFinished && (
          <Fragment>
            <div
              className={`w-[100px] h-[100px] rounded-full bg-[#F8F8F8] flex items-center justify-center cursor-pointer
              hover:bg-[#FFE5E5] hover:text-[#E72929] transition ${
                isSpeaking ? "bg-[#FFE5E5] text-[#E72929]" : ""
              }`}
              onClick={speakText}
            >
              <Volume />
            </div>

            <p className="text-[18px] font-normal text-[#6D737A]">
              Listen and tap the correct word
            </p>
            <div className="grid grid-cols-2 gap-6 auto-rows-fr">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(option)}
                  disabled={isSpeaking || isDisabled}
                  className={`text-[#6D737A] h-full min-h-[60px] w-[420px] rounded-lg text-lg font-medium transition-all flex items-center justify-center p-4 text-center ${
                    selectedAnswer === option
                      ? option === meaningEn
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  style={{ boxShadow: "0px 0px 60px 0px #0000001A" }}
                >
                  {option}
                </button>
              ))}
            </div>
          </Fragment>
        )}
        <Button
          className={`mt-[20px] transition-opacity duration-500 ${
            isFinished ? "visible opacity-100" : "invisible opacity-0"
          }`}
          onClick={handleContinue}
          size={"lg"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
