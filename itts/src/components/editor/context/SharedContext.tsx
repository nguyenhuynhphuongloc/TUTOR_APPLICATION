import { type NodeKey } from "lexical";
import { createContext, use, useRef } from "react";
import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

type Answer = {
  uuid: string;
  answer: string;
  answerLocation?: string;
  explanation?: string;
  key?: NodeKey;
};

type Comment = {
  uuid: string;
  text: string;
  author?: string;
};

interface SharedProps {
  answers?: Record<string, Answer>;
  comments?: Record<string, Comment>;
  initialComments?: any[];
  mode?: string;
}

interface SharedState extends SharedProps {
  addAnswer: (uuid: string, answer: Answer) => void;
  removeAnswer: (uuid: string) => void;
  removeAnswerByKey: (key: string) => void;
}

type SharedStore = ReturnType<typeof createSharedStore>;

const DEFAULT_PROPS: SharedProps = {
  answers: {},
  comments: {},
  initialComments: [],
  mode: "",
};

const createSharedStore = (props?: Partial<SharedProps>) => {
  return createStore<SharedState>()(
    immer((set) => ({
      ...DEFAULT_PROPS,
      ...props,
      addAnswer: (uuid: string, answer: Answer) =>
        set((state) => {
          if (!state.answers) state.answers = {};
          state.answers[uuid] = answer;
        }),
      removeAnswer: (uuid: string) =>
        set((state) => {
          if (!state.answers) return;
          delete state.answers[uuid];
        }),
      removeAnswerByKey: (key: string) =>
        set((state) => {
          if (!state.answers) return;
          const uuid = Object.values(state.answers).find(
            (ans) => ans.key === key,
          )?.uuid;
          if (uuid) {
            delete state.answers[uuid];
          }
        }),
      addComment: (uuid: string, comment: Comment) =>
        set((state) => {
          if (!state.comments) state.comments = {};
          state.comments[uuid] = { ...comment };
        }),
      removeComment: (uuid: string) =>
        set((state) => {
          if (!state.comments) return;
          delete state.comments[uuid];
        }),
    })),
  );
};

export const Context = createContext<SharedStore | null>(null);

type SharedProviderProps = React.PropsWithChildren<SharedProps>;

function SharedContext({ children, ...props }: SharedProviderProps) {
  const storeRef = useRef<SharedStore>(null);
  if (!storeRef.current) {
    storeRef.current = createSharedStore(props);
  }
  return <Context value={storeRef.current}>{children}</Context>;
}

function useSharedContext<T>(selector: (state: SharedState) => T): T {
  const store = use(Context);
  if (!store) throw new Error("Missing SharedProvider in the tree");
  return useStore(store, selector);
}

export { SharedContext, useSharedContext };
