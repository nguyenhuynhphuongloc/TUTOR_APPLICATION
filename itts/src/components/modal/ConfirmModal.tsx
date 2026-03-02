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
import { Loader2 } from "lucide-react";
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
const ConfirmModal = ({
  children,
  onSubmit,
  isPending,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isPending: boolean;
}): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await onSubmit(e);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        className="font-sans"
        // onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-[24px] font-bold">
            Delete Alert
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#6D737A] text-[16px] text-center">
            <div>Are you sure you want to delete this item?</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[12px] text-[16px] font-bold">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#E72929] rounded-[12px] text-[16px] font-bold"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Deleting
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
