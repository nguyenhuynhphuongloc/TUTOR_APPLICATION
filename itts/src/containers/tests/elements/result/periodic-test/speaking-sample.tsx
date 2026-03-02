import { highlightWords, removeHighlightByClass } from "@/lib/utils";
import { useEffect } from "react";

export default function SpeakingSample({ passageRef, sample, vocabs }: any) {
  useEffect(() => {
    // 1. Clear all highlight vàng
    removeHighlightByClass(passageRef.current!, "highlight-yellow");

    // 2. Highlight từ vựng mặc định (vàng)
    highlightWords(passageRef.current!, vocabs, "highlight-yellow");
  }, [sample, vocabs, passageRef]);

  return (
    <p className="text-left" ref={passageRef}>
      {sample}
    </p>
  );
}
