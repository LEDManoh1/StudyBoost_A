import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/Card";
import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CollectionDetailsPage({ params }: PageProps) {
    const session = await auth();
    if (!session?.user?.id) return null; // Or redirect to login

    const { id } = await params;

    const collection = await prisma.collection.findUnique({
        where: {
            id,
            userId: session.user.id,
        },
        include: {
            flashcards: true,
            summaries: true,
            examQuestions: true,
        },
    });

    if (!collection) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-6 w-fit"
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <header className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient">{collection.name}</h1>
                    <span className="text-sm opacity-50 flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full w-fit">
                        <Calendar size={14} />
                        {new Date(collection.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                {collection.description && (
                    <p className="text-lg opacity-70 max-w-3xl">{collection.description}</p>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Flashcards Section */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen className="text-[var(--primary)]" /> Flashcards
                        <span className="text-sm font-normal opacity-50 ml-auto">{collection.flashcards.length} cards</span>
                    </h2>

                    {collection.flashcards.length > 0 ? (
                        <div className="grid gap-4">
                            {collection.flashcards.map((card) => (
                                <Card key={card.id} className="p-6" hoverEffect={true}>
                                    <h3 className="font-semibold text-lg mb-3 pb-3 border-b border-[var(--glass-border)] text-[var(--primary)]">
                                        Q: {card.front}
                                    </h3>
                                    <p className="opacity-80 leading-relaxed">
                                        A: {card.back}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12 border-dashed opacity-70" hoverEffect={false}>
                            <p>No flashcards in this collection.</p>
                        </Card>
                    )}
                </section>

                {/* Summaries Section */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="text-[var(--secondary)]" /> Summaries
                        <span className="text-sm font-normal opacity-50 ml-auto">{collection.summaries.length} items</span>
                    </h2>

                    {collection.summaries.length > 0 ? (
                        <div className="grid gap-4">
                            {collection.summaries.map((summary) => (
                                <Card key={summary.id} className="p-6" hoverEffect={true}>
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap">{summary.content}</div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex justify-between items-center text-xs opacity-50">
                                        <span>Source Type: {summary.sourceType}</span>
                                        <span>{new Date(summary.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12 border-dashed opacity-70" hoverEffect={false}>
                            <p>No summaries in this collection.</p>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
}
