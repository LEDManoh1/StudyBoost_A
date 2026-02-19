import { Card } from "@/components/Card";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="py-24 px-8 max-w-[1000px] mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">Simple, Professional Pricing</h1>
            <p className="text-xl opacity-80 mb-16">Boost your learning efficiency with our professional AI tools.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Free Plan */}
                <Card className="flex flex-col justify-between p-8" hoverEffect={true}>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Free</h2>
                        <p className="opacity-60 mb-8">Basic tools for casual learners</p>
                        <div className="text-4xl font-bold mb-8">0 Tsh</div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-2 items-center"><Check size={18} className="text-[var(--primary)]" /> 10 AI Generations / day</li>
                            <li className="flex gap-2 items-center"><Check size={18} className="text-[var(--primary)]" /> Basic Flashcards</li>
                            <li className="flex gap-2 items-center"><Check size={18} className="text-[var(--primary)]" /> Limited Summaries</li>
                            <li className="flex gap-2 items-center opacity-50"><Check size={18} /> Advanced Exam Prep</li>
                        </ul>
                    </div>
                    <Card as="button" className="w-full py-4 text-center font-bold bg-[var(--card-border)]/30 hover:bg-[var(--card-border)]/50" hoverEffect={false}>
                        Current Plan
                    </Card>
                </Card>

                {/* Pro Plan */}
                <Card className="flex flex-col justify-between p-8 border-2 border-[var(--primary)] shadow-[0_0_30px_rgba(59,130,246,0.2)]" hoverEffect={true}>
                    <div>
                        <div className="bg-[var(--primary)] text-white px-4 py-1 rounded-full text-xs font-bold inline-block mb-4">MOST POPULAR</div>
                        <h2 className="text-2xl font-bold mb-2">Pro</h2>
                        <p className="opacity-60 mb-8">Scale your studies with full AI features</p>
                        <div className="text-4xl font-bold mb-8">
                            5,000 Tsh <span className="text-base font-normal opacity-50">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-2 items-center"><Check size={18} className="text-[var(--primary)]" /> Unlimited AI Generations</li>
                            <li className="flex gap-2 items-center"><Check size={18} className="text-[var(--primary)]" /> Advanced Exam Prep Engine</li>
                            <li className="flex gap-2 items-center"><Check size={18} className="text-[var(--primary)]" /> Priority AI Processing</li>
                            <li className="flex gap-2 items-center"><Check size={18} className="text-[var(--primary)]" /> Export to PDF/Anki</li>
                        </ul>
                    </div>
                    <button className="btn-primary w-full py-4 text-lg">Upgrade to Pro</button>
                </Card>
            </div>

            <p className="mt-16 opacity-50">
                Questions? Contact us on <a href="https://wa.me/255719037557" className="text-gradient font-bold hover:opacity-80 transition-opacity">WhatsApp Support</a>
            </p>
        </div>
    );
}
