"use server";

import type { PlacementSelectSchemaType } from "./schema";

import configPromise from "@payload-config";
import { random } from "lodash-es";
import { getPayload } from "payload";

export async function createPlacementAttempt({
  type,
  leadId,
}: PlacementSelectSchemaType & {
  leadId: string;
}) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { docs: pADocs, totalDocs: pATotalDocs } = await payload.find({
      collection: "placement_attempts",
      where: {
        and: [{ user: { equals: leadId } }, { type: { equals: type } }],
      },
      limit: 1,
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (pATotalDocs > 0) {
      await payload.update({
        collection: "placement_attempts",
        id: pADocs[0]!.id,
        data: {
          status: "in_progress",
          startedAt: new Date().toISOString(),
          statusDetails: {},
        },
      });

      return {
        success: true,
        message: "Placement attempt updated",
        data: {
          id: pADocs[0]!.id,
        },
      };
    }

    const { totalDocs: pTTotalDocs, docs: pTDocs } = await payload.find({
      collection: "placement_tests",
      where: {
        and: [
          {
            type: {
              equals: type,
            },
          },
          {
            _status: {
              equals: "published",
            },
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (pTTotalDocs === 0) {
      return {
        success: false,
        error_code: "no_placement_tests_found",
        message: "No placement tests found",
      };
    }
    const testId = pTDocs[random(pTTotalDocs - 1)]?.id;

    const { id } = await payload.create({
      collection: "placement_attempts",
      data: {
        type,
        user: leadId,
        test: testId!,
        status: "in_progress",
        startedAt: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: "Placement attempt created",
      data: {
        id,
      },
    };
  } catch {
    return {
      success: false,
      error_code: "internal_server_error",
      message: "An error occurred",
    };
  }
}
