/* eslint-disable @typescript-eslint/no-unsafe-return */
import AudioPlayer from "@/components/audio-player";
import AudioRecorder from "@/components/audio-recorder/AudioRecorder";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { cn } from "@/lib/utils";
import { RotateCcwIcon, SkipForwardIcon } from "lucide-react";
import { Fragment, JSX, useEffect, useState } from "react";

// const TIME_EACH_PART = [
//   {
//     thinkTime: 10,
//     speakTime: 40,
//   },
//   {
//     thinkTime: 60,
//     speakTime: 120,
//   },
//   {
//     thinkTime: 15,
//     speakTime: 45,
//   },
// ];

const TIME_EACH_PART = [
  {
    thinkTime: 1,
    speakTime: 40,
  },
  {
    thinkTime: 1,
    speakTime: 120,
  },
  {
    thinkTime: 1,
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
  questions: {
    question: string;
    answer: string;
  }[];
  part: number;
  setPart: (part: number) => void;
  audioRefs: React.MutableRefObject<string[]>;
}

/**
 * Renders a single question for the speaking test with a record button.
 *
 * @param {QuestionProps} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
export default function Question({
  questions,
  part,
  setPart,
  audioRefs,
}: QuestionProps): JSX.Element {
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const {
    isRecording,
    audioURL,
    resetRecording,
    startRecording,
    stopRecording,
  } = useAudioRecorder();
  const time = TIME_EACH_PART[part - 1];
  const [timeToThink, setTimeToThink] = useState(time?.thinkTime);
  const [timeToSpeak, setTimeToSpeak] = useState(time?.speakTime);
  const [activeQuestion, setActiveQuestion] = useState(1);

  useEffect(() => {
    setTimeToThink(time?.thinkTime);
  }, [time?.thinkTime]);

  useEffect(() => {
    if (timeToThink <= 0) {
      startRecording();
      return;
    }

    const timer = setInterval(() => {
      setTimeToThink((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeToThink]);

  useEffect(() => {
    if (timeToSpeak <= 0) {
      handleNext();
      return;
    }

    if (timeToThink <= 0) {
      const timer = setInterval(() => {
        setTimeToSpeak((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeToSpeak, timeToThink]);

  useEffect(() => {
    if (audioURL) {
      audioRefs.current[part - 1].audios.push(audioURL);
    }
  }, [audioURL, part]);

  const handleNext = (): void => {
    stopRecording();

    setTimeToSpeak(time?.speakTime);
    setTimeToThink(time?.thinkTime);
    if (questionNumber === questions.length) {
      setReviewMode(true);
      return;
    }
    setQuestionNumber(questionNumber + 1);
    resetRecording();
  };

  const handleChooseQuestion = (number: number) => {
    setActiveQuestion(number);
  };

  const handleNextPart = () => {
    setPart((part: number) => part + 1);
    setQuestionNumber(1);
  };

  return reviewMode ? (
    <Fragment>
      <div className="text-center ">
        <p className="text-[32px] font-extrabold text-[#6D737A]">
          IT’S THE END OF PART {part}
        </p>
        <p className="text-[#E72929] text-[16px]">
          You can review your part {part} recording by clicking the Play button
          below.
        </p>
      </div>

      <div className="flex items-center justify-center gap-[10px]">
        {new Array(questionNumber).fill(0).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-8 h-8 rounded-[8px] text-center flex items-center justify-center cursor-pointer",
              activeQuestion === index + 1
                ? "bg-[#E72929]"
                : "bg-white  border border-[#F1F1F1]",
            )}
            onClick={() => handleChooseQuestion(index + 1)}
          >
            <p
              className={cn(
                "text-[13px]  font-semibold",
                activeQuestion === index + 1 ? "text-white" : "text-[#151515]",
              )}
            >
              {index + 1}
            </p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[#E72929] font-semibold text-[24px]">
          {questions[activeQuestion - 1].question}
        </p>
      </div>
      <div className="w-full">
        <AudioPlayer
          audioURL={audioRefs.current[part - 1].audios[activeQuestion - 1]}
        />
      </div>

      <div className="flex items-center justify-center gap-[24px]">
        <Button disabled>
          Reset This Part <RotateCcwIcon />
        </Button>

        <Button onClick={handleNextPart}>
          Next Part <SkipForwardIcon />
        </Button>
      </div>
    </Fragment>
  ) : (
    <Fragment>
      {
        <Button variant="secondary" className="self-end mt-[-40px]">
          Time to think{" "}
          <span className="text-[#E72929] font-semibold">
            {formatTime(timeToThink)}
          </span>
        </Button>
      }
      <div className="text-center">
        <p className="text-[#6D737A] text-[18px] font-semibold">
          QUESTION {questionNumber}
        </p>
        <p className="text-[#E72929] font-semibold text-[24px]">
          {questions[questionNumber - 1].question}
        </p>
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
          to speak and complete this part 1.
        </p>
      )}

      {isRecording && (
        <Button onClick={handleNext}>
          Next Question <SkipForwardIcon />
        </Button>
      )}
    </Fragment>
  );
}
