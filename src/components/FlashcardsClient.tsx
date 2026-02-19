"use client";

import { useState } from "react";
import CreateFlashcardModal from "./CreateFlashcardModal";
import { Plus, BookOpen, Layers } from "lucide-react";
import { Card } from "@/components/Card";

export default function FlashcardsClient({ collections }: { collections: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">My Flashcards</h1>
                    <p className="opacity-60">Manage your study collections and create new ones.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} /> New Collection
                </button>
            </header>

            <CreateFlashcardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {collections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col) => (
                        <Card key={col.id} className="group cursor-pointer hover:border-[var(--primary)] transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-lg bg-[var(--primary-glow)] text-[var(--primary)]">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xs font-mono opacity-50 bg-[var(--card-border)] px-2 py-1 rounded">
                                    {new Date(col.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-1">{col.name}</h3>
                            <div className="flex items-center gap-2 text-sm opacity-60">
                                <Layers size={16} />
                                <span>{col._count.flashcards} cards</span>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-20 border-dashed flex flex-col items-center justify-center" hoverEffect={false}>
                    <div className="p-4 rounded-full bg-[var(--card-border)] mb-4 opacity-50">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No flashcards yet</h3>
                    <p className="opacity-60 max-w-sm mx-auto mb-6">Create your first AI-generated flashcard deck to start studying smarter.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        Create First Deck
                    </button>
                </Card>
            )}
        </div>
    );
}
