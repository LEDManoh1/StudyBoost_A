"use client";

import { Card } from "@/components/Card";
import { useState } from "react";
import Roadmap from "@/components/Roadmap";
import { generateRoadmapAction } from "@/lib/actions";
import { Loader2, Sparkles, Target, GraduationCap, Clock, Save } from "lucide-react";

export default function RoadmapsPage() {
    const [goal, setGoal] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [hours, setHours] = useState(10);
    const [roadmap, setRoadmap] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateRoadmapAction(goal, level, hours);
            if (result.success) {
                setRoadmap(result.data);
            } else {
                setError(result.error || "Failed to generate roadmap.");
            }
        } catch (err) {
            setError("A network error occurred. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-16 px-8 max-w-[1000px] mx-auto">
            <header className="mb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">Learning Roadmaps</h1>
                <p className="text-xl opacity-80">AI-powered career roadmap platform for serious learners.</p>
            </header>

            {!roadmap ? (
                <Card className="max-w-2xl mx-auto p-12" hoverEffect={false}>
                    <h2 className="text-2xl font-bold mb-8 text-center">Start Your Journey</h2>
                    <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                        <div>
                            <label className="flex items-center gap-2 mb-2 text-sm opacity-70">
                                <Target size={16} /> Your Career Goal
                            </label>
                            <input
                                className="premium-input w-full"
                                type="text"
                                placeholder="e.g., Cybersecurity, AI Engineer, Web Dev"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 mb-2 text-sm opacity-70">
                                    <GraduationCap size={16} /> Experience Level
                                </label>
                                <select
                                    className="premium-input w-full bg-black/20"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 mb-2 text-sm opacity-70">
                                    <Clock size={16} /> Hours / Week
                                </label>
                                <input
                                    className="premium-input w-full"
                                    type="number"
                                    min="1"
                                    max="168"
                                    value={hours}
                                    onChange={(e) => setHours(parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <Sparkles size={20} />
                            )}
                            {isLoading ? "Analyzing & Generating..." : "Generate Personalized Roadmap"}
                        </button>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    </form>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
                    <section>
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="flex items-center gap-4 m-0 text-2xl font-bold">
                                Your Path: <span className="text-[var(--secondary)]">{goal}</span>
                            </h2>
                            <button
                                onClick={() => setRoadmap(null)}
                                className="text-[var(--primary)] hover:underline text-sm font-medium bg-transparent border-none cursor-pointer"
                            >
                                Generate New Path
                            </button>
                        </div>
                        <Roadmap steps={roadmap.map((s, i) => ({ ...s, status: i === 0 ? "current" : "upcoming" }))} />
                    </section>

                    <aside>
                        <Card className="sticky top-24">
                            <h3 className="mb-6 text-lg font-bold flex items-center gap-2">
                                <Sparkles size={18} className="text-[var(--secondary)]" /> Strategy Summary
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="text-sm leading-relaxed opacity-80">
                                    This {roadmap.length}-step roadmap is optimized for your <strong>{level}</strong> level, focusing on <strong>{goal}</strong> with a commitment of <strong>{hours} hours/week</strong>.
                                </div>
                                <div className="h-px bg-[var(--glass-border)]" />
                                <div>
                                    <h4 className="text-xs font-bold mb-2 opacity-60 uppercase tracking-wider">ESTIMATED COMPLETION</h4>
                                    <p className="text-lg font-bold">{Math.ceil(roadmap.length * 2)} - {Math.ceil(roadmap.length * 3)} Months</p>
                                </div>
                                <button className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                                    <Save size={18} /> Save to Collection
                                </button>
                            </div>
                        </Card>
                    </aside>
                </div>
            )}
        </div>
    );
}
