"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { saveContact, ContactFormData } from "@/lib/api/conectus";
import { toast } from "sonner";

const ContactUs = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    
    try {
      const result = await saveContact(formData);
      
      if (result.success) {
        toast.success("Your message has been sent successfully! We will contact you soon.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
        setErrors({});
      } else {
        toast.error(result.message || "Failed to send message, please try again.");
      }
    } catch (error) {
      console.error("❌ Contact form error:", error);
      toast.error("An unexpected error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="wrapper">
      <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="rounded-2xl bg-muted/50 p-6 space-y-8 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">Call Us</h2>
            <p className="text-muted-foreground text-sm">
              We are available 24/7, 7 days a week.
            </p>
            <p className="text-muted-foreground text-sm">
              Phone: +8801611112222
            </p>
          </div>
          <hr />
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">Write To Us</h2>
            <p className="text-muted-foreground text-sm">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="text-muted-foreground text-sm">
              Email: customer@exclusive.com
            </p>
            <p className="text-muted-foreground text-sm">
              Email: support@exclusive.com
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 rounded-2xl bg-muted/50 px-6 py-10 flex flex-col space-y-4 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Input 
                  name="name"
                  placeholder="Your Name *" 
                  className="bg-white dark:bg-gray-800"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email *"
                  className="bg-white dark:bg-gray-800"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <Input
                  name="phone"
                  placeholder="Your Phone *"
                  className="bg-white dark:bg-gray-800"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
            
            <div>
              <Textarea
                name="message"
                placeholder="Your Message *"
                rows={6}
                className="flex-grow-1 bg-white dark:bg-gray-800"
                value={formData.message}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="rounded-xl px-6 text-base"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;