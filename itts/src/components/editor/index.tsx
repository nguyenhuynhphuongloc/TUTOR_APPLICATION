"use client";

import { lazy, Suspense, useCallback, useMemo } from "react";
import isEqual from "react-fast-compare";

import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";

import {
  $getRoot,
  $isTextNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type DOMExportOutputMap,
  type EditorState,
  type EditorThemeClasses,
  isHTMLElement,
  type Klass,
  type LexicalEditor,
  type LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import { TableContext } from "./plugins/TablePlugin";

import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { RefreshContentBasedOnActiveDoc } from "./plugins/RefreshContentBasedOnActiveDoc";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";
import playgroundTheme from "./themes/PlaygroundEditorTheme";

import { useEditorStateCache } from "./context/EditorStateCache";
import { SharedContext } from "./context/SharedContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { SharedOnChangeProvider } from "./context/SharedOnChangeProvider";
import { ToolbarContext } from "./context/ToolbarContext";

const Editor = lazy(() => import("./Editor"));

import "./index.css";

type EditorValue = {
  editor: string;
  correctAnswers?: object;
  comment?: object;
  text?: string;
};

type EditorMode = "in_admin" | "practice" | "read_only" | "view_result";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode,
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element!)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output?.forChild === undefined ||
            output?.after !== undefined ||
            output?.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

const createNextValue = (
  serializedState: string,
  answers?: object,
  comment?: object,
  text?: string,
): EditorValue => ({
  editor: serializedState,
  correctAnswers: answers,
  comment,
  text,
});

function EditorProviders({
  value,
  theme = playgroundTheme,
  mode = "in_admin",
  setValue,
  cacheKey,
}: {
  value: EditorValue;
  theme?: EditorThemeClasses;
  mode?: EditorMode;
  setValue?: (value: EditorValue) => void;
  cacheKey?: string;
}) {
  const editorStateCache = useEditorStateCache();

  const cacheData = useMemo(() => {
    if (cacheKey && editorStateCache) {
      return editorStateCache.getCache(cacheKey);
    }
    return undefined;
  }, [cacheKey, editorStateCache]);

  const editorStateToUse = useMemo(() => {
    if (cacheData) return cacheData.editorState;
    if (typeof value === "string") return value;
    return value?.editor ?? undefined;
  }, [value, cacheData]);

  const initialComments = useMemo(() => {
    if (cacheData) return cacheData.comments;
    if (typeof value === "string") return [];
    // Assuming value.comment (or value.commentState) contains the initial comments from server
    // Need to verify where server comments are stored in value
    return (value as any)?.comment ?? [];
  }, [value, cacheData]);

  const initialConfig: InitialConfigType = {
    editable: mode === "in_admin",
    editorState: editorStateToUse,
    html: {
      export: exportMap,
      import: constructImportMap(),
    },
    namespace: "Editor",
    nodes: [...PlaygroundNodes],
    theme,

    onError,
  };

  const sharedProps = {
    mode: mode ?? "in_admin",
    initialComments,
  };

  const onChange = useCallback(
    (
      editorState: EditorState,
      _editor: LexicalEditor,
      _tags: Set<string>,
      answerState?: object,
      commentState?: any,
    ) => {
      const nextSerializedState = JSON.stringify(editorState.toJSON());
      const text = editorState.read(() => $getRoot().getTextContent());

      // Save to cache immediately if cacheKey is provided
      if (cacheKey && editorStateCache) {
        editorStateCache.setCache(cacheKey, {
          editorState: nextSerializedState,
          comments: commentState ?? initialComments,
        });
      }

      const nextValue = createNextValue(
        nextSerializedState,
        answerState,
        commentState,
        text,
      );

      if (!isEqual(value, nextValue)) {
        setValue?.(nextValue);
      }
    },
    [value, cacheKey, editorStateCache, initialComments],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <SharedOnChangeProvider onChange={onChange}>
          <SharedContext {...sharedProps}>
            <TableContext>
              <ToolbarContext>
                <div className="editor-shell">
                  <Suspense fallback={null}>
                    <Editor />
                    <RefreshContentBasedOnActiveDoc
                      initialEditorState={editorStateToUse}
                      cacheKey={cacheKey}
                    />
                  </Suspense>
                </div>
              </ToolbarContext>
            </TableContext>
          </SharedContext>
        </SharedOnChangeProvider>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

export default EditorProviders;
