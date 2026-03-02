"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";

/**
 * A modal that asks the user if they are sure they want to submit their
 * answers and switch to the next skill.
 *
 * @param {React.ReactNode} children The content of the modal.
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => Promise<void>} onSubmit
 *   The function to call when the user clicks submit.
 * @returns {JSX.Element} The modal element.
 */
const SwitchSkillAlertModal = ({
  children,
  onSubmit,
  blankCount,
  skill,
  type = "full",
}: {
  children: React.ReactNode;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  blankCount: number;
  skill: string | undefined;
  type?: string;
}): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await onSubmit(e);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="font-sans">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-[24px] font-bold">
            Switch Alert
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#6D737A] text-[16px] text-center">
            {type === "full" ? (
              blankCount > 0 ? (
                <div>
                  You still have{" "}
                  <b>
                    {skill !== "speaking" ? blankCount : ""} unanswered
                    questions
                  </b>
                  , are you sure to submit your answer? You cannot switch back
                  to make changes afterwards!
                </div>
              ) : (
                "Are you sure to submit your answer? You cannot switch back to make changes afterwards!"
              )
            ) : (
              <div>
                You still have <b>{blankCount} unanswered questions</b> in
                total, are you sure to submit your answer? You will not be able
                to make any changes afterwards
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[12px] text-[16px] font-bold">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            className="bg-[#E72929] rounded-[12px] text-[16px] font-bold"
          >
            {type === "full" && skill !== "speaking"
              ? "Submit and Move to the next skill"
              : "Submit"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SwitchSkillAlertModal;
