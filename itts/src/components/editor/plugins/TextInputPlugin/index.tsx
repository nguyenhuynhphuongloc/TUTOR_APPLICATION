/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import * as React from "react";
import { useEffect } from "react";

import { $createInputNode, InputNode } from "../../nodes/InputNode";

import { v6 as uuid } from "uuid";

export const INSERT_CP1vvky6_COMMAND: LexicalCommand<undefined> = createCommand(
  "INSERT_CP1vvky6_COMMAND",
);

export default function InputPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([InputNode])) {
      throw new Error("InputPlugin: InputNode not registered on editor");
    }

    return editor.registerCommand<string>(
      INSERT_CP1vvky6_COMMAND,
      () => {
        const inputNode = $createInputNode(uuid());
        $insertNodes([inputNode]);
        if ($isRootOrShadowRoot(inputNode.getParentOrThrow())) {
          $wrapNodeInElement(inputNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);
  return null;
}
