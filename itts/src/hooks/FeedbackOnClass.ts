import type { CollectionAfterChangeHook } from 'payload'
import type { Class } from '@/payload-types'

export const createFeedbackOnClassCreate: CollectionAfterChangeHook<Class> = async ({
  doc,
  operation,
  req,
}) => {
  
  if (operation !== 'create') return doc

  
  const teachersArr = doc?.teachers ?? []

  if (!teachersArr.length) return doc

  
  const teacherIds = teachersArr
    .map((t) => (typeof t?.teacher === 'string' ? t.teacher : t?.teacher?.id))
    .filter(Boolean) as string[]

  if (!teacherIds.length) return doc

  
  const existing = await req.payload.find({
    collection: 'feedback',
    limit: 1000,
    where: {
      and: [
        { class: { equals: doc.id } },
        { teacher: { in: teacherIds } },
      ],
    },
    overrideAccess: true,
  })

  const existedTeacherSet = new Set(
    (existing?.docs ?? []).map((f) =>
      typeof f.teacher === 'string' ? f.teacher : f.teacher?.id,
    ),
  )

  console.log(existedTeacherSet)

  await Promise.all(
    teacherIds
      .filter((teacherId) => !existedTeacherSet.has(teacherId))
      .map((teacherId) =>
        req.payload.create({
          collection: 'feedback',
          data: {
            class: doc.id,
            teacher: teacherId,
            feedback_data: {},
          },
          overrideAccess: true,
          draft: false,
        })

      ),
  )

  return doc
}
