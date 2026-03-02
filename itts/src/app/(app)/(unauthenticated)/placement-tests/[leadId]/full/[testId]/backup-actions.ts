"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { onSave } from "./actions";
import { isAnswerSheetEmpty } from "@/lib/utils";

export async function saveTestBackup({
  leadId,
  testId,
  answerSheet,
  currentSkill,
  timeLeft,
}: {
  leadId: string;
  testId: string;
  answerSheet: Record<string, any>;
  currentSkill: number;
  timeLeft: number;
}) {
  try {
    const payload = await getPayload({ config: configPromise });

    if (isAnswerSheetEmpty(answerSheet)) {
      console.warn("[BACKUP] Skipping backup: answerSheet is empty.");
      return { success: false, error: "Empty answerSheet" };
    }

    // 1. Backup vào PlacementAttempts (overwrite)
    await onSave({
      leadId,
      testId,
      answerSheet,
      currentSkill,
      timeLeft,
      isBackup: true,
    });

    // 2. Lấy statusDetails từ PlacementAttempts
    const { statusDetails } = await payload.findByID({
      collection: "placement_attempts",
      id: testId,
      select: {
        statusDetails: true,
      },
    });

    // 3. Tạo backup record mới vào TestBackups
    await payload.create({
      collection: "test_backups",
      data: {
        placementAttempt: testId,
        answerSheet,
        statusDetails,
        type: "placement",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[BACKUP] Error saving backup:", error);
    return { success: false, error: String(error) };
  }
}
