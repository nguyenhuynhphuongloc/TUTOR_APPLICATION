"use client";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";

import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../../blocks";
import type { Answer, EditorValue } from "../../types";

function Vocabulary({ vocab }: Test) {
  const {
    filledAnswers,
    setAnswer,
    setQuestionNo: setSkillQuestionNo,
    getQuestionNo: getSkillQuestionNo,
  } = useStore(
    useShallow((state) => ({
      filledAnswers: state.answerSheet.vocab,
      setAnswer: state.setAnswer,
      setQuestionNo: state.setQuestionNo,
      getQuestionNo: state.getQuestionNo,
    })),
  );
  useStore(useShallow((state) => state.questionNoMap));

  const skill = "vocab";

  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo(skill, questionId);
  };

  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo(skill, questionId);
  };

  const setVocabAnswer = ({ questionNumber, ...payload }: Answer) => {
    setAnswer(skill, questionNumber, payload);
  };

  if (!vocab || !Array.isArray(vocab.sections)) {
    return null;
  }

  return (
    <div>
      <div className="relative mb-6">
        <Editor
          value={vocab.description as EditorValue}
          theme={previewEditorTheme}
          mode="read_only"
        />
      </div>
      <>
        {vocab.sections.map((block) => {
          const BlockComponent =
            blockResolver[block?.blockType as keyof typeof blockResolver];

          if (!BlockComponent) {
            return null;
          }

          return (
            <Fragment key={block.id}>
              <BlockComponent
                key={block?.id}
                filledAnswers={filledAnswers}
                setAnswer={setVocabAnswer}
                setQuestionNo={setQuestionNo}
                getQuestionNo={getQuestionNo}
                {...(block as any)}
              />
            </Fragment>
          );
        })}
      </>
    </div>
  );
}

export default Vocabulary;
