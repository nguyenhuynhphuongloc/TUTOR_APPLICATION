import { z } from "zod";

export const PlacementSelectSchema = z.object({
  type: z.enum(["mini", "full", "sat"], {
    required_error: "You need to select a notification type.",
  }),
});

export type PlacementSelectSchemaType = z.infer<typeof PlacementSelectSchema>;
