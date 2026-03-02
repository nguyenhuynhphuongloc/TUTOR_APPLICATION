"use client";

import CardVocabulary from "@/components/card/card-vocabulary";
import PageLoading from "@/components/PageLoading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Vocabulary } from "@/payload-types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function TopicPage() {
  const { data, isLoading, error } = useQuery<{ docs: Vocabulary[] }>({
    queryKey: ["topics"],
    queryFn: () => fetch("/api/vocabulary?limit=0").then((res) => res.json()),
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-[#E72929]" asChild>
              <Link href="/student/vocabulary"> Bộ sưu tập từ vựng</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#E72929]" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-[#6D737A]">
              TOPIC
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between w-full mb-6">
        <p className="text-[24px] font-bold">Danh sách Topic</p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {!data?.docs || data?.docs.length === 0 ? (
          <div className="text-center col-span-4">Chưa có bộ sưu tập nào</div>
        ) : (
          data?.docs.map((topic: Vocabulary) => (
            <CardVocabulary data={topic} key={topic.id} />
          ))
        )}
      </div>
    </div>
  );
}
