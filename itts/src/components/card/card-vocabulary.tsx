/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useAuth } from "@/app/(app)/_providers/Auth";
import { Word } from "@/containers/vocabulary/Columns";
import type { PersonalVocab, VocabProgress, Vocabulary } from "@/payload-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Edit, TrashIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { stringify } from "qs-esm";
import { type FC } from "react";
import ConfirmModal from "../modal/ConfirmModal";
import CreatePersonalCollectionModal from "../modal/CreatePersonalCollectionModal";
import { successToast } from "../toast/toast";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface CardVocabularyProps {
  data: Vocabulary | PersonalVocab; // Replace 'any' with a more specific type if possible
}

/**
 * CardVocabulary component renders a vocabulary card with click functionality.
 *
 * @param {CardVocabularyProps} props The properties for the component.
 * @param {(event: MouseEvent<HTMLDivElement>) => void} props.onClick Function to be called when card is clicked.
 * @param {any} props.data The data associated with the vocabulary card.
 *
 * @returns {JSX.Element} The rendered vocabulary card component.
 */
const CardVocabulary: FC<CardVocabularyProps> = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isCollection = pathname.includes("collection");

  const { level, name, thumbnail, id } = data;
  const stringifiedQuery = stringify(
    { where: { user: { in: user?.id }, limit: 0 }, select: { word: true } },
    { addQueryPrefix: true },
  );
  const {
    data: wordLearnt,
    isLoading,
    error,
  } = useQuery<VocabProgress[]>({
    queryKey: ["vocab_progress"],
    queryFn: () =>
      fetch(`/api/vocab-progress${stringifiedQuery}`).then((res) => res.json()),
    enabled: !!user?.id,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  const deleteMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      const res = await fetch(`/api/personal-vocab/${collectionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete collection");
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["custom_collection", user?.id],
      });
      successToast("Collection deleted successfully");
    },
  });

  const editCollection = useMutation({
    mutationFn: async (collection: PersonalVocab) => {
      const res = await fetch(`/api/personal-vocab/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collection),
      });
      if (!res.ok) throw new Error("Failed to update collection");
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["custom_collection", user?.id],
      });
      successToast("Collection updated successfully");
    },
  });

  if (isLoading) {
    return (
      <div className="h-[212px] w-full overflow-hidden rounded-2xl bg-white shadow-xl relative p-4">
        <Skeleton className="relative z-1 h-[126px] w-full rounded-lg overflow-hidden" />

        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    );
  }

  const wordProgressIds: string[] =
    wordLearnt.docs.length === 0
      ? []
      : wordLearnt?.docs[0].word.map((w: Word) => w.id);

  const wordIds: string[] = data.words.map((word) => word.id);

  const progress = wordProgressIds?.filter((wordId: string) =>
    wordIds.includes(wordId),
  );

  const percentage = (progress?.length / data.words.length) * 100;

  const handleClick = () => {
    router.push(`${pathname}/${data.id}`);
  };

  return (
    <div
      className="h-[212px] w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg relative"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative z-1 h-[126px] w-full overflow-hidden">
        <Image
          src={thumbnail?.url || "/card-vocab-bg.png"}
          alt={thumbnail?.alt || `${data.id} Course Thumbnail`}
          className="w-full h-full object-cover"
          width={251}
          height={126}
        />

        {/* Badge */}
        <div className="absolute right-[5px] top-[5px] flex gap-2">
          {level && (
            <div className=" flex h-10 w-10 items-center rounded-full bg-[#FFD2D8] px-3 py-1 text-sm font-bold text-[#E72929]">
              {level}
            </div>
          )}
          {isCollection && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <ConfirmModal
                onSubmit={() => deleteMutation.mutateAsync(id)}
                isPending={deleteMutation.isPending}
              >
                <Button className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#FFD2D8] px-3 py-1 text-sm font-bold text-white">
                  <TrashIcon color="#E72929" width={20} height={20} />
                </Button>
              </ConfirmModal>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <CreatePersonalCollectionModal
                  onSubmit={(collection) =>
                    editCollection.mutateAsync(collection)
                  }
                  collection={data}
                >
                  <Button className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#FFD2D8] px-3 py-1 text-sm font-bold text-white">
                    <Edit color="#E72929" width={20} height={20} />
                  </Button>
                </CreatePersonalCollectionModal>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-4 z-2">
        <h2 className="text-xl font-semibold text-gray-900">{name}</h2>

        {/* Progress Bar */}
        <div className="mt-3 flex items-center justify-center gap-[12px]">
          <div className="relative h-[6px] w-full rounded-full bg-[#E729291A]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-red-500"
              style={{ width: `${isNaN(percentage) ? 0 : percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600">
            {progress?.length === 0 ? 0 : progress?.length}/{data.words.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardVocabulary;
