import ContactForm from "@/components/contact/ContactForm";
import { submitContactAction } from "./action";

export default function ContactPage() {
  return (
    <section className="wrapper ">
      <ContactForm action={submitContactAction} />
    </section>
  );
}
