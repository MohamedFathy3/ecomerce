import ContactForm from "@/components/contact/ContactForm";
import { submitContactAction } from "./action";

export default function ContactPage() {
  return (
    <section className="wrapper py-12">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <ContactForm action={submitContactAction} />
    </section>
  );
}
