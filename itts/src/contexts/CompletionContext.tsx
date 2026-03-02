import { createContext } from "react";

export interface SentenceCompletionContextType {
  getQuestionNo?: (uuid: string) => number;
  filledAnswers?: Record<number, { answer: string }>;
  setAnswer?: (params: {
    id: string;
    questionNumber: number;
    answer: string;
    correctAnswers: string[];
    isCorrect: boolean;
    type: string;
  }) => void;
}

export const SentenceCompletionContext =
  createContext<SentenceCompletionContextType>({});
