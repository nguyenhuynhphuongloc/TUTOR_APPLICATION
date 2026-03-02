/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { getBlobDuration } from "@/lib/utils";
import { PauseIcon, VolumeOff } from "lucide-react";
import Image from "next/image";
import {
  Fragment,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PlayButtonIcon from "../icons/play-button-icon";
import { Button } from "../ui/button";
import AudioProgressBar from "./audio-progress-bar";
import "./index.css";

function formatDurationDisplay(duration: number) {
  if (!isFinite(duration)) return "00:00";
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);

  const formatted = [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":");

  return formatted;
}

type AudioPlayerProps = {
  audioURL: string;
  type?: string;
  ref?: Ref<HTMLAudioElement>;
};

/**
 * A functional component that renders an audio player
 * @param {{ audioURL: string }} props - The component props
 * @returns {JSX.Element} - The rendered component
 */
export default function AudioPlayer({
  audioURL,
  type = "playback",
  ref,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const isSeekingRef = useRef(false);
  const [buffered, setBuffered] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const durationDisplay = formatDurationDisplay(duration);
  const elapsedDisplay = formatDurationDisplay(currentProgress);

  useEffect(() => {
    void getBlobDuration(audioURL).then((duration: number) => {
      setDuration(duration);
      return;
    });
  });

  useImperativeHandle(ref, () => ({
    seekTo(seconds: number) {
      if (!audioRef.current) return;
      const safeSeconds = Math.min(Math.max(seconds, 0), duration);
      audioRef.current.currentTime = safeSeconds;
      setCurrentProgress(safeSeconds);
      audioRef.current.play();
    },
  }));

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          throw new Error(err.massage);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioURL) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [audioURL]);

  const handleBufferProgress: React.ReactEventHandler<HTMLAudioElement> = (
    e,
  ) => {
    const audio = e.currentTarget;
    const dur = audio.duration;
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i,
          );
          setBuffered(bufferedLength);
          break;
        }
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  const handleTimeUpdate = (e) => {
    setCurrentProgress(e.currentTarget.currentTime);
    handleBufferProgress(e);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentProgress(0);
  };

  const handleClickVolume = () => {
    if (volume > 0) {
      setVolume(0);

      audioRef.current.volume = 0;
      return;
    }
    if (volume === 0) {
      setVolume(1);

      audioRef.current.volume = 1;
      return;
    }
  };

  const handleRewind = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(audioRef.current.currentTime - 5, 0);
    audioRef.current.currentTime = newTime;
    setCurrentProgress(newTime);
  };

  const handleForward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(audioRef.current.currentTime + 5, duration);
    audioRef.current.currentTime = newTime;
    setCurrentProgress(newTime);
  };

  return (
    <div
      className="w-full relative rounded-xl"
      style={{
        boxShadow: type === "playback" ? "0px 0px 60px 0px #0000001A" : "",
      }}
    >
      {type === "playback" ? (
        <Fragment>
          {audioURL && (
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={handleAudioEnd}
              onPlaying={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onProgress={handleBufferProgress}
              onTimeUpdate={handleTimeUpdate}
              onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
              preload="metadata"
              className="hidden"
            />
          )}
          <div className="flex items-center bg-white rounded-xl">
            <div className="w-[133px] h-[64px] flex items-center justify-center bg-[#E729291A] rounded-s-xl">
              {isPlaying ? (
                <button
                  onClick={togglePlayPause}
                  className="h-10 w-10 flex items-center justify-center flex-shrink-0 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-[#E72929] hover:brightness-110 hover:shadow-md transition"
                >
                  <PauseIcon />
                </button>
              ) : (
                <div className="h-10 w-10 flex items-center justify-center flex-shrink-0 rounded-full hover:brightness-110 hover:shadow-md transition">
                  <PlayButtonIcon
                    onClick={togglePlayPause}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center flex-grow p-4 gap-3">
              <div className="flex-grow">
                <AudioProgressBar
                  duration={duration}
                  currentProgress={currentProgress}
                  onMouseDown={() => (isSeekingRef.current = true)}
                  onMouseUp={() => (isSeekingRef.current = false)}
                  onChange={(e) => {
                    if (!audioRef.current) return;

                    audioRef.current.currentTime =
                      e.currentTarget.valueAsNumber;

                    setCurrentProgress(e.currentTarget.valueAsNumber);
                  }}
                />
              </div>

              <div className=" text-[#E72929] text-xs font-medium">
                {elapsedDisplay} / {durationDisplay}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {volume > 0 ? (
                  <Image
                    src="/volumn-high.svg"
                    alt="volume-high"
                    width={24}
                    height={24}
                    onClick={handleClickVolume}
                    className="cursor-pointer"
                  />
                ) : (
                  <VolumeOff
                    size={24}
                    onClick={handleClickVolume}
                    className="cursor-pointer"
                  />
                )}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="volume-slider w-24 h-[6px] bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  style={{
                    background: `linear-gradient(to right, #E72929 ${
                      volume * 100
                    }%, #E5E7EB ${volume * 100}%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div>
            {audioURL && (
              <audio
                ref={audioRef}
                src={audioURL}
                onEnded={handleAudioEnd}
                onPlaying={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onProgress={handleBufferProgress}
                onTimeUpdate={handleTimeUpdate}
                onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
                preload="metadata"
                className="hidden"
              />
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className=" text-[#6D737A] text-[12px] font-medium text-left">
                {elapsedDisplay}
              </div>
              <div className="w-full">
                <AudioProgressBar
                  duration={duration}
                  currentProgress={currentProgress}
                  onMouseDown={() => (isSeekingRef.current = true)}
                  onMouseUp={() => (isSeekingRef.current = false)}
                  onChange={(e) => {
                    if (!audioRef.current) return;

                    audioRef.current.currentTime =
                      e.currentTarget.valueAsNumber;

                    setCurrentProgress(e.currentTarget.valueAsNumber);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={handleRewind} variant="ghost" size="icon">
                  <Image
                    src="/backward-5-seconds.svg"
                    alt="backward-5-seconds"
                    width={36}
                    height={36}
                  />
                </Button>
                {isPlaying ? (
                  <button
                    onClick={togglePlayPause}
                    className="h-10 w-10 flex items-center justify-center flex-shrink-0 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-[#E72929] hover:brightness-110 hover:shadow-md transition"
                  >
                    <PauseIcon />
                  </button>
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center flex-shrink-0 rounded-full hover:brightness-110 hover:shadow-md transition">
                    <PlayButtonIcon
                      onClick={togglePlayPause}
                      className="cursor-pointer"
                    />
                  </div>
                )}
                <Button onClick={handleForward} variant="ghost" size="icon">
                  <Image
                    src="/forward-5-seconds.svg"
                    alt="forward-5-seconds"
                    width={36}
                    height={36}
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {volume > 0 ? (
                  <Image
                    src="/volumn-high.svg"
                    alt="volume-high"
                    width={24}
                    height={24}
                    onClick={handleClickVolume}
                    className="cursor-pointer"
                  />
                ) : (
                  <VolumeOff
                    size={24}
                    onClick={handleClickVolume}
                    className="cursor-pointer"
                  />
                )}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="volume-slider w-40 h-[6px] bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  style={{
                    background: `linear-gradient(to right, #E72929 ${
                      volume * 100
                    }%, #E5E7EB ${volume * 100}%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
