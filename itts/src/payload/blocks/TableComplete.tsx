import type { Block } from "payload";
import { editorField } from "../fields/editor";

export const TableCompletionBlock: Block = {
  slug: "tableCompletion",
  fields: [
    editorField({
      name: "questions",
      required: true,
    }),
  ],
};
