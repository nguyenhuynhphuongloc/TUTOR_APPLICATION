"use client";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";

import { TOUR_STEP_MINI_IDS } from "@/app/(app)/(unauthenticated)/placement-tests/[leadId]/mini/[testId]/root";
import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../../blocks";
import type { Answer, EditorValue } from "../../types";

function Grammar({ grammar }: Test) {
  const {
    filledAnswers,
    setAnswer,
    setQuestionNo: setSkillQuestionNo,
    getQuestionNo: getSkillQuestionNo,
  } = useStore(
    useShallow((state) => ({
      filledAnswers: state.answerSheet.grammar,
      setAnswer: state.setAnswer,
      setQuestionNo: state.setQuestionNo,
      getQuestionNo: state.getQuestionNo,
    })),
  );
  useStore(useShallow((state) => state.questionNoMap));

  const skill = "grammar";

  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo(skill, questionId);
  };

  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo(skill, questionId);
  };

  const setGrammarAnswer = ({ questionNumber, ...payload }: Answer) => {
    setAnswer(skill, questionNumber, payload);
  };

  if (!grammar || !Array.isArray(grammar.sections)) {
    return null;
  }

  return (
    <>
      <div className="relative mb-6" id={TOUR_STEP_MINI_IDS.HIGHLIGHT}>
        <Editor
          value={grammar.description as EditorValue}
          theme={previewEditorTheme}
          mode="read_only"
        />
      </div>
      {grammar.sections.map((block, index) => {
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
              setAnswer={setGrammarAnswer}
              setQuestionNo={setQuestionNo}
              getQuestionNo={getQuestionNo}
              {...(block as any)}
              id={index === 0 ? TOUR_STEP_MINI_IDS.PICK_ANSWER : block?.id}
            />
          </Fragment>
        );
      })}
    </>
  );
}

export default Grammar;
