import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/",
        error: "/",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.plan = (user as { plan?: string }).plan || "FREE";
            }
            return token;
        },
        session({ session, token }) {
            if (session?.user && token) {
                session.user.id = token.id as string;
                session.user.plan = (token.plan as string) || "FREE";
            }
            return session;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "build-time-placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "build-time-placeholder",
        }),
        CredentialsProvider({
            name: "Phone OTP",
            credentials: {
                phone: { label: "Phone", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.otp) return null;

                // Handle Firebase Verified Flow
                if (credentials.otp === "FIREBASE_VERIFIED") {
                    let user = await prisma.user.findUnique({
                        where: { phone: credentials.phone as string },
                    });

                    if (!user) {
                        // Create user if they don't exist
                        user = await prisma.user.create({
                            data: {
                                phone: credentials.phone as string,
                                name: "Scholar", // Default name
                                plan: "FREE",
                            },
                        });
                    }

                    return user;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = await prisma.user.findUnique({
                    where: { phone: credentials.phone as string },
                });

                if (!user || !user.otp || !user.otpExpires) return null;

                // Check if OTP matches and is not expired
                if (user.otp === credentials.otp && new Date(user.otpExpires) > new Date()) {
                    // Clear OTP after successful use
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { otp: null, otpExpires: null },
                    });
                    return user;
                }

                return null;
            },
        }),
    ],
});
