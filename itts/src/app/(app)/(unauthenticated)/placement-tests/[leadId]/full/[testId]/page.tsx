import type { PlacementAttempt, Test } from "@/payload-types";
import type { ProgressItem } from "./types";

import configPromise from "@payload-config";
import { notFound, redirect } from "next/navigation";
import { getPayload, type Payload } from "payload";
import { cache } from "react";

import { StoreProvider } from "@/zustand/placement-test/provider";
import Root from "./root";

const verifyPlacementAttempt = cache(
  async (
    { leadId, testId }: { leadId: string; testId: string },
    payload: Payload,
  ) => {
    const { docs, totalDocs } = await payload.find({
      collection: "placement_attempts",
      where: {
        user: { equals: leadId },
        id: { equals: testId },
        status: { not_equals: "completed" },
      },
      limit: 1,
      select: {
        answerSheet: true,
        statusDetails: true,
        test: true,
        mode: true,
        time: true,
        user: true,
        type: true,
        status: true,
        score: true,
        startedAt: true,
        completedAt: true,
      },
    });

    if (totalDocs === 0) {
      return undefined;
    }

    return docs[0] as any;
  },
);

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

export default async function Page({
  params,
}: {
  params: Promise<{ leadId: string; testId: string }>;
}) {
  let attempt: PlacementAttempt | undefined;
  let tests: Test[];
  let progress: Array<ProgressItem>;
  let questionMap: Record<
    "listening" | "reading" | "writing" | "speaking",
    Record<string, number>
  > = {
    listening: {},
    reading: {},
    writing: {},
    speaking: {},
  };
  let error: string | null = null;

  try {
    const { leadId, testId } = await params;
    const payload = await getPayload({ config: configPromise });
    attempt = await verifyPlacementAttempt({ leadId, testId }, payload);

    if (!attempt) {
      return redirect("/placement-tests");
    }

    tests = await getTests({ id: attempt.test as string }, payload);

    progress = tests.reduce<Array<ProgressItem>>((progress, entry) => {
      switch (entry.type) {
        case "listening":
          progress.push({
            type: entry.type,
            content: entry?.listening?.map(({ sections }, index) => ({
              part: index + 1,
              questions: sections?.flatMap((section) =>
                section.content.flatMap((content) => {
                  if (Array.isArray(content?.questions)) {
                    return content?.questions?.flatMap((question) => {
                      if (
                        typeof question === "object" &&
                        question !== null &&
                        "id" in question
                      ) {
                        return { id: (question as { id: string }).id };
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
                          return { id: (question as { uuid: string }).uuid };
                        }
                        return null;
                      },
                    );
                  }
                  return null;
                }),
              ),
            })),
          });
          break;
        case "speaking":
          progress.push({
            type: entry.type,
          });
          break;
        case "reading":
          progress.push({
            type: entry.type,
            content: entry?.reading?.map(({ sections }, index) => ({
              part: index + 1,
              questions: sections?.flatMap((section) =>
                section.content.flatMap((content) => {
                  if (Array.isArray(content?.questions)) {
                    return content?.questions?.flatMap((question) => {
                      if (
                        typeof question === "object" &&
                        question !== null &&
                        "id" in question
                      ) {
                        return { id: (question as { id: string }).id };
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
                          return { id: (question as { uuid: string }).uuid };
                        }
                        return null;
                      },
                    );
                  }
                  return null;
                }),
              ),
            })),
          });
          break;
        case "writing":
          progress.push({
            type: entry.type,
            content: [
              {
                part: 1,
                questions: [{ id: entry.writing?.[0]?.id ?? "" }],
              },
              {
                part: 2,
                questions: [{ id: entry.writing?.[1]?.id ?? "" }],
              },
            ],
          });
          break;
      }
      return progress;
    }, []);

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
                .filter(Boolean)
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
  } catch {
    error = "An error occurred while fetching data";
  }

  if (error) {
    return notFound();
  }

  const statusDetails = (attempt as any)?.statusDetails || {};
  const skillNames = ["listening", "reading", "writing", "speaking"];
  const currentSkillName = skillNames[statusDetails.currentSkill || 0];
  const timeLeft = statusDetails.timeLeft?.[currentSkillName!] || 0;

  return (
    <StoreProvider
      initialState={{
        questionNoMap: questionMap,
        answerSheetFull: (attempt as any)?.answerSheet || {},
        navigation: {
          timeLeft: timeLeft,
          currentSkill: statusDetails.currentSkill || 0,
          currentSection: 0,
        },
      }}
    >
      <Root
        attempt={attempt as any}
        tests={tests!}
        progress={progress!}
        questionMap={questionMap}
        testType="placement"
      />
    </StoreProvider>
  );
}
