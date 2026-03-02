import type { Block } from "payload";
import { editorField } from "../fields/editor";

export const FlowChartCompletionBlock: Block = {
  slug: "flowChartCompletion",
  fields: [
    editorField({
      name: "questions",
      required: true,
    }),
  ],
};
