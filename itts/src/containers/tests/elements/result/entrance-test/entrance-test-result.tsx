/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import type { Lead, Test } from "@/payload-types";
// import { Image, StyleSheet } from "@react-pdf/renderer";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  BookTextIcon,
  ClipboardListIcon,
  HeadphonesIcon,
  LayoutGridIcon,
  MicIcon,
  PenIcon,
  SendHorizonalIcon,
  SheetIcon,
} from "lucide-react";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import { DataTable } from "@/components/table/Table";
import { Button } from "@/components/ui/button";
import {
  calculateDuration,
  capitalizeFirstLetter,
  cn,
  generatePDF,
} from "@/lib/utils";
import Image from "next/image";
import SkillScore from "./skill-score";

interface TabSkill {
  name: string;
  icon: JSX.Element;
  value: string;
  isMini?: boolean;
}

const tabs: TabSkill[] = [
  { name: "All skill", icon: <LayoutGridIcon />, value: "all_skill" },
  {
    name: "Listening",
    icon: <HeadphonesIcon />,
    value: "listening",
  },
  {
    name: "Vocab",
    icon: <ClipboardListIcon />,
    value: "vocab",
    isMini: true,
  },
  {
    name: "Grammar",
    icon: <SheetIcon />,
    value: "grammar",
    isMini: true,
  },
  {
    name: "Reading",
    icon: <BookTextIcon />,
    value: "reading",
  },
  {
    name: "Writing",
    icon: <PenIcon />,
    value: "writing",
  },
  {
    name: "Speaking",
    icon: <MicIcon />,
    value: "speaking",
  },
];

const MINI_TIME = 1800;
const FULL_TIME = 7200;

const desiredOrder = ["listening", "reading", "writing", "speaking"];
const desiredOrderMini = ["vocab", "grammar", "reading", "writing"];

/**
 * A functional component that renders the entrance test result.
 *
 * @param {{ data: {score: number; startedAt: string; completedAt: string}; testResult: Record<string, {isCorrect: boolean}[]>; lead: {fullName: string} }} props - The properties passed to the component.
 * @returns {JSX.Element} A div containing the text 'entrace-test-result'.
 */
function EntranceTestResult({
  test,
  data,
  testResult,
  lead,
}: {
  data: {
    score: Record<string, number>;
    startedAt: string;
    completedAt: string;
    type: "mini" | "full";
    skillLevel: string;
    description: string;
  };
  testResult: Record<string, { isCorrect: boolean }[]>;
  lead: Lead;
  test?: Test[];
}): JSX.Element {
  const writing = test?.find((t: Test) => t.type === "writing") as
    | Test
    | undefined;

  const writingQuestions = (writing?.writing?.map((w) => ({
    brainstorm: w.brainstorm,
    content: w.content,
    description: w.description,
    image: w.image,
  })) || []) as [];

  const { score, startedAt, completedAt, type, skillLevel, description } = data;
  const { formattedTime, totalSeconds } = calculateDuration(
    startedAt,
    completedAt,
  );
  const isMini = type === "mini";

  const reordered = (isMini ? desiredOrderMini : desiredOrder).reduce(
    (acc, key) => {
      if (testResult && testResult[key]) {
        acc[key] = testResult[key];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const filename = `${lead.fullName}-${type}.pdf`;
  const [isPdf, setIsPdf] = useState(false);
  const [currentTab, setCurrentTabs] = useState(tabs[0]);

  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="leading-[18px]">
            <p className="mt-1">Band Score</p>
            <p className="mb-1 text-[14px]">Điểm tổng</p>
          </div>
        ),
        accessorKey: "score",
        size: 200,
        cell: ({ row }) => {
          return (
            <div
              className="text-[#6D737A] font-bold text-3xl"
              style={{
                marginTop: isPdf ? -18 : 0,
                paddingBottom: isPdf ? 6 : 0,
              }}
            >
              Band {row.original.score?.score}
            </div>
          );
        },
      },
      {
        header: () => (
          <div className="leading-[18px]">
            <p className="mt-1">Skill level</p>
            <p className="mb-1 text-[14px]">Trình độ kỹ năng</p>
          </div>
        ),
        accessorKey: "skillLevel",
        size: 250,
        cell: ({ row }) => {
          return (
            <div
              className="text-[#6D737A] text-2xl"
              style={{ marginTop: isPdf ? -18 : 0 }}
            >
              {row.original.score?.skillLevel}
            </div>
          );
        },
      },
      {
        header: () => (
          <div className="leading-[18px]">
            <p className="mt-1">Description</p>
            <p className="mb-1 text-[14px]">Nhận xét và đánh giá</p>
          </div>
        ),
        accessorKey: "description",
        size: 470,
        cell: ({ row }) => {
          return (
            <div style={{ marginTop: isPdf ? -14 : 0 }}>
              {row.original.score?.description}
            </div>
          );
        },
      },
    ],
    [isPdf],
  );

  const tableData = useMemo(() => [{ score, skillLevel, description }], [data]);

  const skills = Object.keys(reordered || {}).reduce<
    Record<
      string,
      { name: string; score: number; correct: string; max: string }
    >
  >((acc, skill) => {
    const skillData = reordered[skill];
    if (!skillData) return acc;

    let scorePoint = 0;
    let max = 0;
    let correct = "";

    if (isMini) {
      const arrSkill = Object.values(skillData);
      scorePoint = arrSkill.reduce((acc: number, answer: any) => {
        if (answer?.isCorrect) {
          return acc + 1;
        }
        return acc;
      }, 0);
      max = arrSkill.length;
      correct = `${scorePoint}/${max}`;
    } else {
      if (skill === "writing" || skill === "speaking") {
        // Assuming skillData for writing/speaking is an array of objects with an 'overallScore'
        // This part needs to be adapted based on the actual structure of writing/speaking testResult
        // For now, using a placeholder logic based on the user's partial snippet
        let overallScore = 0;
        let totalTasks = 0;
        if (Array.isArray(skillData)) {
          skillData.forEach((task: any) => {
            const scoreVal = Number(task?.overallScore || 0);
            overallScore += scoreVal; // Simple sum, adjust if weighted
            totalTasks++;
          });
        }
        scorePoint = overallScore;
        max = totalTasks > 0 ? 10 : 0; // Placeholder max score, adjust as needed
        correct = `${scorePoint}/${max}`;
      } else {
        const arrSkill = Object.values(skillData);
        scorePoint = arrSkill.reduce((total: number, group: any) => {
          if (!group) return total;
          return (
            total +
            Object.values(group).reduce(
              (count: number, item: any) => count + (item?.isCorrect ? 1 : 0),
              0,
            )
          );
        }, 0);
        max = arrSkill.reduce((total: number, group: any) => {
          if (!group) return total;
          return total + Object.keys(group).length;
        }, 0);
        correct = `${scorePoint}/${max}`;
      }
    }

    acc[skill] = {
      name: skill,
      score: scorePoint,
      correct,
      max: String(max),
    };
    return acc;
  }, {});

  const attributes = [
    {
      name: "Skills",
      value: Object.keys(reordered || {}).length,
      maxValue: 4,
      max: 4,
    },
    {
      name: "Entrance level",
      value: score?.score ? Number(score?.score).toFixed(1) : "0.0",
      maxValue: "10",
    },
    {
      name: "Test time",
      value: totalSeconds,
      displayValue: formattedTime,
      max: isMini ? "30:00" : "2:00:00",

      maxValue: isMini ? MINI_TIME : FULL_TIME,
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  useEffect(() => {
    const genPDF = async () => {
      await generatePDF("pdf-content", filename).then(() => {
        setIsPdf(false);
      });
    };
    if (isPdf) {
      genPDF();
    }
  }, [isPdf]);

  const handleGeneratePDF = () => {
    setIsPdf(true);
  };

  return (
    <div className="overflow-hidden">
      <div className="w-screen mx-auto overflow-hidden" id="pdf-content">
        <div className="w-screen flex flex-col items-center justify-center">
          <div
            className="w-[1392px] rounded-b-3xl bg-[#E72929] h-[158px] text-white"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 32,
            }}
          >
            <Image
              src="/logo-white.svg"
              alt="logo-white"
              width={180}
              height={61}
            />
            <div
              className="mb-8 flex flex-col"
              style={{ marginTop: isPdf ? -18 : 0 }}
            >
              <span className="text-[40px] font-extrabold">
                IELTS THE TUTORS
              </span>
              <span className="font-bold text-[28px]">
                {`PLACEMENT TEST'S RESULT`}
              </span>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center">
            <div className="text-center">
              <p className="text-[#151515] text-[32px] font-bold">
                Dear <span className="text-[#E72929]">{lead.fullName}</span>
              </p>

              <div className="text-base text-[#6D737A] ">
                <p>
                  Thank you for choosing to take{" "}
                  <b>
                    IELTS Placement{" "}
                    {type === "mini" ? "Mini Test" : "Test (Full)"}
                  </b>{" "}
                  with <b>IELTS The Tutors.</b>
                </p>
                <p>
                  We are pleased to inform your recent results on{" "}
                  <b>{format(new Date(startedAt), "dd/MM/yyyy")}</b> as below.
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between gap-[120px]">
              {attributes.map((attr) => {
                return (
                  <div className="w-[127px]" key={attr.name}>
                    <CircleProgressBar
                      value={(attr.value * 100) / attr.maxValue}
                    >
                      <div className="text-center">
                        <div
                          className={cn(
                            "mt-6 text-2xl font-bold text-[#E72929]",
                            attr.max ? "" : "text-[32px]",
                          )}
                        >
                          {attr.displayValue ?? attr.value}
                        </div>
                        {attr.max && (
                          <div className="text-md mt-[-6px] text-[#151515]">
                            ({attr.max})
                          </div>
                        )}
                      </div>
                    </CircleProgressBar>
                    <p className="text-center text-[#A8ABB2] mt-[-16px]">
                      {attr.name}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-8 gap-6">
              {Object.keys(skills).map((skill) => {
                const attr = skills[skill];
                return (
                  <div
                    key={attr?.name}
                    className="w-[193px] h-[78px] bg-white rounded-full border-[#E7EAE9] border"
                    style={{
                      padding: 12,
                      gap: 12,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="font-bold rounded-full bg-[#E729291A] border-[#E7292933] text-[#E72929] relative"
                      style={{
                        padding: 12,
                        width: 54,
                        height: 54,
                        lineHeight: 1,
                      }}
                    >
                      <span
                        style={{
                          left: "50%",
                          top: isPdf ? "33%" : "50%",
                          transform: "translate(-50%, -50%)",
                          position: "absolute",
                        }}
                      >
                        {attr?.score}
                      </span>
                    </div>
                    <div style={{ marginTop: isPdf ? -14 : 0 }}>
                      <div className="text-[#151515] font-semibold">
                        {capitalizeFirstLetter(attr?.name)}
                      </div>
                      <div className="text-[#6D737A]">{attr?.correct}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-[82px] w-[920px]">
              <div className="flex gap-2 items-center justify-center mb-4">
                <Image
                  src="/mini-icon.svg"
                  width={32}
                  height={32}
                  alt="mini-icon"
                  style={{ marginTop: isPdf ? -12 : 0 }}
                />
                <p
                  className="font-extrabold text-[#151515] text-2xl"
                  style={{ marginTop: isPdf ? -30 : 0 }}
                >
                  What does your score mean?
                </p>
              </div>

              <DataTable
                table={table}
                pagination={false}
                columnLength={columns.length}
                isPdfPrinting={isPdf}
              />
            </div>

            <div className="flex items-center px-6 w-[600px] mt-[80px]">
              <div className="h-[1px] flex-grow bg-[#E9E9E9]" />
              <div className="mx-4 text-red-500">
                <svg
                  viewBox="0 0 24 24"
                  className="h-2.5 w-2.5"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="h-[1px] flex-grow bg-[#E9E9E9]" />
            </div>

            <div className="flex items-center justify-between mt-[80px] gap-4">
              {tabs
                .filter((tab) => {
                  if (!isMini) return !["grammar", "vocab"].includes(tab.value);
                  return !["speaking", "listening"].includes(tab.value);
                })
                .map((tab) => (
                  <div
                    key={tab.name}
                    className={cn(
                      "transition-colors duration-200 hover:bg-[#E729291A] hover:border-[#E72929] cursor-pointer w-[113px] h-[48px] border border-[#E7EAE9] text-[#6D737A] hover:text-[#E72929] rounded-[10px] flex items-center justify-center gap-2",
                      tab.value === currentTab?.value
                        ? "bg-[#E729291A] border-[#E72929] text-[#E72929]"
                        : "",
                    )}
                    onClick={() => setCurrentTabs(tab)}
                  >
                    {tab.icon}
                    <p
                      className="text-center font-semibold text-[16px]"
                      style={{ marginTop: isPdf ? -14 : 0 }}
                    >
                      {tab.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {currentTab?.value === "all_skill"
          ? tabs
              .slice(1)
              .filter((tab) => reordered[tab.value])
              .map((tab) => (
                <SkillScore
                  key={tab.value}
                  skillInfo={tab}
                  testResult={reordered}
                  type={type}
                  isPdf={isPdf}
                  writingQuestions={writingQuestions}
                  lead={lead}
                  test={test}
                />
              ))
          : reordered[currentTab.value] && (
              <SkillScore
                skillInfo={currentTab}
                testResult={reordered}
                type={type}
                isPdf={isPdf}
                writingQuestions={writingQuestions}
                lead={lead}
                test={test}
              />
            )}
      </div>
      <div className="text-center mt-10 mb-10">
        <Button
          disabled={currentTab?.value !== "all_skill"}
          className="bg-[#FBA631] no-export"
          size="xl"
          onClick={handleGeneratePDF}
        >
          Xuất PDF <SendHorizonalIcon />
        </Button>
      </div>
    </div>
  );
}

export default EntranceTestResult;
