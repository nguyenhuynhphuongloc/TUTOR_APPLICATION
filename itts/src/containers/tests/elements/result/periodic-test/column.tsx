"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type AnswerExplain = {
  answerLocation: string;
  explanation: string;
  questionTitle: string;
  locationParagraph: string;
};

export const columns: ColumnDef<AnswerExplain>[] = [
  {
    accessorKey: "locationParagraph",
    header: "Vị trí đoạn văn",
  },
  {
    accessorKey: "answerLocation",
    header: "Câu trong bài",
  },
  {
    accessorKey: "questionTitle",
    header: "Câu hỏi",
  },
  {
    accessorKey: "explanation",
    header: "Giải thích",
  },
];
