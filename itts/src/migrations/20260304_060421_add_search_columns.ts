import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Create the "search" table for @payloadcms/plugin-search
    CREATE TABLE IF NOT EXISTS "search" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "title" varchar,
      "priority" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Create the "search_rels" table
    CREATE TABLE IF NOT EXISTS "search_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" uuid NOT NULL,
      "path" varchar NOT NULL,
      "classes_id" uuid,
      "leads_id" uuid,
      "users_id" uuid,
      "admins_id" uuid,
      "courses_id" uuid,
      "orders_id" uuid
    );

    -- Add search_id column to payload_locked_documents_rels if it doesn't exist
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_id" uuid;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END $$;

    -- Add foreign key constraints (skip if already exists)
    DO $$ BEGIN
      ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    -- Create indexes (IF NOT EXISTS)
    CREATE INDEX IF NOT EXISTS "search_updated_at_idx" ON "search" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "search_created_at_idx" ON "search" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "search_rels_order_idx" ON "search_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "search_rels_path_idx" ON "search_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "search_rels_classes_id_idx" ON "search_rels" USING btree ("classes_id");
    CREATE INDEX IF NOT EXISTS "search_rels_leads_id_idx" ON "search_rels" USING btree ("leads_id");
    CREATE INDEX IF NOT EXISTS "search_rels_users_id_idx" ON "search_rels" USING btree ("users_id");
    CREATE INDEX IF NOT EXISTS "search_rels_admins_id_idx" ON "search_rels" USING btree ("admins_id");
    CREATE INDEX IF NOT EXISTS "search_rels_courses_id_idx" ON "search_rels" USING btree ("courses_id");
    CREATE INDEX IF NOT EXISTS "search_rels_orders_id_idx" ON "search_rels" USING btree ("orders_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Remove search_id from payload_locked_documents_rels
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "search_id";

    -- Drop search tables
    DROP TABLE IF EXISTS "search_rels" CASCADE;
    DROP TABLE IF EXISTS "search" CASCADE;
  `)
}
