"use client";
import Volume from "@/components/icons/volume";
import { Button } from "@/components/ui/button";
import useTextToSpeech from "@/hooks/use-speaking";
import { useState, type JSX } from "react";

/**
 * Renders the first stage of the vocabulary game, which is to learn the
 * meanings of the given words.
 *
 * @param {Stage1Props} props The props to render the component.
 * @param {Word[]} props.data.words The words to learn.
 * @returns {JSX.Element} The rendered JSX element.
 */
export default function Stage1({ data, setStage }: Stage1Props): JSX.Element {
  const [index, setIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const { speak, isSpeaking } = useTextToSpeech();
  const speakText = () => {
    speak(data[index]?.word);
  };

  const handleContinue = () => {
    if (index === data.length - 1) setStage((stage: number) => stage + 1);
    setIndex(index + 1);
    setShowWord(false);
  };

  return (
    <div>
      <p className="mt-6 text-2xl font-bold">Stage 1 - Learn the meaning</p>

      <div className="my-6 flex h-[450px] w-full flex-col items-center rounded-[26px] bg-white py-[60px] shadow-[0px_0px_60px_0px_rgba(0,0,0,0.1)]">
        <p className="text-4xl font-extrabold text-[#151515]">
          {data[index]?.word}
        </p>
        <div
          onClick={speakText}
          className={`mt-[40px] flex w-[100px] h-[100px] rounded-full bg-[#F8F8F8] flex items-center justify-center cursor-pointer
            hover:bg-[#FFE5E5] hover:text-[#E72929] transition items-center justify-center rounded-full px-0 ${
              isSpeaking ? "bg-[#FFE5E5] text-[#E72929]" : ""
            }`}
        >
          <Volume />
        </div>

        <div className="mt-[40px] text-[18px]">
          {showWord ? (
            <p className="text-[#6D737A] ">
              {data[index]?.["meaning-en"]} ({data[index]?.type})
            </p>
          ) : (
            <div
              className="text-[#6D737A] italic underline cursor-pointer"
              onClick={() => setShowWord(true)}
            >
              Uncover the meaning of the word
            </div>
          )}
        </div>

        <Button
          className={`mt-[20px] transition-opacity duration-500 ${showWord ? "visible opacity-100" : "invisible opacity-0"}`}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export type Stage1Props = {
  data: Word[];
  setStage: (stage: number) => void;
};

export type Word = {
  id?: string;
  level?: string;
  "meaning-en"?: string;
  "meaning-vn"?: string;
  type?: "adjective" | "noun" | "verb" | "adverb";
  word: string;
  pronunciation?: string;
  example?: string;
};
