"use client";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { Media } from "@/components/media";

import type { Test } from "@/payload-types";
import type { EditorValue } from "../types";

function Writing({ name, writing }: Test) {
  return (
    <>
      {writing?.map(({ id, description, image, content, writingType }) => {
        return (
          <div className="grid h-full grid-cols-[1fr_auto_1fr]" key={id}>
            <div className="p-6">
              <div className="text-[14px] font-semibold text-[#151515]">
                {name}
              </div>
              <div className="mt-[40px]">
                <div key={id} className="flex flex-col gap-10">
                  <div>
                    <div className="text-[32px] font-bold text-[#151515]">
                      Writing Task {writingType}
                    </div>
                    <Editor
                      value={description as EditorValue}
                      theme={previewEditorTheme}
                      mode="read_only"
                    />
                  </div>
                  <div className="">
                    {image && typeof image !== "string" && (
                      <div className="relative mb-4 min-h-[360px] w-full select-none">
                        <Media
                          fill
                          className=""
                          imgClassName="rounded-[12px] object-cover !relative"
                          resource={image}
                        />
                      </div>
                    )}
                    <Editor
                      value={content as EditorValue}
                      theme={previewEditorTheme}
                      mode="practice"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full w-px border border-dashed border-[#CBCBCB]"></div>
            <div className="p-6"></div>
          </div>
        );
      })}
    </>
  );
}

export default Writing;
