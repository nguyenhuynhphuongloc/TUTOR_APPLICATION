/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Volume from "@/components/icons/volume";
import useTextToSpeech from "@/hooks/use-speaking";
import { cn } from "@/lib/utils";
import { VocabProgress } from "@/payload-types";
import { useQueryClient } from "@tanstack/react-query";
import { Word } from "./Columns";

const CellWord = ({
  word,
  pronunciation,
  id,
  type,
}: {
  word: string;
  pronunciation: string | null | undefined;
  id: string | undefined | null;
  type: string | undefined | null;
}) => {
  const { speak, isSpeaking } = useTextToSpeech();
  const queryClient = useQueryClient();

  const cachedProgress = queryClient.getQueryData<VocabProgress[]>([
    "vocab_progress",
  ]);
  const progress =
    cachedProgress?.docs.length > 0
      ? cachedProgress?.docs[0].word.map((w: Word) => w.id)
      : [];

  const isCompleted = progress?.includes(id);

  const speakText = () => {
    speak(word);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div>
        <p
          className={cn(
            "text-xl font-bold text-left",
            isCompleted ? "text-[#22C55E]" : "",
          )}
        >
          {word} ({type})
        </p>
        <p>{pronunciation}</p>
      </div>
      <div
        onClick={speakText}
        className={cn(
          `rounded-[10px] h-10 w-10 border text-[#A8ABB2] border-[#E7EAE9] flex items-center justify-center cursor-pointer`,
          isSpeaking ? "bg-[#23BD3333]" : "",
        )}
      >
        {/* <Image
          src="/volumn-high.svg"
          alt="volume"
          width={20}
          height={20}
          color={isSpeaking ? "#23BD33" : "#E7EAE9"}
        /> */}
        <Volume width={20} height={20} fill="#A8ABB2" />
      </div>
    </div>
  );
};

export default CellWord;
