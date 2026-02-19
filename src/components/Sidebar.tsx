"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Files, GraduationCap, LayoutDashboard, Map as LucideMap, Menu, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/roadmaps", icon: LucideMap, label: "Roadmaps" },
        { href: "/flashcards", icon: BookOpen, label: "AI Flashcards" },
        { href: "/summaries", icon: Files, label: "Smart Summary" },
        { href: "/exam-questions", icon: GraduationCap, label: "Exam Prep" },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--card)] border border-[var(--glass-border)] md:hidden text-[var(--foreground)]"
                aria-label="Toggle Sidebar"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen w-72 
          bg-[var(--background)] border-r border-[var(--glass-border)] 
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-auto md:min-h-[calc(100vh-80px)]
          flex flex-col p-4 pt-20 md:pt-8 bg-opacity-95 md:bg-opacity-100
        `}
            >
                <div className="flex flex-col gap-2 flex-1">
                    <div className="mb-6 px-4 md:hidden">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">StudyBoost AI</h2>
                    </div>

                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? "bg-[rgba(255,255,255,0.05)] text-[var(--primary)] border border-[var(--glass-border)]"
                                        : "hover:bg-[rgba(255,255,255,0.03)] opacity-80 hover:opacity-100"
                                    }
                `}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pt-4 border-t border-[var(--glass-border)]">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
