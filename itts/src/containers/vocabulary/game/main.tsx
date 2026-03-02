/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { useVocabulary } from "@/app/(app)/_providers/Vocabulary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Stage1 from "@/containers/vocabulary/game/stage-1";
import Stage2 from "@/containers/vocabulary/game/stage-2";
import Stage3 from "@/containers/vocabulary/game/stage-3";
import Stage4 from "@/containers/vocabulary/game/stage-4";
import Stage5 from "@/containers/vocabulary/game/stage-5";
import Stage6 from "@/containers/vocabulary/game/stage-6";
import Stage7 from "@/containers/vocabulary/game/stage-7";
import Stage8 from "@/containers/vocabulary/game/stage-8";
import Stage9 from "@/containers/vocabulary/game/stage-9";
import { useQueryClient } from "@tanstack/react-query";
import { LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const stageData = Array.from({ length: 9 }, (_, i) => i + 1);

const componentResolver = {
  "1": Stage1,
  "2": Stage2,
  "3": Stage3,
  "4": Stage4,
  "5": Stage5,
  "6": Stage6,
  "7": Stage7,
  "8": Stage8,
  "9": Stage9,
};

export default function GamePage() {
  const [stage, setStage] = useState(1);
  const { selectedWords } = useVocabulary();
  const pathname = usePathname();
  const isCollection = pathname.includes("collection");

  const queryClient = useQueryClient();
  const cachedTopic = queryClient.getQueryData(["topic_id"]);
  const Component = componentResolver[stage] ? componentResolver[stage] : null;
  return (
    <div>
      <Breadcrumb className="mb-3">
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
            <BreadcrumbLink className="font-semibold text-[#6D737A]" asChild>
              <Link href={pathname.split("/").slice(0, -1).join("/")}>
                {cachedTopic?.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">Game</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex h-[58px] w-full items-center justify-between rounded-[12px] border border-[#E7EAE9] px-[12px]">
        <p className="font-bold text-[#6D737A]">Stage:</p>
        {stageData.map((number) => {
          const isActive = stage === number;

          return (
            <div
              key={number}
              className={cn(
                "flex h-[34px] w-[100px] items-center justify-center rounded-3xl border font-bold",
                isActive
                  ? "border-[#E729291A] bg-[#E729291A] text-[#E72929]"
                  : "text-[#6D737A]",
              )}
              onClick={() => setStage(number)}
            >
              <span className="">
                {number > stage ? <LockKeyholeIcon size={20} /> : number}
              </span>
            </div>
          );
        })}
      </div>

      <Component data={selectedWords} setStage={setStage} />
    </div>
  );
}
