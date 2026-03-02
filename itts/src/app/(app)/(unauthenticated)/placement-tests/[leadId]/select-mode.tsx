"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createPlacementAttempt } from "./actions";
import {
  PlacementSelectSchema,
  type PlacementSelectSchemaType,
} from "./schema";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-[#E7EAE9] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export default function SelectMode({ leadId }: { leadId: string }) {
  const router = useRouter();
  const form = useForm<PlacementSelectSchemaType>({
    resolver: zodResolver(PlacementSelectSchema),
    defaultValues: {
      type: "mini",
    },
  });

  const [isSubmitting, startTransition] = React.useTransition();
  const onSubmit = async ({ type }: PlacementSelectSchemaType) => {
    startTransition(async () => {
      const { success, message, data } = await createPlacementAttempt({
        type,
        leadId,
      });

      if (success) {
        router.replace(`/placement-tests/${leadId}/${type}/${data!.id}`);
      } else {
        form.setError("root", { message });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <div className="mx-auto mb-10 flex max-w-[920px]">
              <FormItem className="space-y-none w-full">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="gap-6"
                  >
                    <Accordion
                      type="multiple"
                      defaultValue={["mini", "full"]}
                      className="flex flex-col gap-6"
                    >
                      <AccordionItem value="mini">
                        <AccordionHeader
                          className={cn(
                            "flex flex-1 items-center justify-between rounded-[20px] p-[18px]",
                            "data-[state=open]:border-b data-[state=open]:border-[#E7EAE9]",
                            "text-left text-sm font-medium transition-all",
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem
                                  className="h-9 w-9 shadow-none [&>span>svg]:h-7 [&>span>svg]:w-7 [&[data-state=unchecked]]:border-[#E7EAE9]"
                                  value="mini"
                                />
                              </FormControl>
                            </FormItem>
                            <div>
                              <h3 className="mb-1 text-[20px] font-bold text-[#151515]">
                                IELTS Placement Mini Test
                              </h3>
                              <p className="text-[12px] font-medium leading-[18px] text-[#6D737A]">
                                Dành cho những bạn có nền tảng cơ bản trở xuống,
                                chưa làm quen với IELTS
                              </p>
                            </div>
                          </div>
                          <AccordionTrigger />
                        </AccordionHeader>
                        <AccordionContent>
                          <div className="flex gap-4">
                            <div className="flex flex-1 flex-col gap-6">
                              <div>
                                <p className="mb-3 text-[14px] font-bold text-[#6D737A]">
                                  1. Bài thi rút gọn được chia làm 4 phần với
                                  tổng cộng 20 câu hỏi:
                                </p>
                                <ul className="ml-6 list-disc text-[14px] font-medium leading-[30px] text-[#6D737A]">
                                  <li>Phần 1 - Grammar: 10 câu</li>
                                  <li>Phần 2 - Vocab: 10 câu</li>
                                  <li>Phần 3 - Reading: 5 câu</li>
                                  <li>Phần 4 - Writing: 5 câu</li>
                                </ul>
                              </div>
                              <div>
                                <p className="mb-3 text-[14px] font-bold text-[#6D737A]">
                                  2. Thời gian làm bài:
                                </p>
                                <p className="text-[14px] font-medium leading-6 text-[#6D737A]">
                                  Bạn sẽ cần dành ra{" "}
                                  <span className="font-bold text-[#E72929]">
                                    30 PHÚT
                                  </span>{" "}
                                  để hoàn thành toàn bộ bài thi. Sẽ không có
                                  thời gian nghỉ giữa các phần.
                                </p>
                              </div>
                            </div>
                            <div className="w-[370px]">
                              <Image
                                src="/placement-illu-1.svg"
                                alt="placement-illu"
                                width={370}
                                height={248}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="full">
                        <AccordionHeader
                          className={cn(
                            "flex flex-1 items-center justify-between rounded-[20px] p-[18px]",
                            "data-[state=open]:border-b data-[state=open]:border-[#E7EAE9]",
                            "text-left text-sm font-medium transition-all",
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem
                                  className="h-9 w-9 shadow-none [&>span>svg]:h-7 [&>span>svg]:w-7 [&[data-state=unchecked]]:border-[#E7EAE9]"
                                  value="full"
                                />
                              </FormControl>
                            </FormItem>
                            <div>
                              <h3 className="mb-1 text-[20px] font-bold text-[#151515]">
                                IELTS Placement Test (Full)
                              </h3>
                              <p className="text-[12px] font-medium leading-[18px] text-[#6D737A]">
                                Dành cho những bạn có nền tảng cơ bản trở lên,
                                đã làm quen với IELTS
                              </p>
                            </div>
                          </div>
                          <AccordionTrigger />
                        </AccordionHeader>
                        <AccordionContent>
                          <div className="flex gap-4">
                            <div className="flex flex-1 flex-col gap-6">
                              <div>
                                <p className="mb-3 text-[14px] font-bold text-[#6D737A]">
                                  1. Bài thi được chia làm 4 kỹ năng:
                                </p>
                                <ul className="ml-6 list-disc text-[14px] font-medium leading-[30px] text-[#6D737A]">
                                  <li>Listening: 40 câu</li>
                                  <li>Reading: 40 câu</li>
                                  <li>Writing: 2 phần</li>
                                  <li>Speaking: 3 phần</li>
                                </ul>
                              </div>
                              <div>
                                <p className="mb-3 text-[14px] font-bold text-[#6D737A]">
                                  2. Thời gian làm bài:
                                </p>
                                <p className="text-[14px] font-medium leading-6 text-[#6D737A]">
                                  Bạn sẽ cần dành ra{" "}
                                  <span className="font-bold text-[#E72929]">
                                    180 PHÚT
                                  </span>{" "}
                                  để hoàn thành toàn bộ bài thi. Sẽ không có
                                  thời gian nghỉ giữa các phần.
                                </p>
                              </div>
                            </div>
                            <div className="w-[370px]">
                              <Image
                                src="/placement-illu-2.svg"
                                alt="placement-illu"
                                width={370}
                                height={248}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="sat">
                        <AccordionHeader
                          className={cn(
                            "flex flex-1 items-center justify-between rounded-[20px] p-[18px]",
                            "data-[state=open]:border-b data-[state=open]:border-[#E7EAE9]",
                            "text-left text-sm font-medium transition-all",
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem
                                  disabled
                                  className="h-9 w-9 shadow-none [&>span>svg]:h-7 [&>span>svg]:w-7 [&[data-state=unchecked]]:border-[#E7EAE9]"
                                  value="sat"
                                />
                              </FormControl>
                            </FormItem>
                            <div>
                              <h3 className="mb-1 text-[20px] font-bold text-[#151515]">
                                SAT Placement Test
                              </h3>
                              <p className="text-[12px] font-medium leading-[18px] text-[#6D737A]">
                                Tính năng sẽ được ra mắt trong thời gian tới
                              </p>
                            </div>
                          </div>
                          <AccordionTrigger disabled />
                        </AccordionHeader>
                        <AccordionContent></AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {form.formState.errors.root && (
                      <FormMessage className="text-center">
                        {form.formState.errors.root.message}
                      </FormMessage>
                    )}
                    <div className="flex justify-center">
                      <Button
                        disabled={!form.formState.isValid || isSubmitting}
                        type="submit"
                        className="h-[40px] w-[192px] rounded-[12px] bg-[#E72929] px-6 py-4 font-semibold"
                      >
                        {isSubmitting && <Loader2 className="animate-spin" />}
                        Bắt đầu làm bài{" "}
                        <Image
                          src="/icons/send.svg"
                          alt="send"
                          width={16}
                          height={16}
                        />
                      </Button>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            </div>
          )}
        />
      </form>
    </Form>
  );
}
