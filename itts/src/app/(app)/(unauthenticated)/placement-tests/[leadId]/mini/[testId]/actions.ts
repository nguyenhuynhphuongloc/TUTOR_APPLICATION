"use server";

import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export async function onSave({
  leadId,
  testId,
  answerSheet,
}: {
  leadId: string;
  testId: string;
  answerSheet: Record<string, any>;
}) {
  const payload = await getPayload({ config: configPromise });
  await payload.update({
    collection: "placement_attempts",
    where: {
      id: { equals: testId },
      user: { equals: leadId },
    },
    data: {
      answerSheet,
      status: "completed",
      completedAt: new Date().toISOString(),
    },
  });

  redirect(`/placement-tests/${leadId}/done`);
}
