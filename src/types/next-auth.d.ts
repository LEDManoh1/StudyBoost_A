import { type DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            plan: string;
        } & DefaultSession["user"];
    }

    interface User {
        plan?: string;
        phone?: string | null;
        otp?: string | null;
        otpExpires?: Date | null;
    }
}
