import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MicIcon } from "lucide-react";

import type { JSX } from "react";

interface AudioRecorderProps {
  isRecording: boolean;
  onToggleRecording?: () => void;
}

/**
 * Component for audio recording with a toggle button.
 *
 * @param {AudioRecorderProps} props - The component props.
 * @param {boolean} props.isRecording - Indicates if recording is active.
 * @param {() => void} props.onToggleRecording - Callback to toggle recording state.
 * @returns {JSX.Element} - The rendered component.
 */
export default function AudioRecorder({
  isRecording,
  onToggleRecording,
}: AudioRecorderProps): JSX.Element {
  return (
    <div className="flex items-center flex-col">
      <div className="relative">
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#E72929] opacity-50"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <button
          onClick={onToggleRecording}
          className={cn(
            "relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg cursor-pointer",
            isRecording ? "bg-[#FFE5E5]" : "bg-gray-200",
          )}
        >
          <MicIcon
            size={40}
            className={cn(!isRecording ? `text-gray-600` : `text-red-500`)}
          />
        </button>
      </div>
    </div>
  );
}
