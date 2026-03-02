"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

import { useAuth } from "@/app/(app)/_providers/Auth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
});

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { setUser } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      try {
        const result: any = await loginAction(data);
        if (result?.error) {
          form.setError("root", {
            message: "That username or password is incorrect.",
          });
          return;
        }
        setUser(result.user);
        startTransition(() => router.replace("/student"));
      } catch (error) {
        console.error("error:", error);
      }
    },
    [form],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-1 flex-col gap-10", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-12 text-center">
          <Image src="/logo.png" alt="logo" width={118} height={61} />
          <div className="flex flex-col gap-4">
            <h1 className="text-[36px] font-bold text-[#151515]">
              Welcome Back 👋
            </h1>
            <p className="text-balance text-[20px] text-[#6d737a]">
              Today is a new day. It&apos;s your day. You shape it. Sign in to
              start learning now.
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px]">Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại"
                      className="h-12 rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="text-[16px]">Mật khẩu</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-[16px] text-sm text-[#A8ABB2] underline-offset-4 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      className="h-12 rounded-[12px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          </div>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="h-[52px] w-full rounded-[12px] text-[20px] font-semibold"
          >
            {form.formState.isSubmitting || isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Đăng nhập
          </Button>
        </div>
        <p className="text-center text-[16px] text-[#A8ABB2]">
          &#169; 2025 ALL RIGHTS RESERVED
        </p>
      </form>
    </Form>
  );
}
