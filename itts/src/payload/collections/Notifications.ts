import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Notifications: CollectionConfig = {
    slug: "notifications",
    labels: {
        singular: "Thông báo",
        plural: "Thông báo",
    },
    admin: {
        defaultColumns: ["title", "recipient", "class", "session_date", "is_read"],
        useAsTitle: "title",
        group: "Hệ thống",
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
    },

    fields: [
        {
            name: "type",
            label: "Loại thông báo",
            type: "select",
            required: true,
            options: [
                { label: "Nhắc điểm danh", value: "attendance_reminder" },
            ],
            defaultValue: "attendance_reminder",
        },
        {
            name: "title",
            label: "Tiêu đề",
            type: "text",
            required: true,
        },
        {
            name: "message",
            label: "Nội dung",
            type: "textarea",
            required: true,
        },
        {
            name: "recipient",
            label: "Người nhận",
            type: "relationship",
            relationTo: "admins",
            required: true,
        },
        {
            name: "class",
            label: "Lớp học",
            type: "relationship",
            relationTo: "classes",
            required: true,
        },
        {
            name: "session_date",
            label: "Thời gian buổi học",
            type: "date",
            required: true,
            admin: {
                date: {
                    pickerAppearance: "dayAndTime",
                    displayFormat: "dd/MM/yyyy HH:mm",
                },
            },
        },
        {
            name: "is_read",
            label: "Đã đọc",
            type: "checkbox",
            defaultValue: false,
        },
    ],
};
