/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorState, LexicalEditor } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { memo, useLayoutEffect } from "react";
import isEqual from "react-fast-compare";
import { useShallow } from "zustand/react/shallow";

import { useSharedContext } from "../../context/SharedContext";

export const OnChangePlugin = memo(function OnChangePlugin({
  ignoreHistoryMergeTagChange = true,
  ignoreSelectionChange = false,
  onChange,
}: {
  ignoreHistoryMergeTagChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange?: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    answerState?: any,
    commentState?: any,
  ) => void;
}): null {
  const [editor] = useLexicalComposerContext();
  const answerState = useSharedContext(useShallow((state) => state.answers));
  const mode = useSharedContext((state) => state.mode);

  useLayoutEffect(() => {
    if (onChange) {
      return editor.registerUpdateListener(
        ({
          editorState,
          dirtyElements,
          dirtyLeaves,
          prevEditorState,
          tags,
        }) => {
          if (
            (ignoreSelectionChange &&
              dirtyElements.size === 0 &&
              dirtyLeaves.size === 0) ||
            (ignoreHistoryMergeTagChange && tags.has("history-merge")) ||
            prevEditorState.isEmpty()
          ) {
            return;
          }
          if (mode === "in_admin" || mode === "practice") {
            onChange(editorState, editor, tags, answerState);
          }
        },
      );
    }
  }, [
    editor,
    answerState,
    ignoreHistoryMergeTagChange,
    ignoreSelectionChange,
    onChange,
  ]);

  return null;
}, isEqual);
