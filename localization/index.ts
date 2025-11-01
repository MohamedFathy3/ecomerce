"use server";
import en, { Locale } from "./en";
import { auth } from "@/lib/auth";

const getLocaleStrings = async (): Promise<Locale> => {
  const session = await auth();
  const lang: string = session?.user?.language || "en";
  if (lang === "en") return en;
  return en;
};

export default getLocaleStrings;

