"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ContactForm({ action }: { action: any }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { t } = useLanguage();

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
    <section className="min-h-screen  flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Section – Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
            {t('contact.title')}
          </h1>
          <p className="text-black leading-relaxed">
            {t('contact.description')}
          </p>

          <div className="space-y-4 mt-6">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-yellow-400" />
              <a 
                href="mailto:info@formashop.nl" 
                className=" hover:text-yellow-400 transition-colors"
              >
                info@formashop.nl
              </a>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <p className="text-gray-400 font-medium">{t('contact.followUs')}</p>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/people/Forma-Shop/61583053477324/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/formashop.nl/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
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
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            {t('contact.formTitle')}
          </h2>

          <input
            name="name"
            placeholder={t('contact.namePlaceholder')}
            className="w-full bg-transparent border border-gray-500 focus:border-yellow-400 text-white placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
            required
          />
          <input
            name="email"
            type="email"
            placeholder={t('contact.emailPlaceholder')}
            className="w-full bg-transparent border border-gray-500 focus:border-yellow-400 text-white placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
            required
          />
          <input
            name="phone"
            placeholder={t('contact.phonePlaceholder')}
            className="w-full bg-transparent border border-gray-500 focus:border-yellow-400 text-white placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
          />
          <textarea
            name="message"
            placeholder={t('contact.messagePlaceholder')}
            rows={4}
            className="w-full bg-transparent  text-black border border-gray-500 focus:border-yellow-400  placeholder-gray-400 p-3 rounded-lg outline-none transition-all"
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
            {loading ? t('contact.sending') : t('contact.sendButton')}
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