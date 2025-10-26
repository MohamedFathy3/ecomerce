import { signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  // Perform the sign-out operation
  await signOut({ redirectTo: "/signin" });
  console.log("User signed out successfully");

  // Clear cookies or perform any additional cleanup if needed
  const response = NextResponse.json({ success: true });
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");

  return response;
}
