"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Loader2, Phone, ShieldCheck, ArrowRight, Globe } from "lucide-react";
import { signIn } from "next-auth/react";
import { auth as firebaseAuth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        confirmationResult: ConfirmationResult;
    }
}

export default function LoginView() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
                size: "invisible",
                callback: () => {
                    console.log("Recaptcha verified");
                },
            });
        }
    }, []);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
            setError("Please enter a valid phone number (e.g., +255...)");
            setIsLoading(false);
            return;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phone, appVerifier);
            window.confirmationResult = confirmationResult;
            setStep("otp");
        } catch (error: any) {
            console.error("Firebase Auth Error:", error);
            setError(error.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await window.confirmationResult.confirm(otp);
            const user = result.user;

            // Now sign in to NextAuth using the verified phone number
            const nextAuthResult = await signIn("credentials", {
                phone: user.phoneNumber,
                otp: "FIREBASE_VERIFIED", // Special flag for auth.ts
                redirect: false,
            });

            if (nextAuthResult?.error) {
                setError(nextAuthResult.error);
                setIsLoading(false);
                return;
            }

            window.location.href = "/dashboard";
        } catch (error: any) {
            console.error("Verification Error:", error);
            setError("Invalid code. Please check and try again.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Welcome to StudyBoost</h2>
            <Card className="w-full max-w-md p-8 shadow-2xl border-[var(--primary-glow)] bg-[var(--card-bg)]/80 backdrop-blur-xl">
                <p className="text-lg opacity-80 mb-8 font-medium">Empowering your learning journey with AI.</p>

                {step === "phone" ? (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary)] group-focus-within:scale-110 transition-transform">
                                <Phone size={20} />
                            </div>
                            <input
                                type="tel"
                                placeholder="Phone Number (+255...)"
                                className="premium-input w-full pl-12 h-14 text-lg"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3 disabled:opacity-50"
                            disabled={isLoading || !phone}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight size={22} />}
                            {isLoading ? "Sending Code..." : "Continue with Phone"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary)]">
                                <ShieldCheck size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="6-digit OTP Code"
                                className="premium-input w-full pl-12 h-14 text-lg tracking-[0.5em] font-mono text-center"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                required
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="btn-secondary w-full text-lg py-4 flex items-center justify-center gap-3"
                                disabled={isLoading || otp.length < 6}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={22} />}
                                {isLoading ? "Verifying..." : "Verify & Sign In"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep("phone")}
                                className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                                disabled={isLoading}
                            >
                                Back to phone number
                            </button>
                        </div>
                    </form>
                )}

                {error && (
                    <div className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in zoom-in duration-200">
                        {error}
                    </div>
                )}

                <div className="mt-10 pt-8 border-t border-[var(--glass-border)]">
                    <p className="text-xs opacity-50 mb-6 uppercase tracking-widest font-bold">Or continue with</p>
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full h-14 rounded-xl border border-[var(--glass-border)] hover:bg-white/5 transition-colors flex items-center justify-center gap-3 font-medium"
                        disabled={isLoading}
                    >
                        <Globe className="w-5 h-5 opacity-80 text-[var(--primary)]" />
                        Google Account
                    </button>
                </div>
            </Card>
            <div id="recaptcha-container"></div>
        </div>
    );
}
