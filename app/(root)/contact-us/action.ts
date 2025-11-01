// app/contact/action.ts
"use server";

import { saveContact } from "@/lib/api/Contact";

export async function submitContactAction(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    message: formData.get("message") as string,
  };

  const result = await saveContact(data);
  return result;
}
