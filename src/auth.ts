import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "build-time-placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "build-time-placeholder",
        }),
    ],
    callbacks: {
        jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.plan = user.plan || "FREE";
            }
            return token;
        },
        session({ session, token }: any) {
            if (session?.user && token) {
                session.user.id = token.id as string;
                session.user.plan = (token.plan as string) || "FREE";
            }
            return session;
        },
    },
});
