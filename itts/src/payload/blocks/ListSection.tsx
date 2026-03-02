import type { Block } from "payload";
import { editorField } from "../fields/editor";

export const ListSectionBlock: Block = {
  slug: "listSection",
  fields: [
    editorField({
      name: "questions",
      required: true,
    }),
  ],
};
