import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
            <div className="flex flex-col items-center gap-4 opacity-60">
                <Loader2 size={48} className="animate-spin text-[var(--primary)]" />
                <p>Loading your study space...</p>
            </div>
        </div>
    );
}
