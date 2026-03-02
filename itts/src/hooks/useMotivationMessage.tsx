import { MOTIVATION } from "@/containers/vocabulary/game/utils";
import { useState } from "react";

export function useMotivationMessage(firstThreshold = 2, displayTime = 2000) {
  const [wrongCount, setWrongCount] = useState(0);
  const [motivationMessage, setMotivationMessage] = useState<string | null>(
    null,
  );
  const [firstShown, setFirstShown] = useState(false);

  const showMessage = () => {
    const randomMsg = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];
    setMotivationMessage(randomMsg);
    setTimeout(() => {
      setMotivationMessage(null);
    }, displayTime);
  };

  const registerWrongAnswer = () => {
    if (!firstShown) {
      // Chưa hiện lần nào → cần đủ firstThreshold lần sai mới hiện
      setWrongCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= firstThreshold) {
          showMessage();
          setFirstShown(true); // Đánh dấu là đã hiện lần đầu
          return newCount; // reset counter
        }
        return newCount;
      });
    } else {
      // Đã hiện ít nhất 1 lần → mỗi lần sai là hiện luôn
      showMessage();
    }
  };
  const resetForNewWord = () => {
    setWrongCount(0);
    setFirstShown(false);
  };

  return {
    motivationMessage,
    registerWrongAnswer,
    resetForNewWord,
  };
}
