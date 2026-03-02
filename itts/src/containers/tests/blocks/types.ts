import type { Media } from "@/payload-types";

export type BlockQuestionType = {
  questionNumber: number;
  correctAnswer: string;
  question: string;
  answerLocation?: string | null;
  explanation?: string | null;
  id?: string | null;
  answer?: {
    answer: string;
    correctAnswer: boolean;
    id?: string | null;
  }[];
};

export type BlockOptionType = {
  value: string;
  id?: string | null;
  label: string;
};

export type BlockType = {
  questions?: BlockQuestionType[];
  options?: BlockOptionType[] | string;
  matchingLabel?: string;
  diagramImage?: Media;
};
