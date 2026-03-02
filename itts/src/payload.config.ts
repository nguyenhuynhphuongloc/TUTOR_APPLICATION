import { env } from "@/env";
import collections from "@/payload/collections";
import globals from "@/payload/globals";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { s3Storage } from "@payloadcms/storage-s3";
import { vi } from "@payloadcms/translations/languages/vi";
import path from "path";
import { buildConfig } from "payload";
import { payloadSidebar } from "payload-sidebar-plugin";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { DEFAULT_BADGE_COLORS } from "./constants";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "admins",
    theme: "light",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dateFormat: "dd/MM/yyyy HH:mm:ss",
    components: {
      views: {
        analytics: {
          Component: "@/components/StudentViolation/index.tsx",
          path: "/loivipham",
        },
      },
      afterNavLinks: [{ path: "@/components/afterNavLinks/loivipham.tsx" }],
      beforeDashboard: ["@/components/ui/BeforeDashboard"],
      graphics: {
        Logo: "@/components/logo",
        Icon: "@/components/logo/icon",
      },
      providers: ["@/components/AdminProviders"],
    },
    timezones: {
      defaultTimezone: "Asia/Bangkok",
    },
  },
  collections,
  globals,
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    idType: "uuid",
    pool: {
      connectionString: env.DATABASE_URL,
    },
    push: true,
  }),
  email: nodemailerAdapter({
    defaultFromAddress: env.EMAIL_FROM,
    defaultFromName: env.EMAIL_FROM_NAME,
    transportOptions: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    },
  }),
  //localization: {
  //locales: [
  //{ label: "English", code: "en" },
  //{ label: "Vietnamese", code: "vi" },
  //],
  //defaultLocale: "vi",
  //fallback: true,
  //},
  sharp,
  plugins: [
    payloadSidebar({
      cssVariables: {
        /* Màu chữ */
        "--nav-text": "#1f2937",
        /* Màu chữ active */
        "--nav-text-active": "#2563eb",
        /* Màu nền sidebar */
        "--nav-bg": "#ffffff",
        /* Màu nền item hover */
        "--nav-item-hover": "#f1f5f9",
        /* Màu badge */
        "--nav-badge-bg": "#ef4444",
        "--nav-badge-text": "#ffffff",
        /* Màu icon */
        "--nav-icon": "#64748b",
        "--nav-icon-active": "#2563eb",
        ...DEFAULT_BADGE_COLORS,
      },
      icons: {
        orders: "rocket",
        classes: "class",
        attendance: "attendance",
        booking_schedule: "schedule",
        vocabulary: "FolderOpen",
        branches: "MapPin",
        admins: "Briefcase",
        coupons: "Receipt",
        courses: "GraduationCap",
        feedback: "MessageSquare",
        leads: "Crown",
        students: "Users",
        teachers: "UserCheck",
        rooms: "DoorOpen",
        BandScore: "rocket",
        VocabularyProgress: "rocket",
        PersonalVocabulary: "rocket",
        PeriodicTestAttempts: "rocket",
        placement_tests: "Archive",
        placement_attempts: "FileText",
        periodic_test_attempts: "FileText",
        care: "HeartHandshake",
        media: "image",
        question_sets: "FileText",
        attendanceRecords: "ClipboardCheck",
        periodic_tests: "FolderOpen",
        exam_sessions: "Activity",
        band_score: "Target",
        words: "SpellCheck",
        tests: "Database",
        role_permissions: "Permission",
      },
      pinnedStorage: "localStorage",
    }),
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: env.S3_BUCKET,
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
      },
      clientUploads: true,
      signedDownloads: true,
    }),
  ],
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: "vi",
  },
  upload: {
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
  },
});
