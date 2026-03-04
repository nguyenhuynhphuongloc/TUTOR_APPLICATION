import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    -- Add phone and email columns to the existing "search" table
    DO $$ BEGIN
      ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "phone" varchar;
      ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "email" varchar;
    EXCEPTION
      WHEN undefined_table THEN
        -- Fallback: create table if for some reason it doesn't exist (unlikely given previous migration)
        CREATE TABLE IF NOT EXISTS "search" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "title" varchar,
          "priority" numeric,
          "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
          "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
          "phone" varchar,
          "email" varchar
        );
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
    ALTER TABLE "search" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "search" DROP COLUMN IF EXISTS "email";
  `)
}
