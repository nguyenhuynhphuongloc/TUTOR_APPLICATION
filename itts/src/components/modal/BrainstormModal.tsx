"use client";

import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lazy, useState, type JSX, type ReactNode } from "react";

const Editor = lazy(() => import("@/components/editor"));

interface BrainstormModalProps {
  children: ReactNode;
  brainstorm: any;
}

/**
 * Modal hiển thị Brainstorm (gợi ý) cho user khi làm bài practice
 * Chỉ hiển thị khi mode === "practice" và có dữ liệu brainstorm
 */
const BrainstormModal = ({
  children,
  brainstorm,
}: BrainstormModalProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  if (!brainstorm) {
    return <>{children}</>;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="font-sans max-w-3xl max-h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-[24px] font-bold">
            Brainstorm
          </AlertDialogTitle>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Editor
            value={brainstorm}
            theme={previewEditorTheme}
            mode="practice"
          />
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[12px] text-[16px] font-bold">
            Đóng
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BrainstormModal;
