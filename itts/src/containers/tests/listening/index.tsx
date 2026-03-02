"use client";

import { Fragment } from "react";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";

import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../blocks";
import type { EditorValue } from "../types";

function Listening({ name, listening }: Test) {
  const setSkillQuestionNo = useStore(
    useShallow((state) => state.setQuestionNo),
  );
  const getSkillQuestionNo = useStore(
    useShallow((state) => state.getQuestionNo),
  );
  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo("listening", questionId);
  };
  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo("listening", questionId);
  };

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr]">
      {listening?.map((passage) => {
        const { id, title, description, audio, sections } = passage;
        return (
          <Fragment key={id}>
            <div className="p-6">
              <div className="text-[14px] font-semibold text-[#151515]">
                {name}
              </div>
              <div className="mb-[18px] mt-[40px]">
                <div key={id} className="flex flex-col gap-6">
                  <div>
                    <div className="text-[32px] font-bold text-[#151515]">
                      {title}
                    </div>
                    <div className="relative">
                      <Editor
                        value={description as EditorValue}
                        theme={previewEditorTheme}
                        mode="read_only"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
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
                      <div>
                        {section?.content.map((block) => {
                          const setAnswer = () => {};
                          const BlockComponent =
                            blockResolver[
                              block?.blockType as keyof typeof blockResolver
                            ];

                          if (!BlockComponent) {
                            return null;
                          }

                          return (
                            <Fragment key={block?.id}>
                              <BlockComponent
                                key={block?.id}
                                setAnswer={setAnswer}
                                setQuestionNo={setQuestionNo}
                                getQuestionNo={getQuestionNo}
                                filledAnswers={[]}
                                {...block}
                              />
                            </Fragment>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default Listening;
