"use client";

import type { ColumnDef } from "@tanstack/react-table";
import AnimatedButton from "./AnimatedButton";
import CellWord from "./CellWord";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Word = {
  word: string;
  pronunciation?: string | null;
  "meaning-vn"?: string | null;
  "meaning-en"?: string | null;
  example?: string | null;
  type?: ("adjective" | "noun" | "verb" | "adverb") | null;
  id?: string | null;
  level?: string | null;
};

export const columns: ColumnDef<Word>[] = [
  {
    accessorKey: "",
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <AnimatedButton
          isChecked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <AnimatedButton
            onChange={(value) => row.toggleSelected(!!value)}
            isChecked={row.getIsSelected()}
            aria-label="Select row"
          />
        </div>
      );
    },
    size: 50,
  },
  {
    accessorKey: "word",
    header: "New word",
    cell: ({ row: { original } }) => {
      return (
        <CellWord
          word={original.word}
          pronunciation={original.pronunciation}
          id={original.id}
          type={original.type}
        />
      );
    },
    size: 50,
  },
  {
    accessorKey: "meaning-en",
    header: "Meaning in English",
    size: 150,
  },
  {
    accessorKey: "meaning-vn",
    header: "Meaning in Vietnamese",
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row: { original } }) => {
      return <p className="font-bold text-[#E72929]">{original.level}</p>;
    },
    size: 50,
  },
  {
    accessorKey: "antonyms",
    header: "Antonyms",
    cell: ({ row: { original } }) => {
      return original.antonyms.map((antonym) => (
        <div key={antonym.id}>{antonym.word}</div>
      ));
    },
  },
  {
    accessorKey: "synonyms",
    header: "Synonyms",
    cell: ({ row: { original } }) => {
      return original.synonyms.map((synonyms) => (
        <div key={synonyms.id}>{synonyms.word}</div>
      ));
    },
  },
  {
    accessorKey: "example",
    header: "Example",
    size: 150,
  },
];
