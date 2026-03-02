import type { Class } from "@/payload-types";
import type { CollectionBeforeChangeHook } from "payload";

type HOMEWORK_META = { homework_id: string; type: string; createdAt: string };

export const updateHomeworkTimestamp: CollectionBeforeChangeHook<
  Class
> = async ({ data }) => {
  if (!data?.sessions) return data;

  data.sessions = data.sessions.map((session) => {
    const {
      homework = [],
      homework_meta = [],
      extra_homework = [],
      ...rest
    } = session;

    const now = new Date().toISOString();
    const mergedMeta = [...(homework_meta as HOMEWORK_META[])];

    // -------- Homework meta --------
    homework!.forEach((item) => {
      const id = typeof item === "string" ? item : item?.id;
      if (!id) return;

      const existed = mergedMeta.find((m) => m.homework_id === id);
      if (!existed) {
        mergedMeta.push({
          homework_id: id,
          type: "homework",
          createdAt: now,
        });
      }
    });

    // -------- Extra homework meta --------
    extra_homework!.forEach((item) => {
      const id = typeof item === "string" ? item : item?.id;
      if (!id) return;

      const existed = mergedMeta.find((m) => m.homework_id === id);
      if (!existed) {
        mergedMeta.push({
          homework_id: id,
          type: "extra_homework",
          createdAt: now,
        });
      }
    });

    return {
      ...rest,
      homework,
      extra_homework,
      homework_meta: mergedMeta,
    };
  });

  return data;
};

export default updateHomeworkTimestamp;
