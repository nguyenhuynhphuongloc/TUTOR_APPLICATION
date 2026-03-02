import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const DiagramCompletionBlock: Block = {
  slug: "digramCompletion",
  fields: [
    {
      name: "diagramImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "questions",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 40,
      fields: [
        {
          type: "row",
          fields: [
            {
              label: "Question No.",
              name: "questionNumber",
              type: "number",
              required: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "correctAnswer",
              type: "text",
              required: true,
              admin: {
                width: "80%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "answerLocation",
              type: "textarea",
              admin: {
                width: "50%",
              },
            },
            {
              name: "explanation",
              type: "textarea",
              admin: {
                width: "50%",
              },
            },
          ],
        },
        { ...extraFields },
      ],
    },
  ],
};
