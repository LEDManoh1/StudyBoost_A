"use client";

import { useState } from "react";
import { createFlashcardsAction } from "@/lib/actions";
import { Loader2, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";

interface CreateFlashcardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateFlashcardModal({ isOpen, onClose }: CreateFlashcardModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            const result = await createFlashcardsAction(formData);
            if (!result.success) {
                setError(result.error || "Failed to generate flashcards.");
            } else {
                onClose();
                router.refresh(); // Refresh server components to show new collection
            }
        } catch (err) {
            setError("A network error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg relative animate-in fade-in zoom-in duration-200" hoverEffect={false}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--glass-border)] transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-1 text-gradient">Create Flashcards</h2>
                <p className="text-sm opacity-60 mb-6">AI will generate study cards from your topic.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">Study Topic or Text</label>
                        <textarea
                            name="topic"
                            required
                            placeholder="e.g., Photosynthesis process, The French Revolution, or paste your lecture notes here..."
                            className="premium-input min-h-[120px] resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">Number of Cards</label>
                        <select
                            name="count"
                            className="premium-input"
                            defaultValue="10"
                        >
                            <option value="5">5 Cards</option>
                            <option value="10">10 Cards</option>
                            <option value="15">15 Cards</option>
                            <option value="20">20 Cards</option>
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg hover:bg-[var(--glass-border)] transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            {isLoading ? "Generating..." : "Generate Cards"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
