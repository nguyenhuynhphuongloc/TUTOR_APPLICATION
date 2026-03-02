// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  createContextWithSelectors,
  useContextSelector,
} from "@/hooks/use-context-selector";
import * as React from "react";
import { type ReactNode } from "react";

// import type { CommentStore } from '../commenting';
import type { EditorState, LexicalEditor } from "lexical";

interface ContextType {
  onChange?: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    // commentStore?: CommentStore
  ) => void;
}

const Context = createContextWithSelectors<ContextType>({} as ContextType);

export const SharedOnChangeProvider = ({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    answerState?: any,
    commentState?: any,
  ) => void;
}): React.JSX.Element => {
  const sharedOnChangeContext = { onChange };

  return (
    <Context.Provider value={sharedOnChangeContext}>
      {children}
    </Context.Provider>
  );
};

export const useSharedOnChange = (): ContextType => {
  const context = useContextSelector(Context, (c) => c);
  if (context === undefined) {
    throw new Error(
      "useSharedOnChange must be used within an SharedOnChangeProvider",
    );
  }

  return context;
};
