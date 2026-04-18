/**
 * Generates a 6-digit random number as a string.
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Placeholder function for sending OTP via WhatsApp or SMS.
 * @param phone The phone number to send to.
 * @param otp The 6-digit OTP.
 */
export async function sendOTP(phone: string, otp: string): Promise<{ success: boolean; error?: string }> {
    console.log(`[AUTH] Sending OTP ${otp} to ${phone}`);

    // TODO: Integrate with your preferred service (Twilio, Vonage, WhatsApp API, etc.)
    // Example for a generic API call:
    /*
    const response = await fetch("https://api.yourservice.com/send", {
        method: "POST",
        body: JSON.stringify({ to: phone, message: `Your StudyBoost login code is: ${otp}` }),
        headers: { "Authorization": `Bearer ${process.env.PROVIDER_API_KEY}` }
    });
    return response.ok ? { success: true } : { success: false, error: "Service failed" };
    */

    // For now, we simulate success and log to console.
    return { success: true };
}
