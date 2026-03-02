import configPromise from "@payload-config";

import { draftMode } from "next/headers";

import { getPayload } from "payload";

import { cache } from "react";

import Grammar from "@/containers/tests/grammar";

import Listening from "@/containers/tests/listening";

import Reading from "@/containers/tests/reading";

import Vocab from "@/containers/tests/vocabulary";

import Writing from "@/containers/tests/writing";


import { LivePreviewListener } from "@/components/live-preview-listener";

import { StoreProvider } from "@/zustand/placement-test/provider";

type Args = {
  params: Promise<{
    id?: string;
  }>;
};

const componentResolver = {
  reading: Reading,
  writing: Writing,
  listening: Listening,
  speaking: null,
  grammar: Grammar,
  vocab: Vocab,
};

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { id = "" } = await paramsPromise;
  const test = await queryTestById({ id });

  if (!test) return null;

  let questionMap: { reading: {}; listening: {} } = {
    reading: {},
    listening: {},
  };

  switch (test.type) {
    case "listening":
    case "reading":
      questionMap[test.type] =
        test?.[test.type]
          ?.flatMap(({ sections }, index) =>
            sections?.flatMap((section) =>
              section.content.flatMap((content) => {
                if (Array.isArray(content?.questions)) {
                  return content?.questions?.flatMap((question) => {
                    if (
                      typeof question === "object" &&
                      question !== null &&
                      "id" in question
                    ) {
                      return (question as { id: string }).id;
                    }

                    return null;
                  });
                }
                if (
                  content?.questions &&
                  typeof content.questions === "object" &&
                  "correctAnswers" in content.questions
                ) {
                  const { correctAnswers } = content?.questions;
                  return Object.values(correctAnswers as object)?.flatMap(
                    (question) => {
                      if (
                        typeof question === "object" &&
                        question !== null &&
                        "uuid" in question
                      ) {
                        return (question as { uuid: string }).uuid;
                      }
                      return null;
                    },
                  );
                }
                return null;
              }),
            ),
          )
          .reduce(
            (obj, val, index) => {
              if (typeof val === "string") {
                obj[val] = index + 1;
              }
              return obj;
            },
            {} as Record<string, number>,
          ) || {};
      break;
  }

  const Component = test?.type ? componentResolver[test.type] : null;

  if (!Component) {
    return null;
  }

  return (
    <>
      {draft && <LivePreviewListener />}
      <StoreProvider
        initialState={{
          questionNoMap: questionMap,
        }}
      >
        <Component {...test} />
      </StoreProvider>
    </>
  );
}

const queryTestById = cache(async ({ id }: { id: string }) => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "tests",
    draft: true,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      id: {
        equals: id,
      },
    },
  });

  return result.docs?.[0] ?? null;
});
