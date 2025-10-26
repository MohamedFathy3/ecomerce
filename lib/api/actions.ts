"use server";

import { revalidatePath } from "next/cache";

export async function revalidate(path: string) {
  "use server";
  // console.log("Revalidating path:", path);
  revalidatePath(path);
}
