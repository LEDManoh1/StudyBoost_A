import { Card } from "@/components/Card";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function ExamQuestionsPage() {
    return (
        <div className="py-24 px-8 max-w-[800px] mx-auto text-center">
            <header className="mb-16">
                <h1 className="text-5xl font-bold mb-4 text-gradient">AI Exam Engine</h1>
                <p className="text-xl opacity-80">Turn your curriculum into realistic practice tests instantly.</p>
            </header>

            <Card className="p-16 border border-dashed border-[var(--primary)] text-center flex flex-col items-center" hoverEffect={false}>
                <div className="text-6xl mb-6">🔒</div>
                <h2 className="text-3xl font-bold mb-4">Pro Feature</h2>
                <p className="opacity-70 mb-10 max-w-lg mx-auto leading-relaxed">
                    The AI Exam Engine is currently reserved for our Pro subscribers.
                    Upgrade to generate multiple-choice questions with detailed explanations.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/pricing" className="btn-primary px-8 py-3">View Pricing</Link>
                    <Link href="/dashboard" className="px-8 py-3 rounded-xl bg-[var(--card-border)]/50 hover:bg-[var(--card-border)] transition-colors font-medium">
                        Back to Dashboard
                    </Link>
                </div>
            </Card>
        </div>
    );
}
