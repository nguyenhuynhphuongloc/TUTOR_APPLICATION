import { z } from "zod";

export const RegisterSchema = z.object({
  fullName: z.string().min(1, {
    message: "Vui lòng nhập họ và tên",
  }),
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .min(1, {
      message: "Vui lòng nhập email",
    }),
  phoneNumber: z
    .string()
    .regex(/^(?:\+84|0)(3|5|7|8|9)[0-9]{8}$/, {
      message: "Số điện thoại không hợp lệ",
    })
    .min(1, {
      message: "Vui lòng nhập số điện thoại",
    }),
  target: z.string().min(1, {
    message: "Vui lòng chọn mục tiêu của bạn",
  }),
  branch: z.string().min(1, {
    message: "Vui lòng chọn chi nhánh",
  }),
  // captcha: z.string().min(1, {
  //   message: "Vui lòng xác thực",
  // }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
