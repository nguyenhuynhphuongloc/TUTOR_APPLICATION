"use client";

import { Media } from "@/components/media";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlockOptionType, BlockQuestionType, BlockType } from "./types";

function DiagramLabeling({
  questions,
  diagramImage,
  options,
  matchingLabel,
}: BlockType) {
  if (!questions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[70%,30%] gap-2">
        {diagramImage && (
          <div className="relative min-h-[360px] w-full select-none">
            <Media
              className=""
              imgClassName="rounded-[12px] object-contain max-h-[600px]"
              resource={diagramImage}
            />
          </div>
        )}
        <div className="rounded-lg bg-[#E7EAE9] px-6 py-4">
          {matchingLabel ? (
            <h3 className="mb-3 text-[16px] font-bold text-[#151515]">
              {matchingLabel}
            </h3>
          ) : null}
          <div className="flex flex-col gap-1">
            {(Array.isArray(options) ? options : [])?.map(
              (option: BlockOptionType) => (
                <p key={option.id} className="text-[14px]">
                  <span className="inline-block w-9 font-bold">
                    {option.value?.toUpperCase()}.
                  </span>{" "}
                  {option.label}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        {(Array.isArray(questions) ? questions : [])?.map(
          (question: BlockQuestionType) => {
            if (!question.id) {
              return null;
            }

            return (
              <div
                key={question.id}
                id={question.id}
                className="flex items-center"
              >
                <p className="text-[16px]">
                  <span className="inline-block w-6 font-bold">
                    {question.questionNumber}.
                  </span>{" "}
                </p>
                <Select>
                  <SelectTrigger className="w-max">
                    <SelectValue placeholder="Select a heading" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {(Array.isArray(options) ? options : [])?.map(
                        (option: BlockOptionType) => (
                          <SelectItem key={option.id} value={option.value}>
                            <span className="inline-block w-9 font-bold">
                              {option.value?.toUpperCase()}.
                            </span>{" "}
                            {option.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

export default DiagramLabeling;
