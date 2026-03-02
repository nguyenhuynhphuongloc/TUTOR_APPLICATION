import type { Class, Feedback } from "@/payload-types";
import type { CollectionAfterChangeHook } from "payload";

type Skill = Feedback["skill"][number];

const afterChangeClasses: CollectionAfterChangeHook<Class> = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  const justBecameActive =
    operation === "update" &&
    previousDoc?.status_class !== "active" &&
    doc.status_class === "active";

  const createdAsActive =
    operation === "create" && doc.status_class === "active";

  if (!justBecameActive && !createdAsActive) return doc;

  const { payload } = req;

  const careData: Record<string, any> = {};
  doc.students?.forEach((student) => {
    const studentId = typeof student === "string" ? student : student.id;
    careData[studentId] = {
      "1": {},
      "2": {},
      "3": {},
      "4": {},
      "5": {},
      "6": {},
    };
  });

  const teacherIds: string[] = (doc.teachers ?? [])
    .map((t) => {
      const v = t?.teacher;
      return typeof v === "string" ? v : v?.id;
    })
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  const skills: Skill[] = Array.from(
    new Set(
      (doc.teachers ?? [])
        .filter((t) => {
          const v = t?.teacher;
          const id = typeof v === "string" ? v : v?.id;
          return id && teacherIds.includes(id);
        })
        .flatMap((t) => (t?.skill ?? []) as Skill[]),
    ),
  );

  const skillsWithFallback: Skill[] = skills.length ? skills : ["reading"];

  try {
    await payload.create({
      collection: "feedback",
      req,
      overrideAccess: true,
      data: {
        class: doc.id,
        teacher: teacherIds,
        skill: skillsWithFallback,
        feedback_data: {},
      },
    });

    await payload.create({
      collection: "attendanceRecords",
      req,
      overrideAccess: true,
      data: {
        class: doc.id,
      },
    });

    const existingCare = await payload.find({
      collection: "care",
      req,
      where: { class_ref: { equals: doc.id } },
      limit: 1,
      depth: 0,
    });

    if ((existingCare?.docs?.length ?? 0) === 0) {
      await payload.create({
        collection: "care",
        req,
        overrideAccess: true,
        data: {
          class_ref: doc.id,
          class_status: doc.status_class,
          care_data: careData,
        },
      });
    }
  } catch (error) {
    console.error("Error creating care/feedback:", error);
    throw error;
  }
};

export default afterChangeClasses;
