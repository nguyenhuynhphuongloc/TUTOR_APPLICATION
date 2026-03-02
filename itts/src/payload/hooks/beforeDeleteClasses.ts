import type { CollectionBeforeDeleteHook } from 'payload'

export const beforeDeleteClasses: CollectionBeforeDeleteHook = async ({
    id,
    req,
}) => {
    const { payload } = req;
    // Cleanup related records to avoid foreign key constraints and orphans
    const deleteOptions = {
        req,
        overrideAccess: true,
    }

    // Delete attendance records
    await payload.delete({
        collection: 'attendanceRecords',
        where: {
            class: {
                equals: id,
            },
        },
        ...deleteOptions,
    })

    // Delete student care records
    await payload.delete({
        collection: 'care',
        where: {
            class_ref: {
                equals: id,
            },
        },
        ...deleteOptions,
    })

    // Delete feedback records
    await payload.delete({
        collection: 'feedback',
        where: {
            class: {
                equals: id,
            },
        },
        ...deleteOptions,
    })

    // Delete booking schedule records
    await payload.delete({
        collection: 'booking_schedule',
        where: {
            class: {
                equals: id,
            },
        },
        ...deleteOptions,
    })
}

export default beforeDeleteClasses;
