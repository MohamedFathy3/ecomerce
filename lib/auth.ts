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
          // Call Laravel login endpoint
          const response = await api.post("login", {
            email: credentials.email,
            password: credentials.password,
          });

          // Check if the response indicates success
          if (response.data && response.data.result === "Success") {
            const user = {
              id: response.data.data.user.id,
              firstName: response.data.data.user.first_name,
              lastName: response.data.data.user.last_name,
              email: response.data.data.user.email,
              token: response.data.data.token, // Store the token for later use
              age: response.data.data.user.age,
              gender: response.data.data.user.gender,
              language: response.data.data.user.language,
              currency_code: response.data.data.user.currency_code,
              governorate: response.data.data.user.governorate,
              phone: response.data.data.user.phone,
              emailVerified: response.data.data.user.is_verified === 1,
              profileImage: response.data.data.user.profile_image,
              is_doctor: response.data.data.user.is_doctor,
            };

            return user;
          }
          return null;
        } catch (error: any) {
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
