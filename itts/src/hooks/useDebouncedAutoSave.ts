import { useEffect, useRef } from "react";

export default function useDebouncedAutoSave({
  answerSheet,
  currentSkill,
  params,
  testSkills,
  delay = 3 * 60 * 1000,
}: {
  answerSheet: Record<string, any>;
  currentSkill: number;
  params: {
    leadId?: string;
    testId?: string;
    attemptId?: string;
  };
  testSkills?: string[];
  delay?: number;
}) {
  const lastSavedRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentSnapshot = JSON.stringify(answerSheet);

    // Nếu giống bản đã save → bỏ qua
    if (lastSavedRef.current === currentSnapshot) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await onSave({
        leadId: params.leadId,
        testId: params.leadId ? params.testId! : params.attemptId!,
        answerSheet,
        currentSkill,
        testSkills,
        isBackup: true,
      });

      lastSavedRef.current = currentSnapshot;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [answerSheet, currentSkill]);
}
