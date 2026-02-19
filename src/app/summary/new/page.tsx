"use client";

import { useState } from "react";
import { createSummaryAction } from "@/lib/actions";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";

export default function NewSummaryPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            const result = await createSummaryAction(formData);
            if (!result.success) {
                setError(result.error || "Failed to generate summary.");
            } else {
                router.push("/summaries");
                router.refresh();
            }
        } catch (err) {
            setError("A network error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link href="/summaries" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-6 transition-opacity">
                    <ArrowLeft size={16} /> Back to Summaries
                </Link>

                <header className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">New Smart Summary</h1>
                    <p className="opacity-60">Paste your study materials for a concise, high-impact summary.</p>
                </header>

                <Card as="form" className="flex flex-col gap-6" onSubmit={handleSubmit} hoverEffect={false}>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Source Material</label>
                        <textarea
                            name="content"
                            required
                            placeholder="Paste your article, textbook chapter, or lecture transcript here..."
                            className="premium-input min-h-[300px] leading-relaxed resize-y"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                            {isLoading ? "Analyzing & Summarizing..." : "Summarize with AI 📝"}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
