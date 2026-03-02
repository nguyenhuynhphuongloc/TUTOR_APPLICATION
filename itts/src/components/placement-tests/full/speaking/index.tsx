/* eslint-disable @typescript-eslint/no-unsafe-argument */
// keep
"use client";

import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useState } from "react";

import Exam from "@/containers/tests/speaking/exam";
import { MicrophoneTestUI } from "@/containers/tests/speaking/mic-test";
import { useStore } from "@/zustand/placement-test/provider";
import { useShallow } from "zustand/react/shallow";

/**
 * A component that manages the speaking test flow.
 *
 * @param {SpeakingProps} props - The component props.
 * @param {any} props.speaking - The speaking data for the exam. Replace 'any' with a more specific type if possible.
 * @returns {JSX.Element} - The rendered component.
 */
const Speaking = ({ speaking, pickedParts }: any) => {
  const [doneTest, setDoneTest] = useState<boolean>(false);
  const {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    toggleRecording,
    resetRecording,
  } = useAudioRecorder();
  const setAnswer = useStore(useShallow((state) => state.setAnswer));
  const setAnswerSpeaking = ({
    skill,
    part,
    questionNumber,
    topic,
    ...payload
  }: any) => setAnswer(skill, questionNumber, payload, part, topic);

  const toggleSetDoneTest = () => {
    setDoneTest((prev) => !prev);
  };

  return doneTest ? (
    <Exam
      data={speaking}
      setAnswer={setAnswerSpeaking as any}
      pickedParts={pickedParts}
    />
  ) : (
    <MicrophoneTestUI
      isRecording={isRecording}
      audioURL={audioURL}
      onToggleRecording={toggleRecording}
      onResetRecording={resetRecording}
      toggleSetDoneTest={toggleSetDoneTest}
    />
  );
};

export default Speaking;
