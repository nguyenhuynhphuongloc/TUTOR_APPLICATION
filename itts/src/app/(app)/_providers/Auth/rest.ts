/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { User } from "@/payload-types";

export const rest = async (
  url: string,
  args?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: RequestInit,
): Promise<User | null | undefined> => {
  const method = options?.method ?? "POST";

  try {
    const res = await fetch(url, {
      method,
      ...(method === "POST" ? { body: JSON.stringify(args) } : {}),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const { errors, user } = await res.json();

    if (errors) {
      console.log(errors?.[0].message);
    }

    if (res.ok) {
      return user;
    }
  } catch (e: unknown) {
    console.error(e as string);
  }
};
