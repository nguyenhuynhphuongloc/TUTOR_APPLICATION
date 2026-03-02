import { useAuth } from "@/app/(app)/_providers/Auth";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SKILLS_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format, startOfDay } from "date-fns";
import { CalendarIcon, CalendarPlus } from "lucide-react";
import { stringify } from "qs-esm";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { AsyncSelect } from "../select/AsyncSelect";

const formSchema = z.object({
  mode: z.string(),
  skill: z.string(),
  alternative_skill: z.string().optional(),
  class: z.string(),
  teacher: z.string(),
  date_time: z.date(),
});
const CreateBookingModal = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "",
    },
  });

  const { setValue, getValues, control, handleSubmit } = form;
  const dateTime = useWatch({ control, name: "date_time" });
  const skill = useWatch({ control, name: "skill" });

  const query = stringify(
    {
      where: {
        role: { equals: "wow" },
        "availability.start_date": { less_than_equal: dateTime?.toISOString() },
        "availability.end_date": {
          greater_than_equal: dateTime?.toISOString(),
        },
      },
    },
    { addQueryPrefix: true },
  );
  function createBooking(payload: any) {
    return fetch("/api/booking_schedule", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      createBooking({ ...values, status: "pending", student: user?.id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["booking_schedule"] });
      setOpen(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      setValue("date_time", date);
    }
  }

  function handleTimeChange(type: "hour" | "minute", value: string) {
    const currentDate = getValues("date_time") || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    setValue("date_time", newDate);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2">Create Booking</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mb-4 inline-flex w-full items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-[0.625rem] bg-[#E729291A] text-[#E72929]`}
            >
              <CalendarPlus width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-lg font-bold">
                Create Booking
              </DialogTitle>

              <DialogDescription>
                Fill in the data below to add a booking
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex gap-2">
              <FormField
                control={control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel>Hình thức</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-[12px]">
                          <SelectValue placeholder="Hình thức" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          {
                            id: "practice",
                            name: "Practice",
                          },
                          {
                            id: "exam",
                            name: "Exam",
                          },
                        ].map((form) => (
                          <SelectItem key={form.id} value={form.id}>
                            {form.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="skill"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel className="inline-block"></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-[12px]">
                          <SelectValue placeholder="Kỹ năng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          ...SKILLS_OPTIONS,
                          { label: "Khác", value: "other" },
                        ].map((skill) => (
                          <SelectItem key={skill.value} value={skill.value}>
                            {skill.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {skill === "other" && (
              <FormField
                control={control}
                name="alternative_skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kỹ năng khác</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập kỹ năng khác..."
                        className="rounded-[12px] h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2">
              <FormField
                control={control}
                name="class"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Thông tin lớp</FormLabel>
                    <AsyncSelect
                      {...field}
                      apiUrl={`/api/classes?where[students.id][contains]=${user?.id}`}
                      placeholder="Chọn lớp"
                      labelKey="name"
                      valueKey="id"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="date_time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Thời gian book</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy HH:mm")
                          ) : (
                            <span>Chọn thời gian book</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="sm:flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={{
                            before: startOfDay(addDays(new Date(), 3)),
                          }}
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 13 }, (_, i) => i + 9).map(
                                (hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getHours() === hour
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("hour", hour.toString())
                                    }
                                  >
                                    {hour}
                                  </Button>
                                ),
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {[0, 30].map((minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    field.value.getMinutes() === minute
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange(
                                      "minute",
                                      minute.toString(),
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              ))}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="inline-block">WOW phụ trách</FormLabel>
                  <AsyncSelect
                    {...field}
                    apiUrl={`/api/admins${query}`}
                    placeholder="Wow incharge"
                    labelKey="fullName"
                    valueKey="id"
                    disabled={!dateTime}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="w-full items-center justify-center">
              <Button
                className="w-full"
                variant={"outline"}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button className="w-full" type="submit">
                {mutation.isPending ? "Booking..." : "Booking now"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingModal;
