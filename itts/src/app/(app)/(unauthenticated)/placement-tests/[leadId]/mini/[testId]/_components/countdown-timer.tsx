"use client";

import Image from "next/image";
import { TOUR_STEP_MINI_IDS } from "../root";

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2);
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
};

export default function CountdownTimer({ timeLeft }: { timeLeft: number }) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      id={TOUR_STEP_MINI_IDS.TIMER}
    >
      <Image src="/icons/timer-pause.svg" alt="time" width={32} height={32} />
      <span className="text-2xl font-bold tabular-nums text-[#E72929]">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
