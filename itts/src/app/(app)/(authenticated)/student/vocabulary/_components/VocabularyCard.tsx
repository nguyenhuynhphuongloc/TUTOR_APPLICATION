"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface VocabularyCardProps {
  title: string;
  bgImage: string;
  href: string;
}

export const VocabularyCard = ({
  title,
  bgImage,
  href,
}: VocabularyCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div
      className="relative h-[248px] w-full cursor-pointer rounded-2xl text-[72px]"
      onClick={handleClick}
    >
      <Image
        src={bgImage}
        alt={title}
        width={526}
        height={72}
        className="absolute h-[248px] w-full rounded-2xl object-cover"
      />
      <div className="absolute z-[2] h-full w-full rounded-2xl bg-black/70 shadow-md shadow-black/25"></div>
      <p className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 font-bebas text-white">
        {title}
      </p>
    </div>
  );
};
