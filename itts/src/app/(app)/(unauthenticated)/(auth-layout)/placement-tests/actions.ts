"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";

import { type RegisterSchemaType } from "./schema";

type HCaptchaVerifyResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  credit?: boolean;
  "error-codes"?: string;
  score?: number;
  score_reason?: string[];
};

export async function register({
  branch,
  email,
  fullName,
  phoneNumber,
  target,
  // captcha,
}: RegisterSchemaType): Promise<{
  success: boolean;
  error_code?: "invalid_captcha" | "validation_error" | "internal_server_error";
  message?: string;
  data?: string;
}> {
  try {
    // const { data: verifyResult } = await betterFetch<HCaptchaVerifyResponse>(
    //   "https://api.hcaptcha.com/siteverify",
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     body: `response=${captcha}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
    //   },
    // );

    // if (!verifyResult?.success) {
    //   return {
    //     success: false,
    //     error_code: "invalid_captcha",
    //     message: "Captcha xác thực không thành công",
    //   };
    // }

    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "leads",
      limit: 1,
      where: {
        phone: {
          equals: phoneNumber,
        },
      },
    });

    if (docs[0]?.id) {
      return { success: true, data: docs[0].id, message: undefined };
    }

    // const systemSaleInCharge = await payload.find({
    //   collection: "admins",
    // });

    const { id } = await payload.create({
      collection: "leads",
      data: {
        branch,
        email,
        fullName,
        phone: phoneNumber,
        target: Number(target),
        source: "from_website",
        // saleInCharge: systemSaleInCharge.docs[0],
        status: "test_booked",
      },
    });

    return { success: true, data: id, message: undefined };
  } catch (error) {
    return {
      success: false,
      error_code: "internal_server_error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
