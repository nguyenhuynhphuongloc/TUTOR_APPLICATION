"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BlurFade } from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { register } from "./actions";
import { type RegisterSchemaType, RegisterSchema } from "./schema";

export default function RegisterForm({
  className,
  branchs,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & {
  branchs: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  // const captchaRef = useRef<HCaptcha>(null);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      target: "5.0",
      branch: "ddbc4a83-b725-4cf1-93f4-1588aba5390f",
      // captcha: "",
    },
  });

  // const onVerify = useCallback(
  //   (token: string) => {
  //     form.setValue("captcha", token);
  //   },
  //   [form],
  // );

  const [isSubmitting, startTransition] = useTransition();

  const onSubmit = useCallback(
    async (data: RegisterSchemaType) => {
      startTransition(async () => {
        const {
          success,
          error_code,
          message,
          data: uid,
        } = await register(data);
        // captchaRef.current?.resetCaptcha();
        if (!success) {
          // if (error_code === "invalid_captcha") {
          //   form.setError("captcha", { message });
          // } else if (error_code === "validation_error") {
          //   form.setError("root", { message });
          // } else {
          //   form.setError("root", { message: "Internal Server Error" });
          // }
          if (error_code === "validation_error") {
            form.setError("root", { message });
          } else {
            form.setError("root", { message: "Internal Server Error" });
          }
        }
        if (success) {
          router.push(`/placement-tests/${uid}`);
        }
      });
    },
    [form, router],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-1 flex-col gap-10", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="logo" width={240} height={61} />
          <div className="flex flex-col gap-4 h-[130px]">
            <BlurFade delay={0.15} inView>
              <h1 className="text-[36px] font-bold text-[#151515]">
                Welcome 👋
              </h1>
            </BlurFade>
            <BlurFade delay={0.15 * 2} inView>
              <p className="text-balance text-[20px] text-[#6d737a]">
                Bạn vui lòng điền thông tin để nhận kết quả nhanh chóng và chính
                xác nhé!
              </p>
            </BlurFade>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px]">Họ và Tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Họ và tên"
                      className="h-12 rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-3">
            <div className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px]">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="you@example.com"
                        className="h-12 rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px]">Số Điện Thoại</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="xxxx-xxx-xxx"
                        className="h-12 rounded-[12px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px]">Target</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger className="h-[52px] w-full rounded-[12px] placeholder:text-[#A8ABB2]">
                        <SelectValue placeholder="Mục tiêu của bạn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 7 }, (_, i) =>
                        (i * 0.5 + 5).toFixed(1),
                      ).map((score) =>
                        score >= 5 ? (
                          <SelectItem key={score} value={score}>
                            {score}
                          </SelectItem>
                        ) : null,
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px]">
                    Chi Nhánh Đến Test
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-[52px] w-full rounded-[12px]">
                        <SelectValue placeholder="Mục tiêu của bạn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branchs.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          {/* <div className="grid justify-center gap-2 h-[78px]">
            <HCaptcha
              ref={captchaRef}
              sitekey={
                process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ??
                "10000000-ffff-ffff-ffff-000000000001"
              }
              onVerify={onVerify}
            />
            <FormMessage>{form.formState.errors.captcha?.message}</FormMessage>
          </div> */}
          <Button
            disabled={isSubmitting}
            type="submit"
            className="h-[52px] w-full rounded-[12px] bg-[#E72929] text-[20px] font-semibold"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Làm Bài Ngay
          </Button>
        </div>
      </form>
    </Form>
  );
}
