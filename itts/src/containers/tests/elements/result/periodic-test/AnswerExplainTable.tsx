import { DataTable } from "@/components/table/Table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type JSX, useMemo } from "react";
import { columns } from "./column";

/**
 * A functional component that renders a table of answers and explanations.
 * @param {{
 *   data: {
 *     id: number;
 *     answer: string | null;
 *     isCorrect: boolean;
 *     correctAnswers: string;
 *     explanation: string | null;
 *     locationParagraph: string | null;
 *   };
 *   skill: "listening" | "reading" | "writing" | "speaking";
 * }} props - The properties passed to the component.
 * @returns {JSX.Element} A div containing a DataTable component.
 */
export const AnswerExplainTable = ({
  data,
  skill,
}: {
  data: {
    id: number;
    answer: string | null;
    isCorrect: boolean;
    correctAnswers: string;
    explanation: string | null;
    locationParagraph: string | null;
  };
  skill: "listening" | "reading" | "writing" | "speaking";
}): JSX.Element => {
  const filteredColumns = useMemo(() => {
    return columns.filter((col) => {
      if (col.accessorKey !== "locationParagraph") return true;
      return false;
    });
  }, [skill]);

  const table = useReactTable({
    data: [data],
    columns: skill === "listening" ? filteredColumns : columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <DataTable table={table} pagination={false} />
    </div>
  );
};
