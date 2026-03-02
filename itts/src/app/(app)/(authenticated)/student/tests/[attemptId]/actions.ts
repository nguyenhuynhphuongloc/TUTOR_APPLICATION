"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";

export async function createPeriodicAttempt({
  type,
  userId,
  testId,
  mode = undefined,
  time,
  part,
  classId,
  session,
}: {
  type:
    | "homework"
    | "extra_homework"
    | "mini_test"
    | "mid_term"
    | "final_term"
    | "bank"
    | "entrance_test";
  userId: string;
  testId: string;
  mode?: "simulation" | "practice";
  time?: number;
  part?: string;
  classId?: string;
  session?: number;
}) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { docs: pADocs, totalDocs: pATotalDocs } = await payload.find({
      collection: "periodic_test_attempts",
      where: {
        and: [
          { user: { equals: userId } },
          { type: { equals: type } },
          { test: { equals: testId } },
          classId ? { class: { equals: classId } } : {},
          session ? { session: { equals: session } } : {},
        ],
      },
      limit: 1,
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (pATotalDocs > 0) {
      await payload.update({
        collection: "periodic_test_attempts",
        id: pADocs[0]!.id,
        data: {
          status: "in_progress",
          startedAt: new Date().toISOString(),
          statusDetails: {},
          mode,
          time,
          part,
        },
      });

      return {
        success: true,
        message: "Periodic attempt updated",
        data: {
          id: pADocs[0]!.id,
        },
      };
    }

    const test = await payload.findByID({
      collection: "periodic_tests",
      id: testId,
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (!test) {
      return {
        success: false,
        error_code: "no_periodic_test_found",
        message: "No Periodic Test found",
      };
    }

    const commonData = {
      type,
      user: userId,
      test: testId,
      class: classId,
      session,
      status: "in_progress" as const,
      startedAt: new Date().toISOString(),
    };

    const data =
      type === "bank"
        ? {
            ...commonData,
            mode,
            time,
            part,
          }
        : commonData;

    const { id } = await payload.create({
      collection: "periodic_test_attempts",
      data,
    });

    return {
      success: true,
      message: "Periodic attempt created",
      data: {
        id,
      },
    };
  } catch (e) {
    return {
      success: false,
      error_code: "internal_server_error",
      message: "An error occurred",
    };
  }
}
