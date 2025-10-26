"use server";
import en, { Locale } from "./en";
import ar from "./ar";
import { auth } from "@/lib/auth";

const getLocaleStrings = async (): Promise<Locale> => {
  const session = await auth();
  const lang: string = session?.user?.language || "en";
  if (lang === "ar") return ar;
  return en;
};

export default getLocaleStrings;

