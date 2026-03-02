/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import AudioRecorder from "@/components/audio-recorder/AudioRecorder";
import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { useNote } from "@/components/note/NoteContext";
import { NotePopover } from "@/components/note/NotePopover";
import type { Answer } from "@/components/placement-tests/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import useTextToSpeech from "@/hooks/use-speaking";
import { playSound } from "@/lib/utils";
import { SkipForwardIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { JSX } from "react";
import { useEffect, useState, useTransition } from "react";
import ReviewPart from "./reviewPart";

const TIME_EACH_PART = [
  {
    thinkTime: 10,
    speakTime: 40,
  },
  {
    thinkTime: 60,
    speakTime: 120,
  },
  {
    thinkTime: 15,
    speakTime: 45,
  },
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
};

interface QuestionProps {
  topics: {
    questions: [];
    answer: string;
  }[];
  part: number;
  setPart: (part: number) => void;
  audioRefs: React.MutableRefObject<
    Array<{ part: number; topics: Array<{ audios: string[] }> }>
  >;
  isEnd: boolean;
  setAnswer: ({ part, questionNumber, ...payload }: Answer & string) => void;
  setStartTest: (isStartTest: boolean) => void;
  isStartTest: boolean;
  pickedParts: number[];
}

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Question({
  topics = [],
  part,
  setPart,
  audioRefs,
  setAnswer,
  isEnd,
  setStartTest,
  isStartTest,
  pickedParts = [],
}: QuestionProps): JSX.Element {
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const [topic, setTopic] = useState<number>(1);

  const {
    isRecording,
    audioURL,
    resetRecording,
    startRecording,
    stopRecording,
    blobFile,
  } = useAudioRecorder();
  const time = TIME_EACH_PART[part - 1] ?? { thinkTime: 0, speakTime: 0 };
  const [timeToThink, setTimeToThink] = useState(time?.thinkTime ?? 0);
  const [timeToSpeak, setTimeToSpeak] = useState(time?.speakTime ?? 0);
  const { speak } = useTextToSpeech();
  const { resetNote, closeModal } = useNote();
  const [isRecordAgain, setIsRecordAgain] = useState(false);
  const [_, startTransition] = useTransition();

  const currentTopic = topics?.[topic - 1];

  const currentQuestion = currentTopic?.questions?.[questionNumber - 1];

  useEffect(() => {
    if (isStartTest) {
      setTimeToThink(time?.thinkTime);
    }
  }, [time?.thinkTime, isStartTest]);

  useEffect(() => {
    if (!isStartTest || timeToThink <= 0) return;

    const timer = setInterval(() => {
      setTimeToThink((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeToThink, isStartTest]);

  useEffect(() => {
    if (timeToSpeak === 0) {
      handleNext();
      return;
    }
    if (isRecording) {
      const timer = setInterval(() => {
        setTimeToSpeak((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeToSpeak, isRecording]);

  useEffect(() => {
    if (isStartTest) {
      speak(currentQuestion?.question);
    }
  }, [questionNumber, isStartTest]);

  useEffect(() => {
    if (timeToThink === 0 && !reviewMode) {
      speak(currentQuestion?.question, () => {
        playSound("beep-sound", () => {
          startRecording();
        });
      });
    }
  }, [timeToThink, reviewMode]);

  useEffect(() => {
    if (audioURL) {
      const answer = {
        skill: "speaking",
        part,
        id: currentQuestion?.id,
        questionNumber,
        answer: blobFile,
        topic,
      };

      const currentPartRef = audioRefs.current[part - 1];
      if (currentPartRef) {
        if (!currentPartRef.topics[topic - 1]) {
          currentPartRef.topics[topic - 1] = { audios: [] };
        }
        currentPartRef.topics[topic - 1]?.audios.push(audioURL);
      }

      setAnswer(answer);
    }
  }, [audioURL, part]);

  const handleNext = (): void => {
    stopRecording();
    setTimeToSpeak(time?.speakTime);
    setTimeToThink(time?.thinkTime);
    if (questionNumber >= (currentTopic?.questions?.length ?? 0)) {
      if (topic >= (topics?.length ?? 0)) {
        if (part === 2) {
          resetNote?.();
          closeModal?.();
        }
        setReviewMode(true);
        return;
      }
      setTimeout(() => {
        setTopic((prev) => prev + 1);
        setQuestionNumber(1);
      }, 200);
      resetRecording();
      return;
    }
    setTimeout(() => {
      setQuestionNumber((prev) => prev + 1);
    }, 200);
    resetRecording();
  };

  const handleNextPart = () => {
    resetRecording();

    setReviewMode(false);
    setPart((prev: number) => {
      let next = prev + 1;

      // Bỏ qua các part không nằm trong selectedParts
      // Nếu pickedParts trống (trường hợp placement-tests không có), mặc định đi tiếp
      if (pickedParts && pickedParts.length > 0) {
        while (!pickedParts.includes(next) && next <= 3) {
          next++;
        }
      }

      return next;
    });
    // setActiveTopic(1);
    setQuestionNumber(1);
    startTransition(() => {
      setStartTest(false);
    });
  };

  const handleSkipThink = () => {
    setTimeToThink(0);
  };

  const handleCancelRecord = () => {
    stopRecording();
    resetRecording();
    setIsRecordAgain(true);
  };

  const handleRecordAgain = () => {
    startRecording();
    setIsRecordAgain(false);
  };

  return (
    <AnimatePresence mode="wait">
      {reviewMode ? (
        <ReviewPart
          audioRefs={audioRefs}
          part={part}
          isEnd={isEnd}
          topics={topics}
          handleNextPart={handleNextPart}
        />
      ) : (
        <motion.div
          key="record-mode"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-10"
        >
          <div className="relative w-full text-center">
            {topics?.length > 1 && (
              <p className="text-[#6D737A] text-[22px] font-extrabold">
                Topic
                {topics.length > 1 && ` ${topic}:  ${currentTopic?.topic}`}
              </p>
            )}
            {part === 2 && (
              <div className="absolute top-0 left-4">
                <NotePopover />
              </div>
            )}
            <div className="absolute top-0 right-4">
              {timeToThink > 0 && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="secondary"
                          onClick={handleSkipThink}
                          disabled={timeToThink >= time?.thinkTime - 4}
                        >
                          Time to think{" "}
                          <span className="text-[#E72929] font-semibold">
                            {formatTime(timeToThink)}
                          </span>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Click to Skip</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isRecording && (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[10px] w-[10px] bg-[#E72929] rounded-full"></div>
                  <span className="text-[#A8ABB2] text-[18px]">
                    recording...
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[#6D737A] text-[18px] font-semibold">
              {(currentTopic?.questions?.length ?? 0) > 1 &&
                `QUESTION ${questionNumber}`}
            </p>
            <p className="text-[#E72929] font-semibold text-[24px]">
              {currentQuestion?.question}
            </p>
            {part === 2 && (
              <div>
                <p className="text-[#6D737A] text-[16px] mb-2 mt-3 text-left">
                  You should say:
                </p>
                <Editor
                  value={currentTopic?.you_should_say}
                  theme={previewEditorTheme}
                  mode="read_only"
                />
              </div>
            )}
          </div>
          <AudioRecorder isRecording={isRecording} />

          {isRecording && (
            <p className="text-[#E72929] font-bold text-[24px]">
              {formatTime(timeToSpeak)}
            </p>
          )}

          {!isRecording && (
            <p className="text-[#6D737A] text-[16px]">
              You have{" "}
              <b>
                {time.speakTime > 59
                  ? `${time?.speakTime / 60} minutes`
                  : `${time?.speakTime} seconds`}
              </b>{" "}
              to speak and complete this part {part}.
            </p>
          )}

          {isRecording && (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleCancelRecord}
              >
                Cancel
              </Button>
              <Button onClick={handleNext} variant="light" size="lg">
                Next Question <SkipForwardIcon />
              </Button>
            </div>
          )}
          {isRecordAgain && (
            <Button variant="light" size="lg" onClick={handleRecordAgain}>
              Record again
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
