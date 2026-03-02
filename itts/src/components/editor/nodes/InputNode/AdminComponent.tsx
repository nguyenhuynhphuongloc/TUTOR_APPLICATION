"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { Button } from "@payloadcms/ui";
import { $getNodeByKey, NodeKey } from "lexical";
import { useCallback, useEffect } from "react";

import { $isInputNode, InputNode } from ".";
import { useSharedContext } from "../../context/SharedContext";
import useModal from "../../hooks/useModal";

import EditForm from "./EditForm";

function Component({
  nodeKey,
  uuid,
  answer,
  answerLocation,
  explanation,
  questionTitle,
  locateTime,
}: {
  nodeKey: NodeKey;
  uuid: string;
  answer: string;
  answerLocation?: string;
  explanation?: string;
  questionTitle?: string;
  locateTime?: string;
}): React.JSX.Element {
  const [editor] = useLexicalComposerContext();
  const addAnswer = useSharedContext((state) => state.addAnswer);
  const removeAnswerByKey = useSharedContext(
    (state) => state.removeAnswerByKey,
  );

  const [modal, showModal] = useModal();

  const withInputNode = useCallback(
    (cb: (node: InputNode) => void, onUpdate?: () => void): void => {
      editor.update(
        () => {
          const node = $getNodeByKey(nodeKey);
          if ($isInputNode(node)) {
            cb(node);
          }
        },
        { onUpdate },
      );
    },
    [editor],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerMutationListener(
        InputNode,
        (mutations) => {
          editor.getEditorState().read(() => {
            for (const [key, mutation] of mutations) {
              if (mutation === "destroyed") {
                removeAnswerByKey(key);
              } else {
                const node = $getNodeByKey(key);
                if ($isInputNode(node)) {
                  addAnswer(node.__uuid, {
                    key: node.__key,
                    uuid: node.__uuid,
                    answer: node.__answer,
                    answerLocation: node.__answerLocation,
                    explanation: node.__explanation,
                  });
                }
              }
            }
          });
        },
        { skipInitialization: false },
      ),
    );
  }, [editor]);

  return (
    <div className="relative mx-2">
      <Button
        type="button"
        size="small"
        buttonStyle="secondary"
        className="m-0 h-[26px] min-w-[130px] rounded-[16px] border border-solid border-[#e7eae9] px-5 py-0 text-[#6d737a] shadow-none"
        onClick={(event) => {
          event.preventDefault();
          showModal("Edit Question", (onClose) => (
            <EditForm
              answer={answer}
              answerLocation={answerLocation}
              explanation={explanation}
              questionTitle={questionTitle}
              locateTime={locateTime}
              withInputNode={withInputNode}
              onClose={onClose}
            />
          ));
        }}
      >
        {answer}
      </Button>
      {modal}
    </div>
  );
}

export default Component;
