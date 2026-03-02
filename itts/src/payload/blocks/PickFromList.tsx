import type { Block } from "payload";
import { editorField } from "../fields/editor";

export const PickFromListBlock: Block = {
  slug: "pickFromList",
  fields: [
    {
      name: "options",
      type: "array",
      minRows: 1,
      maxRows: 40,
      fields: [
        {
          name: "option",
          type: "text",
          required: true,
        },
      ],
    },
    editorField({
      name: "questions",
      required: true,
    }),
  ],
};
