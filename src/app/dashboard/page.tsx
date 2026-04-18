import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Files } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/Card";
import LoginView from "@/components/LoginView";

export default async function Dashboard() {
    const session = await auth();

    if (!session) {
        return <LoginView />;
    }

    // Fetch collections
    const collections = session?.user
        ? await prisma.collection.findMany({
            where: { userId: session.user.id },
            include: { _count: { select: { flashcards: true, summaries: true, examQuestions: true } } }
        })
        : [];

    // Calculate stats
    const totalFlashcards = collections.reduce((acc, c) => acc + c._count.flashcards, 0);
    const totalSummaries = collections.reduce((acc, c) => acc + c._count.summaries, 0);

    return (
        <div className="flex min-h-[calc(100vh-80px)]">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-12 md:pt-0">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, <span className="text-gradient">{session?.user?.name?.split(" ")[0] || "Scholar"}</span></h1>
                        <p className="opacity-60">What would you like to learn today?</p>
                    </div>
                    <Card className="px-6 py-2 rounded-full flex items-center gap-2" hoverEffect={false}>
                        <span className="text-[var(--accent)] font-bold">{session?.user?.plan || "FREE"}</span> Plan
                    </Card>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Stats Card */}
                    <Card className="flex flex-col justify-center">
                        <h4 className="text-xl font-bold mb-4">Learning Stats</h4>
                        <div className="flex justify-between items-center opacity-80 mb-2">
                            <span>Flashcards</span>
                            <strong className="text-xl">{totalFlashcards}</strong>
                        </div>
                        <div className="flex justify-between items-center opacity-80">
                            <span>Summaries</span>
                            <strong className="text-xl">{totalSummaries}</strong>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Link href="/flashcards">
                        <Card className="flex items-center gap-4 border-dashed border-[var(--primary)] hover:border-solid group h-full">
                            <div className="bg-[var(--primary-glow)] p-4 rounded-xl text-[var(--primary)] group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold m-0">Create Flashcards</h4>
                                <p className="text-sm opacity-60 m-0">AI-powered active recall</p>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/summaries">
                        <Card className="flex items-center gap-4 border-dashed border-[var(--secondary)] hover:border-solid group h-full">
                            <div className="bg-[var(--secondary-glow)] p-4 rounded-xl text-[var(--secondary)] group-hover:scale-110 transition-transform">
                                <Files size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold m-0">New Summary</h4>
                                <p className="text-sm opacity-60 m-0">Condense study material</p>
                            </div>
                        </Card>
                    </Link>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        🚀 Quick Start Guide
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-6 bg-gradient-to-br from-[var(--primary-glow)] to-transparent border-[var(--primary)]/20" hoverEffect={false}>
                            <h4 className="font-bold mb-2">🎓 For Students</h4>
                            <p className="text-sm opacity-70">Upload your PDF or paste lecture notes to generate instant flashcards.</p>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-[var(--secondary-glow)] to-transparent border-[var(--secondary)]/20" hoverEffect={false}>
                            <h4 className="font-bold mb-2">💼 For Work</h4>
                            <p className="text-sm opacity-70">Paste meeting transcripts or reports to get a high-level executive summary.</p>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent border-[var(--glass-border)]" hoverEffect={false}>
                            <h4 className="font-bold mb-2">🏠 For Home</h4>
                            <p className="text-sm opacity-70">Type in a new hobby or goal to generate a structured AI learning roadmap.</p>
                        </Card>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6">Recent Collections</h2>
                    {collections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collections.map((col) => (
                                <Link href={`/dashboard/collections/${col.id}`} key={col.id}>
                                    <Card className="cursor-pointer hover:bg-[var(--card-border)]/10 transition-colors h-full">
                                        <h3 className="text-xl font-bold mb-2 truncate">{col.name}</h3>
                                        <p className="text-sm opacity-60 mb-4 line-clamp-2 min-h-[2.5em]">{col.description || "Study collection generated by StudyBoost AI"}</p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--glass-border)]">
                                                {col._count.flashcards} cards
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--glass-border)]">
                                                {col._count.summaries} summaries
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-16 border-dashed" hoverEffect={false}>
                            <p className="opacity-50 text-lg mb-4">No collections found. Start by generating some AI content!</p>
                            <Link href="/flashcards" className="btn-primary inline-flex items-center gap-2">
                                <BookOpen size={18} /> Generate Now
                            </Link>
                        </Card>
                    )}
                </section>
            </main>
        </div>
    );
}
