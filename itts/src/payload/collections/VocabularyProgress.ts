/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CollectionConfig } from "payload";

export const VocabularyProgress: CollectionConfig = {
  slug: "vocab-progress",
  labels: { plural: "Tiến độ học từ vựng", singular: "Tiến độ học từ vựng" },
  admin: {
    group: "Học Tập",
    useAsTitle: "user",
    hidden: true,
  },
  fields: [
    {
      name: "user",
      label: "Người học",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "word",
      label: "Từ đã học",
      type: "relationship",
      relationTo: "words",
      required: true,
      hasMany: true,
    },
  ],
  endpoints: [
    {
      path: "/upsert",
      method: "post",
      handler: async (req) => {
        const body = (await req?.json?.()) as any;
        if (!body) return Response.json({ error: "No body" }, { status: 400 });
        const { userId, wordIds } = body;

        if (!userId || !wordIds || !Array.isArray(wordIds)) {
          return Response.json(
            { error: "Missing or invalid input" },
            { status: 400 },
          );
        }

        // Tìm vocab-progress của user
        const existing = await req.payload.find({
          collection: "vocab-progress",
          where: {
            user: {
              equals: userId,
            },
          },
        });

        if (existing.docs.length > 0 && existing.docs[0]) {
          // đã có => cập nhật
          const current = existing.docs[0] as any;

          const existingWordIds = (current.word || [])
            .map((w: any) => (typeof w === "string" ? w : w?.id))
            .filter(Boolean);

          const newUniqueWords = Array.from(
            new Set([...existingWordIds, ...wordIds]),
          );

          const updated = await req.payload.update({
            collection: "vocab-progress",
            id: current.id,
            data: {
              word: newUniqueWords,
            },
          });

          return Response.json(updated, { status: 200 });
        } else {
          // chưa có => tạo mới
          const created = await req.payload.create({
            collection: "vocab-progress",
            data: {
              user: userId,
              word: wordIds,
            },
          });

          return Response.json(created, { status: 201 });
        }
      },
    },
  ],
};
