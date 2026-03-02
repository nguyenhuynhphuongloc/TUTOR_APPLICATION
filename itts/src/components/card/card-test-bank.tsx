"use client";

import SelectMode from "@/app/(app)/(authenticated)/student/tests/[attemptId]/SelectModeModal";
import { Card } from "@/components/ui/card";
import { type PeriodicTest } from "@/payload-types";
import {
  BookTextIcon,
  CheckIcon,
  ClipboardListIcon,
  HeadphonesIcon,
  MicIcon,
  NotepadTextIcon,
  PenIcon,
  SheetIcon,
  TimerIcon,
} from "lucide-react";

const SKILL_ICONS: Record<string, typeof HeadphonesIcon> = {
  listening: HeadphonesIcon,
  reading: BookTextIcon,
  writing: PenIcon,
  speaking: MicIcon,
  grammar: SheetIcon,
  vocab: ClipboardListIcon,
};

const CardTestBank = ({
  mode,
  data,
  isDone,
}: {
  mode: string;
  data: PeriodicTest;
  isDone?: boolean;
}) => {
  const skills = data!.tests.map((test) =>
    typeof test === "string" ? "reading" : test.type,
  ) as any[];

  const Component = SelectMode as any;

  return (
    <Component skills={skills} testId={data.id}>
      {mode === "full" ? (
        <Card className="cursor-pointer min-w-[238px] h-[99px] bg-[rgba(168,171,178,0.1)] pt-4 px-3 relative border-none">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[16px]">{data.title}</p>
            {isDone && (
              <div className="rounded-full  bg-[#23BD33] h-[14px] w-[14px] flex items-center justify-center">
                <CheckIcon width={10} height={10} className="text-white" />
              </div>
            )}
          </div>
          <div className="absolute right-0 top-0 bg-white min-h-[42px] min-w-[42px] flex items-center justify-center text-[#E72929] rounded-bl-xl border-white border-4 gap-1 p-1">
            {data.tests.map((test) => {
              const Icon =
                typeof test === "string"
                  ? SKILL_ICONS.reading
                  : SKILL_ICONS[(test as any).type];
              return Icon ? (
                <Icon
                  key={typeof test === "string" ? test : test.id}
                  width={18}
                  height={18}
                />
              ) : null;
            })}
          </div>

          <div className="flex justify-between items-center mt-6 text-[#6D737A]">
            <div className="flex items-center gap-1 text-[12px]">
              <NotepadTextIcon width={16} height={16} /> 40 câu
            </div>
            <div className="flex items-center gap-1 text-[12px]">
              <TimerIcon width={16} height={16} /> 40 phút
            </div>
          </div>
        </Card>
      ) : (
        <Card className="w-full h-[51px] bg-[rgba(168,171,178,0.1)] p-[16px] flex items-center justify-between border-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#E72929]">
              {data.tests.map((test) => {
                const Icon =
                  typeof test === "string"
                    ? SKILL_ICONS.reading
                    : SKILL_ICONS[(test as any).type];
                return Icon ? (
                  <Icon
                    key={typeof test === "string" ? test : test.id}
                    width={18}
                    height={18}
                  />
                ) : null;
              })}
            </div>

            <p className="text-[16px] font-semibold">{data.title}</p>
            {isDone && (
              <div className=" rounded-full  bg-[#23BD33] h-[14px] w-[14px] flex items-center justify-center">
                <CheckIcon width={10} height={10} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center gap-10">
            <div className="flex items-center gap-1 text-[12px]">
              <NotepadTextIcon width={16} height={16} /> 40 câu
            </div>
            <div className="flex items-center gap-1 text-[12px]">
              <TimerIcon width={16} height={16} /> 40 phút
            </div>
          </div>
        </Card>
      )}
    </Component>
  );
};

export default CardTestBank;
