import { useAuth } from "@/app/(app)/_providers/Auth";
import LottieAnimation from "@/components/lottie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHint } from "@/hooks/useHint";
import { useMotivationMessage } from "@/hooks/useMotivationMessage";
import { playSound } from "@/lib/utils";
import confetti3 from "@/lottie/confetti3.json";
import { shuffleArray } from "@/payload/utilities/shuffleArray";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCcwIcon, SkipForwardIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type JSX } from "react";
import type { Stage1Props } from "./stage-1";

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

const defaultOptions = {
  loop: false,
  autoplay: false,
  animationData: confetti3,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Stage9({ data, setStage }: Stage1Props): JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const [shuffledData, setShuffledData] = useState<typeof data>([]);
  const [isCorrect, setIsCorrect] = useState<undefined | boolean>(undefined);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { motivationMessage, registerWrongAnswer, resetForNewWord } =
    useMotivationMessage(2, 2000);
  const { hint, registerWrongAttemptForHint, resetHint } = useHint(2);
  const [replay, setReplay] = useState(false);
  const [locked, setLocked] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setShuffledData(shuffleArray(data));
  }, [data]);

  useEffect(() => {
    setInputValue("");
    setIsCorrect(undefined);
    inputRef.current?.focus();

    resetForNewWord(); // reset khi sang word mới
    resetHint(); // reset khi sang từ mới
  }, [index]);

  const current = shuffledData[index];

  if (!current) return <div>Loading...</div>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleContinue = () => {
    if (index < data.length - 1) setIndex((prev) => prev + 1);
  };

  const handleCheck = async () => {
    if (locked) return;
    if (current.word.toLowerCase() === inputValue.trim().toLowerCase()) {
      setIsCorrect(true);
      playSound("vocab-correct");
      setLocked(true);

      setTimeout(() => {
        handleContinue();
        setLocked(false);
      }, 1000);
    } else {
      registerWrongAnswer();
      registerWrongAttemptForHint("fill", current?.word, inputValue);
      setIsCorrect(false);
      playSound("vocab-error");
    }
    if (index === shuffledData.length - 1) {
      setReplay(true);
      setTimeout(() => {
        setReplay(false);
      }, 5000);
      const wordIds = data.map((item) => item.id);
      try {
        await fetch("/api/vocab-progress/upsert", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id, // hoặc lấy từ session
            wordIds, // là mảng ID của các từ đã học
          }),
        });
        await queryClient.invalidateQueries({ queryKey: ["vocab_progress"] });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleReset = () => {
    setStage(1);
  };

  const handleLearnNew = () => {
    router.push("/student/vocabulary/topics");
  };

  return (
    <div>
      {replay && (
        <LottieAnimation
          options={defaultOptions}
          className="absolute bottom-5 z-[2]"
          name="confetti3"
          isActive={replay}
        />
      )}

      <p className="mt-6 text-2xl font-bold">Stage 9 - Sentence use</p>
      <div
        className="mt-6 mb-6 flex w-full flex-col items-center rounded-[26px] bg-white py-[60px] p-2"
        style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="text-[#6D737A] font-normal text-[18px] text-center">
          {current["sentence-use"]}
        </div>
        <div className="mt-3 text-[#E72929] font-normal text-[18px]">
          Write the missing word
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
            ref={inputRef}
            className="w-full h-full rounded-[12px]"
            placeholder="Enter the word"
            onChange={handleChange}
            type="text"
            value={inputValue}
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
          className={`mt-[40px] transition-opacity duration-500 rounded-[12px]`}
          size="xl"
          onClick={handleCheck}
          disabled={locked}
        >
          Check now
        </Button>
      </div>

      {index === shuffledData.length - 1 && isCorrect && (
        <div className="flex justify-center mt-6 gap-6">
          <Button
            size="xl"
            onClick={handleReset}
            variant="light"
            className="gap-2"
          >
            Reset This Topic <RotateCcwIcon size={18} />
          </Button>
          <Button
            size="xl"
            onClick={handleLearnNew}
            variant="light"
            className="gap-2"
          >
            Learn new vocabulary <SkipForwardIcon size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
