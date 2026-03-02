"use client";

import { cn } from "@/lib/utils";
import { useWavesurfer } from "@wavesurfer/react";
import { Loader2, PauseIcon, PlayIcon } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

export const AudioPlayer = memo(
  ({ resource, disablePause }: { resource?: any; disablePause?: boolean }) => {
    const containerRef = useRef(null);
    const initialUrlRef = useRef<string>(resource?.url || "");

    const [duration, setDuration] = useState<number>(0);
    const [played, setPlayed] = useState(false);

    const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
      container: containerRef,
      interact: false,
      height: 50,
      waveColor: "#A8A8A8",
      progressColor: "#FB233B",
      barWidth: 3,
      barGap: 0,
      barRadius: 3,
      url: initialUrlRef.current,
    });

    useEffect(() => {
      if (!wavesurfer) return;

      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration());
      });

      wavesurfer.on("finish", () => {
        setPlayed(true);
        wavesurfer.stop();
      });

      // Ngăn chặn pause nếu disablePause được bật
      if (disablePause) {
        wavesurfer.on("pause", () => {
          // Chỉ play lại nếu chưa kết thúc và đang trong quá trình nghe
          if (wavesurfer.getCurrentTime() < wavesurfer.getDuration()) {
            wavesurfer.play();
          }
        });

        // Chặn phím Media Pause trên trình duyệt (như F8 trên Macbook)
        if ("mediaSession" in navigator) {
          navigator.mediaSession.setActionHandler("pause", () => {
            if (wavesurfer.getCurrentTime() < wavesurfer.getDuration()) {
              wavesurfer.play();
            }
          });
        }
      }

      return () => {
        wavesurfer.unAll();
        if (disablePause && "mediaSession" in navigator) {
          navigator.mediaSession.setActionHandler("pause", null);
        }
      };
    }, [wavesurfer, disablePause]);

    const onPlay = useCallback(() => {
      if (!wavesurfer || played) return;
      wavesurfer.play();
    }, [wavesurfer]);

    return (
      <div className="flex gap-10 h-20 bg-white shadow-lg rounded-[12px] items-center px-6 py-4">
        <button
          type="button"
          className={cn(
            "size-12 bg-[#E72929] rounded-full inline-flex justify-center items-center",
          )}
          onClick={onPlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          <Loader2
            className={cn("animate-spin stroke-white", {
              ["hidden"]: isReady,
            })}
          />
          <PauseIcon
            className={cn("fill-white stroke-white", {
              ["hidden"]: !isReady || !isPlaying,
            })}
          />
          <PlayIcon
            className={cn("fill-white stroke-white", {
              ["hidden"]: !isReady || isPlaying,
            })}
          />
        </button>
        <span
          className={cn("w-10 font-medium text-[12px] text-[#6D737A] -mr-10", {
            ["hidden"]: !isReady,
          })}
        >
          {formatTime(duration - currentTime)}
        </span>

        <div className="flex-1" ref={containerRef} />
      </div>
    );
  },
  (prev, next) => prev.resource?.url === next.resource?.url,
);
