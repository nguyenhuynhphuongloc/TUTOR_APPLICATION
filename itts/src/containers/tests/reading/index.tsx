"use client";

import type { Test } from "@/payload-types";
import type { EditorValue } from "../types";

import { Fragment } from "react";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { Media } from "@/components/media";

import { useStore } from "@/zustand/placement-test/provider";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../blocks";

function Reading({ name, reading }: Test) {
  const setSkillQuestionNo = useStore(
    useShallow((state) => state.setQuestionNo),
  );
  const getSkillQuestionNo = useStore(
    useShallow((state) => state.getQuestionNo),
  );
  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo("reading", questionId);
  };
  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo("reading", questionId);
  };

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr]">
      {reading?.map(
        ({ id, title, description, image, passage: passageText, sections }) => {
          return (
            <Fragment key={id}>
              <div className="p-6">
                <div className="text-[14px] font-semibold text-[#151515]">
                  {name}
                </div>
                <div className="mt-[40px]">
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
              </div>
              <div className="h-full w-px border border-dashed border-[#CBCBCB]"></div>
              <div className="p-6">
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
                            <BlockComponent
                              key={block?.id}
                              setAnswer={setAnswer}
                              setQuestionNo={setQuestionNo}
                              getQuestionNo={getQuestionNo}
                              filledAnswers={[]}
                              {...(block as any)}
                            />
                          );
                        })}
                      </div>
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
