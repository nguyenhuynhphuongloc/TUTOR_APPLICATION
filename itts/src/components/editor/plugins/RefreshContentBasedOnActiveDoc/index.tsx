import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_HISTORY_COMMAND } from "lexical";
import { useLayoutEffect } from "react";
import { useSharedContext } from "../../context/SharedContext";

interface RefreshContentBasedOnActiveDocProps {
  initialEditorState: any;
  cacheKey?: string;
}

export function RefreshContentBasedOnActiveDoc({
  initialEditorState,
}: RefreshContentBasedOnActiveDocProps) {
  const [editor] = useLexicalComposerContext();
  const mode = useSharedContext((state) => state.mode);

  // Set editor state on mount (practice mode only)
  useLayoutEffect(() => {
    queueMicrotask(() => {
      if (editor && mode === "practice") {
        const newState = editor.parseEditorState(initialEditorState);
        editor.setEditorState(newState);
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      }
    });
  }, [editor, initialEditorState, mode]);

  return null;
}
