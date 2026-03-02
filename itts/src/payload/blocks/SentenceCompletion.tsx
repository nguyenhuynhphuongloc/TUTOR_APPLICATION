import type { Block } from "payload";
import { editorField } from "../fields/editor";

export const SentenceCompletionBlock: Block = {
  slug: "sentenceCompletion",
  fields: [
    editorField({
      name: "questions",
      required: true,
    }),
  ],
};
