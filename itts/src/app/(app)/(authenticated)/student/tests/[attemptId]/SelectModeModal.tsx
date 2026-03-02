import { Clipboard } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/app/(app)/_providers/Auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createPeriodicAttempt } from "./actions";

type Skill = "speaking" | "reading" | "listening" | "writing";
interface SkillConfig {
  label: string;
  count: number;
  times: number[];
}

const DEFAULT_TIMES = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

const SKILL_PARTS: Record<Skill, SkillConfig> = {
  speaking: {
    label: "Part",
    count: 3,
    times: [18, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  },
  reading: { label: "Passage", count: 3, times: DEFAULT_TIMES },
  listening: { label: "Part", count: 3, times: DEFAULT_TIMES },
  writing: {
    label: "Part",
    count: 2,
    times: DEFAULT_TIMES,
  },
};

interface SelectModeProps {
  skills?: Skill[];
  testId: string;
}
const schema = z.object({
  fullPart: z.boolean().optional(),
  parts: z.array(z.string()).min(1, "Bạn phải chọn ít nhất 1 phần"),
  time: z.coerce.number(),
});

type FormValues = z.infer<typeof schema>;

export default function SelectMode({
  skills,
  children,
  testId,
}: SelectModeProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const skill = skills?.[0] as Skill;
  const config = SKILL_PARTS[skill] || SKILL_PARTS.reading;
  const parts = Array.from(
    { length: config.count },
    (_, i) => `${config.label} ${i + 1}`,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullPart: false,
      parts: [],
      time: config.times[0],
    },
  });
  const watchParts = form.watch("parts");
  const allChecked = watchParts.length === parts.length;

  useEffect(() => {
    form.setValue("fullPart", allChecked, { shouldValidate: false });
  }, [allChecked, form]);

  const onToggleFull = (checked: boolean) => {
    form.setValue("fullPart", checked);

    if (checked) {
      form.setValue("parts", parts);
    } else {
      form.setValue("parts", []);
    }
  };

  const handleSubmit = (data: FormValues) => {
    const { parts, time } = data;
    const part = parts.join(",");

    startTransition(async () => {
      const { success, data: attemptData } = await createPeriodicAttempt({
        type: "bank",
        mode: "practice",
        time,
        part,
        userId: user!.id,
        testId,
      });

      if (success) {
        router.replace(`/student/tests/${attemptData!.id}`);
      } else {
        return;
      }
    });
  };

  const handleStartSimulationTest = () => {
    startTransition(async () => {
      const { success, data: attemptData } = await createPeriodicAttempt({
        type: "bank",
        mode: "simulation",
        userId: user!.id,
        testId,
      });

      if (success) {
        router.replace(`/student/tests/${attemptData!.id}`);
      } else {
        return;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[1140px] h-fit max-h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="text-[#151515] w-11 h-11 border rounded-[10px] flex items-center justify-center flex-shrink-0">
              <Clipboard stroke="#151515" />
            </div>
            <div>
              <DialogTitle className="font-bold">
                Start Your Practice Task
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to begin practicing with this exercise
                from the question bank.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 overflow-y-auto p-6 pt-2 flex-1 min-h-0"
          >
            <div className="mt-3 w-full">
              <div className="relative mx-auto max-w-[1440px]">
                <div className="flex flex-col gap-2">
                  <h3 className="text-center text-[24px] font-bold text-[#E72929]">
                    {skill?.toUpperCase()}
                  </h3>
                  <h3 className="text-center text-[24px] font-bold text-[#202020]">
                    Choose a mode
                  </h3>
                  <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 pb-4">
                    {skills.length === 1 && (
                      <div className="w-full lg:w-[369px] min-h-[570px] border border-[#FBA631]/50 rounded-[24px] p-6 bg-[rgba(251,166,49,0.02)] relative flex flex-col">
                        <div className="flex flex-col gap-2 items-center mb-6">
                          <Image
                            src="/undraw-learning.svg"
                            alt="learning"
                            width={125}
                            height={100}
                            className="text-center"
                          />
                          <p className="font-bold text-[24px]">Practice mode</p>
                          <p className="text-[12px] text-[#6D737A] text-center">
                            Practice mode is suitable for improving accuracy and
                            time spent on each part.
                          </p>
                        </div>
                        <div>
                          <p className="text-[#6D737A] font-bold text-[14px]">
                            1. Choose part/task(s) you want to practice:
                          </p>
                          <div className="flex flex-col gap-4 mt-4 text-[14px] text-[#6D737A]">
                            {/* FULL */}
                            <FormField
                              control={form.control}
                              name="fullPart"
                              render={() => (
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <Checkbox
                                      color="warning"
                                      checked={form.getValues("fullPart")}
                                      onCheckedChange={(v) => onToggleFull(!!v)}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-semibold">
                                    Full Part
                                  </FormLabel>
                                </FormItem>
                              )}
                            />

                            {/* Dynamic Parts */}
                            <div className="space-y-3 rounded-md">
                              {parts.map((p) => (
                                <FormField
                                  key={p}
                                  control={form.control}
                                  name="parts"
                                  render={({ field }) => {
                                    const checked = field.value.includes(p);

                                    return (
                                      <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                          <Checkbox
                                            color="warning"
                                            checked={checked}
                                            onCheckedChange={(v) => {
                                              if (v) {
                                                field.onChange([
                                                  ...field.value,
                                                  p,
                                                ]);
                                              } else {
                                                field.onChange(
                                                  field.value.filter(
                                                    (i) => i !== p,
                                                  ),
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel>{p}</FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <FormMessage />

                          <p className="text-[#6D737A] font-bold text-[14px] mt-6 mb-4">
                            2. Choose a time limit:
                          </p>
                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={String(field.value)}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn thời gian" />
                                    </SelectTrigger>
                                  </FormControl>

                                  <SelectContent>
                                    {config.times.map((t) => (
                                      <SelectItem key={t} value={String(t)}>
                                        {t} mins
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-center justify-center mt-auto pt-8">
                            <Button
                              variant="warning"
                              className="w-full sm:w-auto"
                              size="md"
                              type="submit"
                              disabled={isPending}
                            >
                              {isPending ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <>
                                  Start now <MoveRightIcon />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="w-full lg:w-[369px] min-h-[570px] border border-[#FD4444]/50 rounded-[24px] p-6 bg-[rgba(253,68,68,0.02)] relative flex flex-col">
                      <div className="flex flex-col gap-2 items-center mb-6">
                        <Image
                          src="/placement-illu-2.svg"
                          alt="placement-illu"
                          width={125}
                          height={100}
                          className="text-center"
                        />
                        <p className="font-bold text-[24px]">
                          Simulation test mode
                        </p>
                        <p className="text-[12px] text-[#6D737A] text-center">
                          Simulation test mode is the best option to experience
                          the real IELTS on computer.
                        </p>
                      </div>
                      <div>
                        <p className="text-[#6D737A] font-bold text-[14px]">
                          Test infomation
                        </p>
                        <div className="flex flex-col gap-4 mt-4 text-[14px] text-[#6D737A]">
                          <div className="flex items-center gap-3">
                            Full Test (2 tasks - 60 minutes)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mt-auto pt-8">
                        <Button
                          className="w-full sm:w-auto"
                          size="md"
                          onClick={handleStartSimulationTest}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              Start now <MoveRightIcon />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
