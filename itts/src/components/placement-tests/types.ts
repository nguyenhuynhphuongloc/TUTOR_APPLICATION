export type EditorValue = {
  editor: string;
  correctAnswers?: object;
  text?: string;
};

export type Answer = {
  id: string;
  questionNumber: number | string;
  answer: string;
  correctAnswers?: string | string[];
  isCorrect?: boolean;
  type: string;
};

export type SkillAnswers = Record<string, Answer>;
