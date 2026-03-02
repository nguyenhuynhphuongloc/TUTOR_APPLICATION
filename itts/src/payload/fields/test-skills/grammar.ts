import type { Field } from "payload";

import { editorField } from "../editor";

import { MultipleChoiceBlock } from "@/payload/blocks/MultipleChoice";

const GRAMMAR_BLOCK_OPTIONS = [MultipleChoiceBlock];

export const grammarField: Field = {
  name: "grammar",
  label: "Grammar",
  type: "group",
  admin: {
    condition: (data) => {
      return data?.type === "grammar";
    },
  },
  fields: [
    editorField({
      name: "description",
      label: "Description",
      required: true,
    }),
    {
      name: "sections",
      type: "blocks",
      required: true,
      minRows: 1,
      maxRows: 1,
      blocks: GRAMMAR_BLOCK_OPTIONS,
    },
    editorField({ name: "brainstorm", label: "Brainstorm" }),
  ],
};
