import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== AUTH DEBUG ===");
        console.log("Email:", credentials?.email);
        console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

        if (!credentials?.email || !credentials?.password) {
          console.log("FAIL: Missing credentials");
          return null;
        }

        const { data: user, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        console.log("User found:", user);
        console.log("Supabase error:", error);

        if (!user) {
          console.log("FAIL: No user found");
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        console.log("Password valid:", valid);

        if (!valid) {
          console.log("FAIL: Wrong password");
          return null;
        }

        console.log("SUCCESS: Logged in as", user.email);
        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});