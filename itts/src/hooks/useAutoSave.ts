"use client";

import { useStore } from "@/zustand/placement-test/provider";
import { useEffect, useRef } from "react";
import { saveTestBackup } from "../app/(app)/(unauthenticated)/placement-tests/[leadId]/full/[testId]/backup-actions";

const AUTO_SAVE_INTERVAL = 3 * 60 * 1000; // 3 phút = 180,000ms

interface UseAutoSaveProps {
  leadId: string;
  testId: string;
  enabled?: boolean;
}

export function useAutoSave({ leadId, testId, enabled = true }: UseAutoSaveProps) {
  const answerSheetFull = useStore((s) => s.answerSheetFull);
  const currentSkill = useStore((s) => s.navigation.currentSkill);
  const timeLeft = useStore((s) => s.navigation.timeLeft);
  
  const dataRef = useRef({ answerSheetFull, currentSkill, timeLeft });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref khi data thay đổi
  useEffect(() => {
    dataRef.current = { answerSheetFull, currentSkill, timeLeft };
  }, [answerSheetFull, currentSkill, timeLeft]);

  useEffect(() => {
    if (!enabled || !leadId || !testId) {
      return;
    }

    const doAutoSave = async () => {
      const { answerSheetFull: curAnswers, currentSkill: curSkill, timeLeft: curTime } = dataRef.current;
      
      try {
        console.log("[AUTO-SAVE] Triggering backup:", {
          testId,
          curSkill,
          curTime,
          timestamp: new Date().toISOString(),
        });

        const result = await saveTestBackup({
          leadId,
          testId,
          answerSheet: curAnswers,
          currentSkill: curSkill,
          timeLeft: curTime,
        });

        if (result.success) {
          console.log("[AUTO-SAVE] Backup saved successfully");
        } else {
          console.error("[AUTO-SAVE] Backup failed:", result.error);
        }
      } catch (error) {
        console.error("[AUTO-SAVE] Error during auto-save:", error);
      }
    };

    // Set interval để auto-save mỗi 3 phút
    intervalRef.current = setInterval(doAutoSave, AUTO_SAVE_INTERVAL);

    console.log("[AUTO-SAVE] Started auto-save interval (every 3 minutes)");

    // Cleanup khi unmount hoặc disable
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("[AUTO-SAVE] Stopped auto-save interval");
      }
    };
  }, [enabled, leadId, testId]); // Chỉ re-setup khi các params định danh thay đổi
}
