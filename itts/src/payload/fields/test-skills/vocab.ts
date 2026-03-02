import type { Field } from "payload";

import { editorField } from "../editor";

import { MultipleChoiceBlock } from "@/payload/blocks/MultipleChoice";

const VOCAB_BLOCK_OPTIONS = [MultipleChoiceBlock];

export const vocabField: Field = {
  name: "vocab",
  label: "Vocab",
  type: "group",
  admin: {
    condition: (data) => {
      return data?.type === "vocab";
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
      blocks: VOCAB_BLOCK_OPTIONS,
    },
    editorField({ name: "brainstorm", label: "Brainstorm" }),
  ],
};
