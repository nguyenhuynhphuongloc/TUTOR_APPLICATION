import type { Field } from "payload";

import { editorField } from "../editor";

import { ChooseTitleBlock } from "@/payload/blocks/ChooseTitle";
import { DiagramCompletionBlock } from "@/payload/blocks/DiagramCompletion";
import { FlowChartCompletionBlock } from "@/payload/blocks/FlowChartCompletion";
import { MatchingHeadingBlock } from "@/payload/blocks/MatchingHeading";
import { MatchingNameBlock } from "@/payload/blocks/MatchingName";
import { MatchingParagraphInfoBlock } from "@/payload/blocks/MatchingParagraphInfo";
import { MatchingSentenceEndingBlock } from "@/payload/blocks/MatchingSentenceEnding";
import { MultipleChoiceBlock } from "@/payload/blocks/MultipleChoice";
import { SentenceCompletionBlock } from "@/payload/blocks/SentenceCompletion";
import { ShortAnswerBlock } from "@/payload/blocks/ShortAnswer";
import { SummaryCompletionBlock } from "@/payload/blocks/SummaryCompletion";
import { TableCompletionBlock } from "@/payload/blocks/TableComplete";
import { TrueFalseBlock } from "@/payload/blocks/TrueFalse";
import { YesNoBlock } from "@/payload/blocks/YesNo";
// import { PickFromListBlock } from "@/payload/blocks/PickFromList";

const READING_TYPE_OPTIONS = [
  { label: "Passage 1", value: "1" },
  { label: "Passage 2", value: "2" },
  { label: "Passage 3", value: "3" },
];

const READING_BLOCK_OPTIONS = [
  ChooseTitleBlock,
  DiagramCompletionBlock,
  FlowChartCompletionBlock,
  MatchingHeadingBlock,
  MatchingNameBlock,
  MatchingParagraphInfoBlock,
  MatchingSentenceEndingBlock,
  MultipleChoiceBlock,
  SentenceCompletionBlock,
  ShortAnswerBlock,
  SummaryCompletionBlock,
  TableCompletionBlock,
  TrueFalseBlock,
  YesNoBlock,
  // PickFromListBlock,
];

export const readingField: Field = {
  name: "reading",
  type: "array",
  required: true,
  admin: {
    condition: (data) => {
      return data?.type === "reading";
    },
  },
  label: "Passages",
  minRows: 1,
  maxRows: 3,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Info",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "passageType",
                  type: "select",
                  options: READING_TYPE_OPTIONS,
                  required: true,
                  admin: {
                    width: "30%",
                  },
                },
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: {
                    width: "70%",
                  },
                },
              ],
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
            editorField({
              name: "description",
              label: "Description",
              required: true,
            }),
            editorField({
              name: "passage",
              label: "Passage",
              required: true,
            }),
            {
              name: "vocabs",
              label: "Từ vựng của bài",
              type: "relationship",
              relationTo: "words",
              hasMany: true,
            },
          ],
        },
        {
          label: "Questions",
          fields: [
            {
              name: "sections",
              type: "array",
              minRows: 1,
              maxRows: 20,
              fields: [
                editorField({
                  name: "description",
                  label: "Description",
                  required: true,
                }),
                {
                  name: "content",
                  type: "blocks",
                  required: true,
                  minRows: 1,
                  maxRows: 1,
                  blocks: READING_BLOCK_OPTIONS,
                },
              ],
            },
          ],
        },
        {
          label: "Brainstorm",
          fields: [editorField({ name: "brainstorm", label: "Brainstorm" })],
        },
      ],
    },
  ],
};
