import type { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

import { grammarField } from "@/payload/fields/test-skills/grammar";
import { listeningField } from "@/payload/fields/test-skills/listening";
import { readingField } from "@/payload/fields/test-skills/reading";
import { speakingField } from "@/payload/fields/test-skills/speaking";
import { vocabField } from "@/payload/fields/test-skills/vocab";
import { writingField } from "@/payload/fields/test-skills/writing";

import type { Test } from "@/payload-types";
import { generatePreviewPath } from "../utilities/generatePreviewPath";

const TEST_TYPE_OPTIONS = [
  { label: "Reading", value: "reading" },
  { label: "Writing", value: "writing" },
  { label: "Speaking", value: "speaking" },
  { label: "Listening", value: "listening" },
  { label: "Grammar", value: "grammar" },
  { label: "Vocabulary", value: "vocab" },
];

const afterChangeHook: CollectionAfterChangeHook = async ({
  doc,
}): Promise<Test> => {
  return doc;
};

export const Tests: CollectionConfig = {
  slug: "tests",
  labels: {
    singular: { vi: "Kho Đề", en: "Test" },
    plural: { vi: "Kho Đề", en: "Tests" },
  },
  access: checkRolePermission("tests"),
  admin: {
    defaultColumns: [
      "name",
      "type",
      "slug",
      "createdAt",
      "updatedAt",
      "test_type",
    ],
    useAsTitle: "name",
    group: "Học Tập",
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.id === "string" ? data.id : "",
        collection: "tests",
        req,
      }),
  },
  hooks: {
    afterChange: [afterChangeHook],
  },
  versions: {
    drafts: true,
    maxPerDoc: 3,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          label: "Tên Bài Kiểm Tra",
          type: "text",
          required: true,
          admin: {
            width: "50%",
          },
        },
        {
          label: "Kỹ Năng",
          name: "type",
          type: "select",
          required: true,
          options: TEST_TYPE_OPTIONS,
          defaultValue: "reading",
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      label: "Hiển Thị Trên LMS",
      name: "isVisibleOnLMS",
      type: "checkbox",
      required: false,
      admin: {
        // position: "sidebar",
      },
    },
    {
      name: "test_type",
      label: "Loại đề thi",
      type: "select",
      options: [
        { label: "Bài tập về nhà", value: "homework" },
        { label: "Bài tập bổ trợ", value: "extra_homework" },
        { label: "Mini test", value: "mini_test" },
        { label: "Kiểm tra giữa kỳ", value: "mid_term" },
        { label: "Kiểm tra cuối kỳ", value: "final_term" },
        { label: "Kho đề", value: "bank" },
        { label: "Kiểm tra đầu vào", value: "entrance_test" },
      ],
      defaultValue: "homework",
      enumName: "test_types",
      required: true,
      admin: {
        components: {
          Cell: "@/payload/cell/CellSelectTestType",
        },
        width: "50%",
      },
      hasMany: true,
    },
    {
      name: "authors",
      type: "relationship",
      hidden: true,
      hasMany: true,
      relationTo: "admins",
      maxDepth: 1,
    },
    listeningField,
    writingField,
    readingField,
    speakingField,
    grammarField,
    vocabField,
  ],
};
