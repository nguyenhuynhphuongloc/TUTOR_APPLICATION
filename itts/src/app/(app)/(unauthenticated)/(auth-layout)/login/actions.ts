"use server";

import config from "@payload-config";
import { login, logout } from "@payloadcms/next/auth";
import { cookies } from "next/headers";

export async function loginAction({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const result = await login({
      collection: "users",
      config,
      username,
      password,
    });
    return { user: result.user, token: result.token, error: null };
  } catch (error) {
    return { user: null, token: null, error };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    // Manually delete the payload token cookie to ensure immediate logout
    // even if the server-side logout times out.
    cookieStore.delete("payload-token");

    // Call standard logout as a secondary, non-blocking action if possible
    // or just return success if the cookie is gone.
    try {
      await logout({
        config,
        allSessions: false,
      });
    } catch (e) {
      console.warn(
        "Payload server-side logout failed, but cookie was cleared:",
        e.message,
      );
    }

    return { success: true, message: "Logged out successfully", error: null };
  } catch (error) {
    return {
      success: false,
      message: "Error during logout",
      error: error.message,
    };
  }
}
