/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { isAnswerSheetEmpty } from "@/lib/utils";
import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export async function onSave({
  leadId,
  testId, // attemptId
  answerSheet,
  currentSkill,
  testSkills,
  timeLeft,
  isBackup = false,
}: {
  leadId?: string;
  testId: string;
  answerSheet: Record<string, any>;
  currentSkill: number;
  testSkills?: { type: string; data: any }[] | string[];
  timeLeft?: number;
  isBackup?: boolean;
}) {
  const skill = leadId
    ? ["listening", "reading", "writing", "speaking"][currentSkill]
    : (testSkills![currentSkill] as any).type;
  const testCount = leadId ? 4 : testSkills!.length;

  if (!skill) {
    throw new Error("Invalid skill");
  }

  const completedAt = new Date().toISOString();
  const payload = await getPayload({ config: configPromise });

  const { statusDetails } = await payload.findByID({
    collection: !leadId ? "periodic_test_attempts" : "placement_attempts",
    id: testId,
    select: {
      statusDetails: true,
    },
  });

  if (!statusDetails) {
    throw new Error("Status details not found");
  }

  const isLastSkill = leadId
    ? currentSkill === 3
    : currentSkill + 1 === testCount;

  console.log(
    "[DEBUG-SAVE] currentSkill:",
    currentSkill,
    "skill:",
    skill,
    "timeLeft:",
    timeLeft,
  );
  console.log("[DEBUG-SAVE] Existing statusDetails:", statusDetails);

  const incomingIsEmpty = isAnswerSheetEmpty(answerSheet);

  if (isBackup && incomingIsEmpty) {
    console.warn(
      "[SAVE] Skipping auto-backup: answerSheet is empty to prevent overwriting valid data.",
    );
    return { success: false, error: "Empty answerSheet" };
  }

  const data: any = {
    status: (isBackup
      ? "in_progress"
      : isLastSkill
        ? "completed"
        : "in_progress") as "in_progress" | "completed" | "pending",
    completedAt: !isBackup && isLastSkill ? completedAt : null,
    statusDetails: {
      currentSkill: isBackup ? currentSkill : currentSkill + 1,
      completionTimes: isBackup
        ? (statusDetails as any).completionTimes
        : {
            ...(statusDetails as any).completionTimes,
            [skill]: completedAt,
          },
      timeLeft: {
        ...((statusDetails as any).timeLeft || {}),
        ...(timeLeft !== undefined && { [skill]: timeLeft }),
      },
    },
  };

  // Chỉ cập nhật answerSheet nếu nó không rỗng
  if (!incomingIsEmpty) {
    data.answerSheet = answerSheet;
  } else {
    console.log("[SAVE] answerSheet is empty, preserving existing data in DB.");
  }

  console.log(
    "[DEBUG-SAVE] Final data to update:",
    JSON.stringify(data.statusDetails, null, 2),
  );

  if (!leadId) {
    await payload.update({
      collection: "periodic_test_attempts",
      where: {
        id: { equals: testId },
      },
      data,
    });
  } else {
    await payload.update({
      collection: "placement_attempts",
      where: {
        id: { equals: testId },
        user: { equals: leadId },
      },
      data,
    });
  }

  if (!isBackup && isLastSkill) {
    if (!leadId) {
      return redirect(`/test-result?attemptId=${testId}`);
    }
    redirect(`/placement-tests/${leadId}/done`);
  }
}
