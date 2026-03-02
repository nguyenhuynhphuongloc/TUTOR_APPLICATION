import { useState } from "react";

type HintType = "select" | "fill";

export function useHint(threshold = 2) {
  const [wrongCount, setWrongCount] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  const registerWrongAttemptForHint = (
    type: HintType,
    correctWord: string | undefined = "",
    userInput?: string,
  ) => {
    const newCount = wrongCount + 1;
    setWrongCount(newCount);

    if (newCount >= threshold) {
      if (type === "select") {
        // Gợi ý: chữ đầu tiên + _ cho phần còn lại + số ký tự
        const firstLetter = correctWord[0];
        setHint(
          `${firstLetter}${"_".repeat(correctWord.length - 1)} (${correctWord.length})`,
        );
      }

      if (type === "fill" && userInput !== undefined) {
        let matched = false;

        const hintString = correctWord
          .split("")
          .map((char, i) => {
            if (userInput[i] && userInput[i] === char) {
              matched = true;
              return char;
            }
            return "_";
          })
          .join("");

        if (!matched) {
          // Nếu sai hết → hint chữ đầu tiên
          const firstLetter = correctWord[0];
          setHint(
            `${firstLetter}${"_".repeat(correctWord.length - 1)} (${correctWord.length})`,
          );
        } else {
          setHint(`${hintString} (${correctWord.length})`);
        }
      }
    }
  };

  const resetHint = () => {
    setWrongCount(0);
    setHint(null);
  };

  return {
    hint,
    registerWrongAttemptForHint,
    resetHint,
  };
}
