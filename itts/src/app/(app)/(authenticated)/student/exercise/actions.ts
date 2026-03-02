"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";

export async function checkSessionFeedback({
  userId,
  classId,
  session,
}: {
  userId: string;
  classId: string;
  session: number;
}) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { totalDocs } = await payload.find({
      collection: "feedback",
      where: {
        and: [
          { class: { equals: classId } },
          { [`student_review_session.${userId}.${session}`]: { exists: true } },
        ],
      },
      limit: 1,
    });

    return totalDocs > 0;
  } catch (error) {
    console.error("Error checking session feedback:", error);
    return false;
  }
}

export async function createSessionFeedback({
  userId,
  classId,
  session,
  feedbackData,
}: {
  userId: string;
  classId: string;
  session: number;
  feedbackData: any;
}) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { docs } = await payload.find({
      collection: "feedback",
      where: {
        and: [{ class: { equals: classId } }],
      },
      limit: 1,
    });

    const existing = docs[0];
    if (existing) {
      const currentReviews = (existing.student_review_session as any) || {};
      const oldStudentReviews = currentReviews[userId] || {};

      // Migrate logic: Nếu dữ liệu cũ có field 'session' trực tiếp, bọc nó vào session key tương ứng
      const studentReviews =
        oldStudentReviews.session != null &&
        typeof oldStudentReviews.session === "number"
          ? { [oldStudentReviews.session]: oldStudentReviews }
          : oldStudentReviews;

      await payload.update({
        collection: "feedback",
        id: existing.id,
        data: {
          student_review_session: {
            ...currentReviews,
            [userId]: {
              ...studentReviews,
              [session]: {
                ...feedbackData,
                session,
              },
            },
          },
        },
      });
    } else {
      await payload.create({
        collection: "feedback",
        data: {
          class: classId,
          student_review_session: {
            [userId]: {
              [session]: {
                ...feedbackData,
                session,
              },
            },
          },
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating session feedback:", error);
    return { success: false, message: "Internal server error" };
  }
}
