/* eslint-disable @typescript-eslint/no-inferrable-types */
"use client";

import { useState } from "react";

export default function useTextToSpeech(lang: string = "en-US") {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string, onEnd?: () => void) => {
    if (!text) return;
    if (isSpeaking) return; // Avoid overlapping

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd(); // Call the callback after speech ends
    };

    utterance.onerror = (err) => {
      console.error("Speech synthesis error:", err);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speak, stop };
}
