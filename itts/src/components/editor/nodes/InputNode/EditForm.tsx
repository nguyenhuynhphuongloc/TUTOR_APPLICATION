"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, FieldLabel } from "@payloadcms/ui";

import { cn } from "@/lib/utils";

import { InputNode } from ".";

const formSchema = z.object({
  answer: z.string().min(1, {
    message: "Answer is required",
  }),
  answerLocation: z.string().optional(),
  explanation: z.string().optional(),
  questionTitle: z.string().optional(),
  locateTime: z.string().optional(),
});

function EditForm({
  answer,
  answerLocation,
  explanation,
  questionTitle,
  locateTime,
  withInputNode,
  onClose,
}: {
  answer: string;
  answerLocation?: string;
  explanation?: string;
  questionTitle?: string;
  locateTime?: string;
  withInputNode: (cb: (node: InputNode) => void, onUpdate?: () => void) => void;
  onClose?: () => void;
}) {
  const { formState, register, handleSubmit } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer,
      answerLocation,
      explanation,
      questionTitle,
      locateTime,
    },
  });

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
        if (typeof event.stopPropagation === "function") {
          event.stopPropagation();
        }
      }

      handleSubmit(async (values) => {
        withInputNode((node) => {
          node.setValues(values);
        });
      })(event);
      if (formState.isValid) {
        onClose?.();
      }
    },
    [withInputNode, formState.isValid],
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="flex w-[450px] flex-col gap-2">
        <div className={cn("field-type", "text")}>
          <FieldLabel label="Answer" required={true} />
          <div className="field-type__wrap">
            <input type="text" {...register("answer")} />
          </div>
          <div className="text-[11px] text-[#da4b48]">
            {formState.errors.answer?.message}
          </div>
        </div>
        <div className={cn("field-type", "textarea")}>
          <FieldLabel label="Answer Location" />
          <div className="field-type__wrap">
            <label className="textarea-outer">
              <div className="textarea-inner">
                <textarea
                  className="textarea-element"
                  rows={4}
                  {...register("answerLocation")}
                />
              </div>
            </label>
          </div>
        </div>
        <div className={cn("field-type", "textarea")}>
          <FieldLabel label="Explanation" />
          <div className="field-type__wrap">
            <label className="textarea-outer">
              <div className="textarea-inner">
                <textarea
                  className="textarea-element"
                  rows={4}
                  {...register("explanation")}
                />
              </div>
            </label>
          </div>
        </div>
        <div className={cn("field-type", "textarea")}>
          <FieldLabel label="Question Title" />
          <div className="field-type__wrap">
            <label className="textarea-outer">
              <div className="textarea-inner">
                <textarea
                  className="textarea-element"
                  rows={4}
                  {...register("questionTitle")}
                />
              </div>
            </label>
          </div>
        </div>
        <div className={cn("field-type", "text")}>
          <FieldLabel label="Locate Time" />
          <div className="field-type__wrap">
            <input type="text" {...register("locateTime")} placeholder="mm:ss" />
          </div>
        </div>
        <Button disabled={!formState.isDirty} type="submit" className="m-0">
          Confirm
        </Button>
      </div>
    </form>
  );
}

export default EditForm;
