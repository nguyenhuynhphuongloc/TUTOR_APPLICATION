import { createStore as zCreateStore } from "zustand";
import { immer } from "zustand/middleware/immer";

type Skill = string;
type Answer = {
  id: string;
  correctAnswers?: string | string[];
  answer: string;
  isCorrect?: boolean;
  type: string;
};
type SkillAnswers = Record<string, Answer>;
type AnswerSheet = Record<Skill, SkillAnswers>;
type AnswerSheetFull = Record<Skill, Record<string, SkillAnswers>>;

export type State = {
  questionNoMap: Record<Skill, Record<string, number>>;
  answerSheet: AnswerSheet;
  answerSheetFull: AnswerSheetFull;
  navigation: {
    timeLeft: number;
    currentSkill: number;
    currentSection: number;
  };
};

export type Actions = {
  setAnswer: (
    skill: Skill,
    questionNumber: number | string,
    payload: Answer,
    part?: string,
    topic?: string,
  ) => void;
  setCurrentSkill: (skill: number) => void;
  goToNextSkill: () => void;
  goToPreviousSkill: () => void;
  setSection: (section: number) => void;
  setQuestionNo: (skill: Skill, questionId: string) => void;
  getQuestionNo: (skill: Skill, questionId: string) => number | undefined;
  setTimeLeft: (timeLeft: number) => void;
  decreaseTimeLeft: () => void;
  setQuestionNoMap: (questionNoMap: State["questionNoMap"]) => void;
};

const defaultInitState: State = {
  questionNoMap: {},
  answerSheet: {},
  answerSheetFull: {},
  navigation: {
    timeLeft: 0,
    currentSkill: 0,
    currentSection: 0,
  },
};

const buildAnswer = (value: Answer): Answer => ({
  id: value.id,
  correctAnswers: value.correctAnswers,
  answer: value.answer,
  isCorrect: value.isCorrect,
  type: value.type,
});

export const createStore = (initState: Partial<State>) =>
  zCreateStore<State & Actions>()(
    immer((set, get) => ({
      ...defaultInitState,
      ...initState,
      setAnswer: (skill, questionNumber, value, part, topic) =>
        set((state) => {
          const qKey = String(questionNumber);

          if (!part) {
            state.answerSheet[skill] ??= {};
            state.answerSheet[skill][qKey] = buildAnswer(value);
          } else {
            state.answerSheetFull[skill] ??= {};
            state.answerSheetFull[skill][part] ??= {};

            if (topic) {
              const topicMap = state.answerSheetFull[skill][
                part
              ] as unknown as Record<string, SkillAnswers>;
              topicMap[topic] ??= {};
              topicMap[topic][qKey] = buildAnswer(value);
            } else {
              const sectionMap = state.answerSheetFull[skill][part] as Record<
                string,
                Answer
              >;
              sectionMap[qKey] = buildAnswer(value);
            }
          }
        }),
      setCurrentSkill: (skill) => {
        set((state) => {
          state.navigation.currentSkill = skill;
        });
      },
      goToNextSkill: () =>
        set((state) => {
          state.navigation.currentSkill =
            Number(state.navigation.currentSkill) + 1;
          state.navigation.currentSection = 0;
          state.navigation.timeLeft = 0;
        }),
      goToPreviousSkill: () =>
        set((state) => {
          state.navigation.currentSkill =
            Number(state.navigation.currentSkill) - 1;
          state.navigation.currentSection = 0;
          state.navigation.timeLeft = 0;
        }),
      setSection: (section: number) =>
        set((state) => {
          state.navigation.currentSection = section;
        }),
      setQuestionNo: (skill: Skill, questionId: string) =>
        set((state) => {
          state.questionNoMap[skill] ??= {};
          if (state.questionNoMap[skill][questionId]) return;
          state.questionNoMap[skill][questionId] =
            Object.keys(state.questionNoMap[skill]).length + 1;
        }),
      getQuestionNo: (skill: Skill, questionId: string) =>
        get().questionNoMap[skill]?.[questionId],
      setTimeLeft: (timeLeft: number) =>
        set((state) => {
          state.navigation.timeLeft = timeLeft;
        }),
      decreaseTimeLeft: () =>
        set((state) => {
          if (state.navigation.timeLeft > 0) {
            state.navigation.timeLeft -= 1;
          }
        }),
      setQuestionNoMap: (questionNoMap: State["questionNoMap"]) =>
        set((state) => {
          state.questionNoMap = questionNoMap;
        }),
    })),
  );
