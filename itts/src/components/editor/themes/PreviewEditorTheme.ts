/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorThemeClasses } from "lexical";

import "./PreviewEditorTheme.css";

const theme: EditorThemeClasses = {
  autocomplete: "PreviewEditorTheme__autocomplete",
  blockCursor: "PreviewEditorTheme__blockCursor",
  characterLimit: "PreviewEditorTheme__characterLimit",
  code: "PreviewEditorTheme__code",
  codeHighlight: {
    atrule: "PreviewEditorTheme__tokenAttr",
    attr: "PreviewEditorTheme__tokenAttr",
    boolean: "PreviewEditorTheme__tokenProperty",
    builtin: "PreviewEditorTheme__tokenSelector",
    cdata: "PreviewEditorTheme__tokenComment",
    char: "PreviewEditorTheme__tokenSelector",
    class: "PreviewEditorTheme__tokenFunction",
    "class-name": "PreviewEditorTheme__tokenFunction",
    comment: "PreviewEditorTheme__tokenComment",
    constant: "PreviewEditorTheme__tokenProperty",
    deleted: "PreviewEditorTheme__tokenProperty",
    doctype: "PreviewEditorTheme__tokenComment",
    entity: "PreviewEditorTheme__tokenOperator",
    function: "PreviewEditorTheme__tokenFunction",
    important: "PreviewEditorTheme__tokenVariable",
    inserted: "PreviewEditorTheme__tokenSelector",
    keyword: "PreviewEditorTheme__tokenAttr",
    namespace: "PreviewEditorTheme__tokenVariable",
    number: "PreviewEditorTheme__tokenProperty",
    operator: "PreviewEditorTheme__tokenOperator",
    prolog: "PreviewEditorTheme__tokenComment",
    property: "PreviewEditorTheme__tokenProperty",
    punctuation: "PreviewEditorTheme__tokenPunctuation",
    regex: "PreviewEditorTheme__tokenVariable",
    selector: "PreviewEditorTheme__tokenSelector",
    string: "PreviewEditorTheme__tokenSelector",
    symbol: "PreviewEditorTheme__tokenProperty",
    tag: "PreviewEditorTheme__tokenProperty",
    url: "PreviewEditorTheme__tokenOperator",
    variable: "PreviewEditorTheme__tokenVariable",
  },
  embedBlock: {
    base: "PreviewEditorTheme__embedBlock",
    focus: "PreviewEditorTheme__embedBlockFocus",
  },
  hashtag: "PreviewEditorTheme__hashtag",
  heading: {
    h1: "PreviewEditorTheme__h1",
    h2: "PreviewEditorTheme__h2",
    h3: "PreviewEditorTheme__h3",
    h4: "PreviewEditorTheme__h4",
    h5: "PreviewEditorTheme__h5",
    h6: "PreviewEditorTheme__h6",
  },
  hr: "PreviewEditorTheme__hr",
  image: "editor-image",
  indent: "PreviewEditorTheme__indent",
  inlineImage: "inline-editor-image",
  layoutContainer: "PreviewEditorTheme__layoutContainer",
  layoutItem: "PreviewEditorTheme__layoutItem",
  link: "PreviewEditorTheme__link",
  list: {
    checklist: "PreviewEditorTheme__checklist",
    listitem: "PreviewEditorTheme__listItem",
    listitemChecked: "PreviewEditorTheme__listItemChecked",
    listitemUnchecked: "PreviewEditorTheme__listItemUnchecked",
    nested: {
      listitem: "PreviewEditorTheme__nestedListItem",
    },
    olDepth: [
      "PreviewEditorTheme__ol1",
      "PreviewEditorTheme__ol2",
      "PreviewEditorTheme__ol3",
      "PreviewEditorTheme__ol4",
      "PreviewEditorTheme__ol5",
    ],
    ul: "PreviewEditorTheme__ul",
  },
  ltr: "PreviewEditorTheme__ltr",
  mark: "PreviewEditorTheme__mark",
  markOverlap: "PreviewEditorTheme__markOverlap",
  paragraph: "PreviewEditorTheme__paragraph",
  quote: "PreviewEditorTheme__quote",
  rtl: "PreviewEditorTheme__rtl",
  specialText: "PreviewEditorTheme__specialText",
  tab: "PreviewEditorTheme__tabNode",
  table: "PreviewEditorTheme__table",
  tableCell: "PreviewEditorTheme__tableCell",
  tableCellActionButton: "PreviewEditorTheme__tableCellActionButton",
  tableCellActionButtonContainer:
    "PreviewEditorTheme__tableCellActionButtonContainer",
  tableCellHeader: "PreviewEditorTheme__tableCellHeader",
  tableCellResizer: "PreviewEditorTheme__tableCellResizer",
  tableCellSelected: "PreviewEditorTheme__tableCellSelected",
  tableRowStriping: "PreviewEditorTheme__tableRowStriping",
  tableScrollableWrapper: "PreviewEditorTheme__tableScrollableWrapper",
  tableSelected: "PreviewEditorTheme__tableSelected",
  tableSelection: "PreviewEditorTheme__tableSelection",
  text: {
    bold: "PreviewEditorTheme__textBold",
    code: "PreviewEditorTheme__textCode",
    italic: "PreviewEditorTheme__textItalic",
    strikethrough: "PreviewEditorTheme__textStrikethrough",
    subscript: "PreviewEditorTheme__textSubscript",
    superscript: "PreviewEditorTheme__textSuperscript",
    underline: "PreviewEditorTheme__textUnderline",
    underlineStrikethrough: "PreviewEditorTheme__textUnderlineStrikethrough",
  },
};

export default theme;
