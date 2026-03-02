/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import Clipboard from "@/components/icons/clipboard";
import AddVocabularyToCollectionModal from "@/components/modal/AddVocabularyToCollectionModal";
import { DataTable } from "@/components/table/Table";
import { Button } from "@/components/ui/button";
import { columns } from "@/containers/vocabulary/Columns";
import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import AnswerExplain from "./AnswerExplain";
import Passage from "./Passage";

export default function ReviewExplain({
  data,
  audioURL,
}: {
  data: Test[];
  audioURL: string;
}) {
  const selectedSection = useStore(
    useShallow((s) => s.navigation.currentSection),
  );
  const [rowSelection, setRowSelection] = useState({});
  const columnClones = useMemo(() => columns, []);
  const currentSection = data?.[selectedSection];

  const { vocabs } = currentSection;

  const table = useReactTable({
    data: vocabs || [],
    columns: columnClones,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const setSection = useStore(useShallow((s) => s.setSection));
  const passageRef = useRef<HTMLParagraphElement>(null);
  const playerRef = useRef<HTMLAudioElement>(null);
  const selectedWords = table.getSelectedRowModel().rows.map((r) => r.original);

  const passage = audioURL
    ? currentSection?.transcript
    : currentSection?.passage;

  const BeforePagination = () => {
    return (
      <AddVocabularyToCollectionModal words={selectedWords}>
        <Button variant={"outline"}>Thêm vào bộ sưu tập</Button>
      </AddVocabularyToCollectionModal>
    );
  };

  return (
    <div>
      <p className="text-[32px] font-bold mt-20 mb-8">Review & Explanation</p>

      <div className="border border-[#E3DBD8] rounded-[24px] pl-6 pt-6 pb-6 flex flex-col mb-10">
        <div className="flex h-screen mb-20">
          {currentSection && (
            <AnswerExplain
              selectedSection={selectedSection}
              setSection={setSection}
              currentSection={currentSection as any}
              listeningLength={data?.length}
              passageRef={passageRef}
              skill={audioURL ? "listening" : "reading"}
              playerRef={playerRef}
            />
          )}
          <Passage
            audioURL={audioURL}
            passage={passage}
            passageRef={passageRef}
            selectedSection={selectedSection}
            playerRef={playerRef}
          />
        </div>
        {vocabs && vocabs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-white">
              <Clipboard fill="#E72929" />
              <p className="text-[#E72929] font-extrabold text-[20px]">
                Vocabulary to note
              </p>
            </div>

            <DataTable beforePagination={<BeforePagination />} table={table} />
          </div>
        )}
      </div>
    </div>
  );
}
