"use server";

import { prisma } from "@/lib/prisma";
import { generateOTP, sendOTP } from "@/lib/otp";

export async function sendOtpAction(phone: string) {
    try {
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Upsert user (create if not exists) and save OTP
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma.user as any).upsert({
            where: { phone },
            update: { otp, otpExpires: expiry },
            create: { phone, otp, otpExpires: expiry },
        });

        const result = await sendOTP(phone, otp);
        if (!result.success) {
            return { success: false, error: result.error || "Failed to send OTP" };
        }

        return { success: true };
    } catch (error) {
        console.error("Send OTP Error:", error);
        return { success: false, error: "Internal server error" };
    }
}
