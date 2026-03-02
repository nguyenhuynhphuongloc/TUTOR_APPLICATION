import EntranceTestResult from "@/containers/tests/elements/result/entrance-test/entrance-test-result";
import type { Lead, PlacementAttempt, Test } from "@/payload-types";
import configPromise from "@/payload.config";
import { notFound } from "next/navigation";
import { getPayload, type Payload } from "payload";
import { cache } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const getTests = cache(async ({ id }: { id: string }, payload: Payload) => {
  const { tests } = (await payload.findByID({
    collection: "placement_tests",
    id,
    select: {
      tests: true,
    },
    depth: 0,
  })) as { tests: string[] };

  const data = await Promise.all(
    tests.map((id) =>
      payload.findByID({
        collection: "tests",
        id,
      }),
    ),
  );

  return data;
});

export default async function TestResult(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  let attempt: PlacementAttempt | undefined;
  let lead: Lead | undefined;
  let tests: Test[] | undefined;
  let questionMap: Record<
    "listening" | "reading" | "writing" | "speaking",
    Record<string, number>
  > = {
    listening: {},
    reading: {},
    writing: {},
    speaking: {},
  };
  const payload = await getPayload({ config: configPromise });
  try {
    attempt = await payload.findByID({
      collection: "placement_attempts",
      id: searchParams.attemptId as string,
    });
    lead = await payload.findByID({
      collection: "leads",
      id: attempt.user as string,
    });
    tests = await getTests({ id: attempt.test as string }, payload);

    questionMap = tests.reduce<
      Record<
        "listening" | "reading" | "writing" | "speaking",
        Record<string, number>
      >
    >(
      (result, entry) => {
        switch (entry.type) {
          case "listening":
          case "reading":
            result[entry.type] =
              entry?.[entry.type]
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
        return result;
      },
      {
        listening: {},
        reading: {},
        writing: {},
        speaking: {},
      },
    );
  } catch {}

  if (!tests) {
    return notFound();
  }
  return (
    <EntranceTestResult
      test={tests}
      lead={lead}
      data={attempt}
      testResult={attempt?.answerSheet}
    />
  );
}
