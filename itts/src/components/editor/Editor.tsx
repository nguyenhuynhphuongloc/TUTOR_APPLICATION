"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

import { useSharedContext } from "./context/SharedContext";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import { useSharedOnChange } from "./context/SharedOnChangeProvider";

import { OnChangePlugin } from "./plugins/OnChangePlugin";
import PollPlugin from "./plugins/PollPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TableHoverActionsPlugin from "./plugins/TableHoverActionsPlugin";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { WordCountPlugin } from "./plugins/WordCountPlugin";
// import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import CollapsiblePlugin from "./plugins/CollapsiblePlugin";
import CommentPlugin from "./plugins/CommentPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import InputPlugin from "./plugins/TextInputPlugin";
import { ToggleHighlightPlugin } from "./plugins/ToggleHighlightPlugin";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";

import ContentEditable from "./ui/ContentEditable";

import { cn } from "@/lib/utils";
import { CAN_USE_DOM } from "./utils/canUseDOM";

const placeholder = "Enter some text...";

function Editor() {
  const [editor] = useLexicalComposerContext();
  const { historyState } = useSharedHistoryContext();
  const { onChange } = useSharedOnChange();
  const initialComments = useSharedContext((state) => state.initialComments);

  const [activeEditor, setActiveEditor] = useState(editor);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  if (!CAN_USE_DOM) {
    return null;
  }

  return (
    <>
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
      />
      <div className={cn("editor-container")}>
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor" ref={onRef}>
                <ContentEditable
                  aria-placeholder={placeholder}
                  placeholder={placeholder}
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin externalHistoryState={historyState} />
      <ListPlugin />
      <CheckListPlugin />
      <AutoFocusPlugin />
      <WordCountPlugin />
      <PollPlugin />
      <CollapsiblePlugin />
      <CommentPlugin
        providerFactory={undefined}
        initialComments={initialComments}
      />
      {/* <ComponentPickerMenuPlugin /> */}
      <OnChangePlugin onChange={onChange} ignoreSelectionChange />
      <TablePlugin
        hasCellMerge={true}
        hasCellBackgroundColor={true}
        hasHorizontalScroll={true}
      />
      <TableCellResizer />
      {floatingAnchorElem && !isSmallWidthViewport && (
        <>
          {/* <DraggableBlockPlugin anchorElem={floatingAnchorElem} /> */}
          {/* <CodeActionMenuPlugin anchorElem={floatingAnchorElem} /> */}
          {/* <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                /> */}
          <TableCellActionMenuPlugin
            anchorElem={floatingAnchorElem}
            cellMerge={true}
          />
          <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
          <FloatingTextFormatToolbarPlugin
            anchorElem={floatingAnchorElem}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        </>
      )}
      <InputPlugin />
      <ToggleHighlightPlugin />
      {/* <TreeViewPlugin /> */}
    </>
  );
}

export default Editor;
