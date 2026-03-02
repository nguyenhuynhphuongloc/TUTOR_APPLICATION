import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const MatchingSentenceEndingBlock: Block = {
  slug: "matchingSentenceEnding",
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
              name: "questionNumber",
              type: "number",
              required: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "question",
              type: "text",
              required: true,
              admin: {
                width: "80%",
              },
            },
          ],
        },
        {
          name: "correctAnswer",
          type: "text",
          required: true,
        },
        {
          name: "answerLocation",
          type: "textarea",
        },
        { ...extraFields },
      ],
    },
  ],
};
