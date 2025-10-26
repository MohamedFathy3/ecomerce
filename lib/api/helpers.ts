"use server";

import { auth } from "../auth";

/**
 * Gets the authentication token from either the provided token or the session
 * @param userToken - Optional token provided by the caller
 * @returns Object containing success status, token, and optional message
 */
export async function getAuthToken(userToken?: string) {
  if (userToken) {
    return { success: true, token: userToken };
  }

  const session = await auth();
  const token = session?.user?.token || session?.accessToken || "";

  if (!session || !session.user || !session.accessToken) {
    return {
      success: false,
      token: "",
      message: "User not authenticated",
    };
  }

  return { success: true, token };
}
