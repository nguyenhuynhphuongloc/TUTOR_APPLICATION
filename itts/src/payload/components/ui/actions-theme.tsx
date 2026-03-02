"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function updateThemeColorMode(mode: "light" | "dark") {
    const payload = await getPayload({
        config: configPromise,
    });

  
}
