/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { NextAuthConfig } from "next-auth";
import type { User } from "next-auth";
import { api } from "./axios";
import { CartData } from "@/types";

// Extend the User type to include additional fields from the API response
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    token?: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    language: string;
    governorate: string;
    phone: string;
    emailVerified: boolean;
    profileImage: string | null;
    cart?: CartData | null;
    currency_code: string;
  }
  interface Session {
    accessToken?: string;
    user: User;
  }
}

export const config = {
  trustHost: true, // Add this to handle host verification
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
   async authorize(credentials) {
  if (!credentials) return null;

  try {
    console.log('🔐 Attempting login with:', { email: credentials.email });
    
    // ✅ استخدم الـ endpoint الصحيح
    const response = await api.post("front/login", {
      email: credentials.email,
      password: credentials.password,
    });

    console.log('✅ Login API response:', response.data);

    // ✅ طابق الـ response structure
    if (response.data && response.data.result === "Success") {
      const userData = response.data.data;
      
      const user = {
        id: userData.id.toString(),
        name: userData.name, // ✅ غير من firstName لـ name
        firstName: userData.name, // احتفظ بيها علشان التوافق
        lastName: "", // ممكن تبقى فاضية
        email: userData.email,
        token: response.data.token, // ✅ التوكن هنا في response.data.token
        phone: userData.phone,
        // الحقول التانية إذا مش موجودة في الـ response
        age: 0,
        gender: "",
        language: "en",
        governorate: "",
        emailVerified: true,
        profileImage: userData.avatar,
        currency_code: "USD", // افتراضي
      };

      console.log('✅ User object created:', user);
      return user;
    }
    
    console.log('❌ Login failed - no success result');
    return null;
  } catch (error: any) {
    console.log('❌ Login API error:', error.response?.data || error.message);
    return null;
  }
},
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        if (user) {
          token.user = user;
          token.accessToken = user.token;
        }

        // Handle session updates from client-side
        if (trigger === "update" && session) {
          // Update the token with new session data
          token.user = { ...(token.user || {}), ...(session.user || {}) };
        }

        return token;
      } catch (error) {
        // console.error("Error in jwt callback:", error);
        return token;
      }
    },
    async session({ session, token }: any) {
      try {
        session.accessToken = token.accessToken as string;
        session.user = token.user as User;
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
