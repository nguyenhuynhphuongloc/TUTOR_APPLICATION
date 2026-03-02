/* eslint-disable react/no-unescaped-entities */
"use client";

import AudioPlayer from "@/components/audio-player";
import AudioRecorder from "@/components/audio-recorder/AudioRecorder";
import { Button } from "@/components/ui/button";
import { LogInIcon, RotateCcwIcon, SkipForwardIcon } from "lucide-react";
import { type JSX } from "react";

import PlayCircleIcon from "@/components/icons/play-circle";

/**
 * A component that tests the user's microphone.
 *
 * @param {object} props The component props.
 * @param {boolean} props.isRecording Whether the microphone is currently recording.
 * @param {string | null} props.audioURL The URL of the recorded audio.
 * @param {() => void} props.onToggleRecording The function to call when the user clicks the record button.
 * @param {() => void} props.onResetRecording The function to call when the user clicks the reset button.
 *
 * @returns {JSX.Element} The rendered component.
 */

export function MicrophoneTestUI({
  isRecording,
  audioURL,
  onToggleRecording,
  onResetRecording,
  toggleSetDoneTest,
}: {
  isRecording: boolean;
  audioURL: string | null;
  onToggleRecording: () => void;
  onResetRecording: () => void;
  toggleSetDoneTest: () => void;
}): JSX.Element {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-260px)]">
      <div className="gap-[40px] flex-col flex justify-center items-center py-15 w-[1038px] h-[478px] bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)] rounded-[26px]">
        <p className="text-[32px] font-extrabold text-[#6D737A]">
          TEST YOUR MICROPHONE
        </p>

        {audioURL ? (
          <AudioPlayer audioURL={audioURL} />
        ) : (
          <AudioRecorder
            onToggleRecording={onToggleRecording}
            isRecording={isRecording}
          />
        )}

        <div className="text-[#6D737A] text-center">
          {audioURL ? (
            <div>
              <p className="flex items-center justify-center">
                Click <PlayCircleIcon stroke="#E72929" className="mx-2" />
                to play your test recording.
              </p>
              <p>
                If your microphone works properly please click{" "}
                <span className="font-bold text-[#E72929]">Start Exam</span>{" "}
                button
              </p>
            </div>
          ) : (
            <div>
              <p>
                You have <span className="font-bold">20 seconds</span> to speak.
              </p>
              <p className="flex items-center justify-center">
                To complete this activity, you must allow access to your
                system's microphone. Click
                <PlayCircleIcon stroke="#E72929" className="mx-2" />
                the button below to Start.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {audioURL ? (
            <Button onClick={onResetRecording} size="lg">
              Test Mic Again <RotateCcwIcon />
            </Button>
          ) : (
            <Button onClick={onToggleRecording} size="lg">
              {isRecording ? "Stop Recording" : "Test Microphone"}
              <PlayCircleIcon />
            </Button>
          )}

          {audioURL ? (
            <Button onClick={toggleSetDoneTest} size="lg">
              Start Exam <LogInIcon />
            </Button>
          ) : (
            <Button variant="secondary" onClick={toggleSetDoneTest} size="lg">
              Skip <SkipForwardIcon width={16} height={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
