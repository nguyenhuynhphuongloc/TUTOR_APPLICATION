import type { Field } from "payload";
import { editorField } from "../editor";

import { ChooseTitleBlock } from "@/payload/blocks/ChooseTitle";
import { DiagramCompletionBlock } from "@/payload/blocks/DiagramCompletion";
import { FlowChartCompletionBlock } from "@/payload/blocks/FlowChartCompletion";
import { MatchingHeadingBlock } from "@/payload/blocks/MatchingHeading";
import { MatchingInfoBlock } from "@/payload/blocks/MatchingInfo";
import { MatchingNameBlock } from "@/payload/blocks/MatchingName";
import { MatchingParagraphInfoBlock } from "@/payload/blocks/MatchingParagraphInfo";
import { MatchingSentenceEndingBlock } from "@/payload/blocks/MatchingSentenceEnding";
import { MultipleChoiceBlock } from "@/payload/blocks/MultipleChoice";
import { PlanMapDiagramLabelingBlock } from "@/payload/blocks/PlanMapDiagramLabeling";
import { SentenceCompletionBlock } from "@/payload/blocks/SentenceCompletion";
import { ShortAnswerBlock } from "@/payload/blocks/ShortAnswer";
import { SummaryCompletionBlock } from "@/payload/blocks/SummaryCompletion";
import { TableCompletionBlock } from "@/payload/blocks/TableComplete";
import { TrueFalseBlock } from "@/payload/blocks/TrueFalse";
import { YesNoBlock } from "@/payload/blocks/YesNo";
// import { PickFromListBlock } from "@/payload/blocks/PickFromList";

const LISTENING_TYPE_OPTIONS = [
  "Section 1",
  "Section 2",
  "Section 3",
  "Section 4",
];

const LISTENING_BLOCKS = [
  MatchingInfoBlock,
  PlanMapDiagramLabelingBlock,
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
];

export const listeningField: Field = {
  type: "row",
  admin: {
    condition: (data) => {
      return data?.type === "listening";
    },
  },
  fields: [
    {
      name: "listening-audio",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        width: "100%",
      },
    },
    {
      name: "listening",
      type: "array",
      admin: {
        className: "w-full",
      },
      required: true,
      label: "Sections",
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          type: "tabs",
          tabs: [
            {
              label: "Info",
              fields: [
                {
                  name: "listeningType",
                  type: "select",
                  options: LISTENING_TYPE_OPTIONS,
                  required: true,
                },
                {
                  name: "title",
                  type: "text",
                  required: true,
                },
                editorField({
                  name: "description",
                  label: "Description",
                  required: true,
                }),
                { name: "transcript", type: "textarea" },
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
                      blocks: LISTENING_BLOCKS,
                    },
                  ],
                },
              ],
            },
            {
              label: "Brainstorm",
              fields: [
                editorField({ name: "brainstorm", label: "Brainstorm" }),
              ],
            },
          ],
        },
      ],
    },
  ],
};
