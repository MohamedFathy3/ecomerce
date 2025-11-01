"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ContactForm({ action }: { action: any }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const response = await action(formData);

    setResult(response);
    setLoading(false);
  }

  return (
    <section className="min-h-screen  text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Section – Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-gray-300 leading-relaxed">
            We’d love to hear from you! Whether you have a question, feedback, or just want to say hello — 
            our team is here to help. Fill out the form and we’ll get back to you as soon as possible.
          </p>

          <div className="space-y-3 mt-6">
            <p className="text-gray-400">📍 6th October City, Egypt</p>
            <p className="text-gray-400">📞 +20 123 456 789</p>
            <p className="text-gray-400">✉️ contact@yourcompany.com</p>
          </div>
        </motion.div>

        {/* Right Section – Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Send a Message</h2>

          <input
            name="name"
            placeholder="Full Name"
            className="w-full bg-transparent border border-gray-500 focus:border-yellow-400 text-white placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full bg-transparent border border-gray-500 focus:border-yellow-400 text-white placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full bg-transparent border border-gray-500 focus:border-yellow-400 text-white placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className="w-full bg-transparent border border-gray-500 focus:border-yellow-400 text-white placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-red-600 hover:opacity-90"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {result && (
            <p
              className={`mt-3 text-center font-medium ${
                result.success ? "text-green-400" : "text-red-400"
              }`}
            >
              {result.message}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
