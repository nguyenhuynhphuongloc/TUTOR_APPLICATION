import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from "lexical";

export const TOGGLE_HIGHLIGHT_COMMAND: LexicalCommand<string> = createCommand(
  "TOGGLE_HIGHLIGHT_COMMAND",
);

export const ToggleHighlightPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) return;

    return editor.registerCommand(
      TOGGLE_HIGHLIGHT_COMMAND,
      (inputColor = "#FFEFB7") => {
        applyHighlight(editor, inputColor);
        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [editor]);

  return null;
};

function applyHighlight(editor: LexicalEditor, inputColor: string) {
  editor.update(() => {
    let color: string = inputColor;
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) return;

    if (selection.isCollapsed()) return;

    const currentColor = $getSelectionStyleValueForProperty(
      selection,
      "background-color",
    );

    if (currentColor === "#FFEFB7") {
      color = "none";
    }

    $patchStyleText(selection, { "background-color": color });
  });
}
