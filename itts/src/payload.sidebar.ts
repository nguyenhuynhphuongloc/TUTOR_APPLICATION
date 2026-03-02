import { payloadSidebar } from 'payload-sidebar-plugin'

payloadSidebar({
    groupOrder: {
        // English labels
        Content: 1,
        Media: 2,
        Users: 3,
        Settings: 10,

        // Vietnamese labels (for i18n)
        'Nội dung': 1,
        'Phương tiện': 2,
        'Người dùng': 3,
        'Cài đặt': 10,

        // Custom groups
        Tools: 15,
        Resources: 99,

        // Unlisted groups default to priority 50
    },
})