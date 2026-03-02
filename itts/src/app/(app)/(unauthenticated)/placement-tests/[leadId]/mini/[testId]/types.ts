export type MultipleChoiceBlock = {
  questions: {
    questionNumber: number;
    question: string;
    answerLocation?: string | null;
    explanation?: string | null;
    isMultipleCorrectAnswer?: boolean | null;
    answer: {
      answer: string;
      correctAnswer: boolean;
      id?: string | null;
    }[];
    id?: string | null;
  }[];
  id?: string | null;
  blockName?: string | null;
  blockType: "multipleChoice";
};

export type ProgressItem = {
  type: "grammar" | "reading" | "writing" | "listening" | "speaking" | "vocab";
  content?:
    | MultipleChoiceBlock[]
    | {
        id: string;
        questions: {
          id: string;
        }[];
      }[];
};
