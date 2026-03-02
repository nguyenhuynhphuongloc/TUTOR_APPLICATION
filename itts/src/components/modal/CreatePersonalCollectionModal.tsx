import { useAuth } from "@/app/(app)/_providers/Auth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Word } from "@/containers/vocabulary/Columns";
import { PersonalVocab } from "@/payload-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Clipboard from "../icons/clipboard";
import { SearchInput } from "../search/SearchInput";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng điền tên",
    })
    .min(2, {
      message: "Tên phải có ít nhất 2 kí tự",
    }),
});

const CreatePersonalCollectionModal = ({
  children,
  onSubmit,
  collection,
}: {
  children: React.ReactNode;
  onSubmit: (data: PersonalVocab) => Promise<void>;
  collection?: PersonalVocab;
}) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const selectedWordIds = (selectedWords || []).map((w) => w?.id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (collection) {
      form.reset(collection);
      if (collection.words) {
        setSelectedWords(collection.words);
      }
    }
  }, [collection, form.reset]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const values: PersonalVocab = {
      ...data,
      user: user?.id,
      words: selectedWordIds,
    };
    await onSubmit(values);

    form.reset();
    setSelectedWords([]);
    setOpen(false);
  };

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
                <div className="w-11 h-11 border rounded-[10px] flex items-center justify-center">
                  <Clipboard stroke="#151515" />
                </div>
                <div>
                  <AlertDialogTitle className="font-bold">
                    {collection ? "Update" : "Create"} Vocabulary Collection
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Fill in the data below to add vocabulary to the collection
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
                  <FormControl>
                    <Input
                      placeholder="Nhập tên bộ sưu tập"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="words"
              render={() => (
                <FormItem>
                  <FormLabel className="inline-block font-semibold">
                    Từ vựng bạn muốn học
                  </FormLabel>
                  <FormControl>
                    <SearchInput
                      placeholder="Tìm từ vựng..."
                      searchFn={async (query) => {
                        const res = await fetch(`/api/words${query}`);
                        return await res.json();
                      }}
                      renderItem={(item: Word) => <div>{item.word}</div>}
                      setSelectedWords={setSelectedWords}
                      selectedWordIds={selectedWordIds}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="font-semibold text-[14px] mt-8 mb-2">
              {selectedWords.length} Vocabulary
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {selectedWords.map((word) => (
                <div
                  className="bg-[#FEF296] font-bold rounded-[6px] w-fit p-[6px] text-[#6A5E00]"
                  key={word.id}
                >
                  {word.word}
                </div>
              ))}
            </div>

            <AlertDialogFooter className="border-t pt-4 flex w-full justify-between">
              <AlertDialogCancel className="rounded-[12px] text-[16px] font-bold w-full h-12">
                Cancel
              </AlertDialogCancel>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                size="lg"
                className="bg-[#E72929] rounded-[12px] text-[16px] font-bold w-full "
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                {collection ? "Cập nhật bộ sưu tập" : "Thêm vào bộ sưu tập"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreatePersonalCollectionModal;
