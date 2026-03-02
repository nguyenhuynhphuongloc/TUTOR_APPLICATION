"use client";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";

import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../blocks";
import type { EditorValue } from "../types";

function Grammar({ grammar }: Test) {
  const setSkillQuestionNo = useStore(
    useShallow((state) => state.setQuestionNo),
  );
  const getSkillQuestionNo = useStore(
    useShallow((state) => state.getQuestionNo),
  );
  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo("grammar", questionId);
  };
  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo("grammar", questionId);
  };

  if (!grammar || !Array.isArray(grammar.sections)) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="relative mb-6">
        <Editor
          value={grammar.description as EditorValue}
          theme={previewEditorTheme}
          mode="read_only"
        />
      </div>
      <>
        {grammar.sections.map((block) => {
          const BlockComponent =
            blockResolver[block?.blockType as keyof typeof blockResolver];

          if (!BlockComponent) {
            return null;
          }

          return (
            <Fragment key={block.id}>
              <BlockComponent
                key={block?.id}
                setAnswer={() => {}}
                setQuestionNo={setQuestionNo}
                getQuestionNo={getQuestionNo}
                filledAnswers={[]}
                {...(block as any)}
              />
            </Fragment>
          );
        })}
      </>
    </div>
  );
}

export default Grammar;
