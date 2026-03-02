import PeriodicTestResult from "@/containers/tests/elements/result/periodic-test/periodic-test-result";
import type { PeriodicTestAttempt, Test, User } from "@/payload-types";
import configPromise from "@/payload.config";
import { notFound, redirect } from "next/navigation";
import { getPayload } from "payload";
import { cache } from "react";

const getAllCompletedAttempts = cache(
  async ({ userId, payload }: { userId: string; payload: any }) => {
    const { docs } = await payload.find({
      collection: "periodic_test_attempts",
      where: {
        user: { equals: userId },
        status: { equals: "completed" },
      },
      depth: 1,
      limit: 1000,
      sort: "-completedAt",
    });
    return docs as PeriodicTestAttempt[];
  },
);

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const getTests = cache(async ({ id }: { id: string }) => {
  const payload = await getPayload({ config: configPromise });

  const { tests } = (await payload.findByID({
    collection: "periodic_tests",
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
  let attempt: PeriodicTestAttempt | undefined;
  let user: User | undefined;
  let tests: Test[] | undefined;
  let allAttempts: PeriodicTestAttempt[] = [];
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
      collection: "periodic_test_attempts",
      id: searchParams.attemptId as string,
    });
    const userId =
      typeof attempt.user === "string" ? attempt.user : attempt.user.id;
    const testId =
      typeof attempt.test === "string" ? attempt.test : attempt.test.id;
    user = await payload.findByID({
      collection: "users",
      id: userId,
    });
    tests = await getTests({ id: testId });
    allAttempts = await getAllCompletedAttempts({ userId, payload });

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
  } catch (err) {
    console.error(err);
  }

  if (!tests) {
    return notFound();
  }

  if (attempt?.status === "in_progress") {
    return redirect("/student");
  }

  return (
    <PeriodicTestResult
      tests={tests}
      user={user}
      data={attempt}
      testResult={attempt?.answerSheet}
      questionMap={questionMap}
      allAttempts={allAttempts}
    />
  );
}
