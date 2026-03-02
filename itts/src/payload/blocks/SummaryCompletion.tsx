import type { Block } from "payload";
import { editorField } from "../fields/editor";

export const SummaryCompletionBlock: Block = {
  slug: "summaryCompletion",
  fields: [
    editorField({
      name: "questions",
      required: true,
    }),
  ],
};
