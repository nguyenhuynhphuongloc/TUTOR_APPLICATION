import type { Block } from "payload";
import { editorField } from "../fields/editor";

export const FormCompletionBlock: Block = {
  slug: "formCompletion",
  fields: [
    editorField({
      name: "questions",
      required: true,
    }),
  ],
};
