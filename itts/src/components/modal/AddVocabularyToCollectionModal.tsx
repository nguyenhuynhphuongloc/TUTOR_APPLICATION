/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useAuth } from "@/app/(app)/_providers/Auth";
import Clipboard from "@/components/icons/clipboard";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Word } from "@/containers/vocabulary/Columns";
import type { PersonalVocab } from "@/payload-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { stringify } from "qs-esm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { successToast } from "../toast/toast";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng điền tên",
    })
    .min(2, {
      message: "Tên phải có ít nhất 2 kí tự",
    }),
});

const AddVocabularyToCollectionModal = ({
  children,
  words,
}: {
  children: React.ReactNode;
  words: Word[];
}) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const stringifiedQuery = stringify(
    { where: { user: { equals: user?.id } }, limit: 0 },
    { addQueryPrefix: true },
  );
  const {
    data: collections,
    isLoading,
    error,
  } = useQuery<PersonalVocab[]>({
    queryKey: ["custom_collection"],
    queryFn: () =>
      fetch(`/api/personal-vocab${stringifiedQuery}`).then((res) => res.json()),
    enabled: !!user?.id,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const fetchCollectionById = async (id: string) => {
    try {
      const req = await fetch(`/api/personal-vocab/${id}`);
      const data = (await req.json()) as PersonalVocab;
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };
  const handleSubmit = async ({ name }: z.infer<typeof formSchema>) => {
    const wordIds = words.map((w) => w.id);

    const selectedCollection = await fetchCollectionById(name);
    if (selectedCollection) {
      try {
        const response = await fetch(`/api/personal-vocab/${name}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            words: Array.from(
              new Set([...selectedCollection.words, ...wordIds]),
            ),
          }),
        });
        const data = await response.json();
        if (data.message) {
          successToast(data.message);
        }
      } catch (error) {
        throw new Error("Failed to fetch vocabulary topics:");
      }
    }

    setOpen(false);
  };
  if (isLoading) return <p>Loading...</p>;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-[500px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <AlertDialogHeader className="border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="text-[#151515] w-11 h-11 border rounded-[10px] flex items-center justify-center">
                  <Clipboard stroke="#151515" />
                </div>
                <div>
                  <AlertDialogTitle className="font-bold">
                    Add to your vocabulary collection
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Add data below to add vocabulary to the collection
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="inline-block font-semibold">
                    Tên bộ sưu tập
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger className="h-[52px] w-full rounded-[12px] placeholder:text-[#A8ABB2]">
                        <SelectValue placeholder="Chọn bộ sưu tập cá nhân" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Topic</SelectLabel>
                        {collections?.docs.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="font-semibold text-[14px] mt-8 mb-2">
              {words.length} Vocabulary
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {words.map((word) => (
                <div
                  className="bg-[#FEF296] font-bold rounded-[6px] w-fit p-[6px] text-[#6A5E00]"
                  key={word.id}
                >
                  {word.word}
                </div>
              ))}
            </div>

            <AlertDialogFooter className="border-t pt-4 flex w-full justify-between">
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                size="lg"
                className="bg-[#E72929] rounded-[12px] text-[16px] font-bold w-full "
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                Add to vocabulary
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddVocabularyToCollectionModal;
