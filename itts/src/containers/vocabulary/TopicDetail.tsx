"use client";

import { useVocabulary } from "@/app/(app)/_providers/Vocabulary";
import AddVocabularyToCollectionModal from "@/components/modal/AddVocabularyToCollectionModal";
import { DataTable } from "@/components/table/Table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { columns } from "./Columns";

/**
 * Renders a single topic detail component.
 *
 * @param {Object} props The component props.
 * @param {Vocabulary} props.data The topic data.
 * @returns {JSX.Element} The topic detail component.
 */
const TopicDetail = (): JSX.Element => {
  const router = useRouter();
  const { id } = useParams();
  const [rowSelection, setRowSelection] = useState({});
  const pathname = usePathname();
  const { setSelectedWords } = useVocabulary();
  const isCollection = pathname.includes("collection");
  const { data, isLoading, error } = useQuery({
    queryKey: ["topic_id"],
    queryFn: () =>
      fetch(
        `/api/${isCollection ? "personal-vocab" : "vocabulary"}/${id}`,
      ).then((res) => res.json()),
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: data?.words,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const selectedWords = table.getSelectedRowModel().rows.map((r) => r.original);
  const handleLearn = () => {
    setSelectedWords(selectedWords);
    router.push(`/student/vocabulary/topics/${data.id}/game`);
  };

  const AfterPagination = () => {
    return (
      <Button
        onClick={handleLearn}
        disabled={
          !table.getFilteredSelectedRowModel().rows.length ||
          table.getFilteredSelectedRowModel().rows.length < 4
        }
      >
        Learn now {table.getFilteredSelectedRowModel().rows.length} /{" "}
        {table.getFilteredRowModel().rows.length}.
      </Button>
    );
  };

  const BeforePagination = () => {
    return isCollection ? (
      <></>
    ) : (
      <AddVocabularyToCollectionModal words={selectedWords}>
        <Button variant={"outline"}>Thêm vào bộ sưu tập</Button>
      </AddVocabularyToCollectionModal>
    );
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-[#E72929]" asChild>
              <Link href="/student/vocabulary"> Bộ sưu tập từ vựng</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#E72929]" />
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold text-[#6D737A]" asChild>
              <Link href={pathname.split("/").slice(0, -1).join("/")}>
                {isCollection ? "YOUR COLLECTION" : "TOPIC"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">
              {data.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-[12px] flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">Topic {data.name}</p>
        </div>
        {/* <div>Select</div> */}
      </div>

      <div className="w-full py-6">
        <DataTable
          afterPagination={<AfterPagination />}
          beforePagination={<BeforePagination />}
          table={table}
        />
      </div>
    </div>
  );
};

export default TopicDetail;
