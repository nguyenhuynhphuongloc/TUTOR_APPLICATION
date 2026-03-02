"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { VocabularyCard } from "./_components/VocabularyCard";

const CARDS = [
  {
    title: "TOPIC",
    bgImage: "/topic-bg.png",
    href: "/student/vocabulary/topics",
  },
  {
    title: "YOUR COLLECTION",
    bgImage: "/collection-bg.png",
    href: "/student/vocabulary/custom-collection",
  },
];

export default function VocabularyPage() {
  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-black">
              Bộ sưu tập từ vựng
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between gap-4">
        {CARDS.map((card) => (
          <VocabularyCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}
