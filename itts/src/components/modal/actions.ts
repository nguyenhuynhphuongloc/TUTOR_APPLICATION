"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";

export async function updateLeadProfile({
  leadId,
  data,
}: {
  leadId: string;
  data: {
    fullName?: string;
    type?: string;
    phone?: string;
    email?: string;
    link_facebook?: string;
    date_of_birth?: string | Date;
  };
}) {
  try {
    const payload = await getPayload({ config: configPromise });

    const updatedLead = await payload.update({
      collection: "leads",
      id: leadId,
      data: {
        ...data,
      } as any,
    });

    return { success: true, data: updatedLead as any };
  } catch (error: any) {
    console.error("Error updating lead profile:", error);
    return {
      success: false,
      message: error.message || "Đã có lỗi xảy ra khi cập nhật thông tin.",
    };
  }
}
