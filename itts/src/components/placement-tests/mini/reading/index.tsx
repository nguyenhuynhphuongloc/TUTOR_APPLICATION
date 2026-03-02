"use client";

import type { Test } from "@/payload-types";
import type { Answer, EditorValue } from "../../types";

import { Fragment } from "react";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { Media } from "@/components/media";

import { useStore } from "@/zustand/placement-test/provider";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../../blocks";

function Reading({ reading }: Test) {
  const {
    filledAnswers,
    setAnswer,
    setQuestionNo: setSkillQuestionNo,
    getQuestionNo: getSkillQuestionNo,
  } = useStore(
    useShallow((state) => ({
      filledAnswers: state.answerSheet.reading,
      setAnswer: state.setAnswer,
      setQuestionNo: state.setQuestionNo,
      getQuestionNo: state.getQuestionNo,
    })),
  );
  useStore(useShallow((state) => state.questionNoMap));

  const skill = "reading";

  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo(skill, questionId);
  };

  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo(skill, questionId);
  };

  const setGrammarAnswer = ({ questionNumber, ...payload }: Answer) => {
    setAnswer(skill, questionNumber, payload);
  };

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr]">
      {reading?.map(
        ({ id, description, image, passage: passageText, sections }) => {
          return (
            <Fragment key={id}>
              <div className="pr-6">
                <div key={id} className="flex flex-col gap-6">
                  <div className="relative">
                    <Editor
                      value={description as EditorValue}
                      theme={previewEditorTheme}
                      mode="read_only"
                    />
                  </div>
                  {image && typeof image !== "string" && (
                    <div className="relative min-h-[360px] w-full select-none">
                      <Media
                        fill
                        className=""
                        imgClassName="rounded-[12px] object-cover"
                        resource={image}
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Editor
                      value={passageText as EditorValue}
                      theme={previewEditorTheme}
                      mode="practice"
                    />
                  </div>
                </div>
              </div>
              <div className="h-full w-px border border-dashed border-[#CBCBCB]"></div>
              <div className="pl-6">
                {sections?.map((section) => {
                  return (
                    <div key={section?.id}>
                      <div className="relative mb-6">
                        <Editor
                          value={section?.description as EditorValue}
                          theme={previewEditorTheme}
                          mode="read_only"
                        />
                      </div>
                      {section?.content.map((block) => {
                        const BlockComponent =
                          blockResolver[
                            block?.blockType as keyof typeof blockResolver
                          ];

                        if (!BlockComponent) {
                          return null;
                        }

                        return (
                          <BlockComponent
                            key={block?.id}
                            filledAnswers={filledAnswers}
                            setAnswer={setGrammarAnswer}
                            setQuestionNo={setQuestionNo}
                            getQuestionNo={getQuestionNo}
                            {...(block as any)}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </Fragment>
          );
        },
      )}
    </div>
  );
}

export default Reading;
