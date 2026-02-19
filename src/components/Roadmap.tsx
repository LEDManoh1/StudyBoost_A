"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";

interface RoadmapStep {
    id: string;
    title: string;
    description: string;
    status: "completed" | "current" | "upcoming";
}

interface RoadmapProps {
    steps: RoadmapStep[];
}

export default function Roadmap({ steps }: RoadmapProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
            {/* Connection Line */}
            <div style={{
                position: 'absolute',
                left: '20px',
                top: '20px',
                bottom: '20px',
                width: '2px',
                background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
                opacity: 0.3,
                zIndex: 0
            }} />

            {steps.map((step, index) => (
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: step.status === "completed" ? 'var(--primary)' : step.status === "current" ? 'var(--secondary)' : 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: step.status === "current" ? '0 0 15px var(--secondary-glow)' : 'none',
                        border: '2px solid' + (step.status === "upcoming" ? 'rgba(255,255,255,0.2)' : 'transparent')
                    }}>
                        {step.status === "completed" ? (
                            <CheckCircle2 size={24} color="white" />
                        ) : step.status === "current" ? (
                            <ArrowRight size={24} color="white" />
                        ) : (
                            <Circle size={20} color="rgba(255,255,255,0.4)" />
                        )}
                    </div>

                    <Card
                        className={`flex-1 p-6 ${step.status === "current" ? "bg-white/10" : "bg-white/5"} ${step.status === "current" ? "border-l-4 border-l-[var(--secondary)]" : "border-l border-l-[var(--glass-border)]"}`}
                        hoverEffect={true}
                    >
                        <h3 className={`m-0 text-xl font-bold ${step.status === "upcoming" ? "opacity-60" : "text-white"}`}>
                            {step.title}
                        </h3>
                        <p className="mt-2 opacity-60 text-sm">
                            {step.description}
                        </p>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
