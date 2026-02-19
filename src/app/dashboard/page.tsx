import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Files, GraduationCap, LayoutDashboard, Map as LucideMap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/Card";

export default async function Dashboard() {
    const session = await auth();

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Access Denied</h2>
                <Card className="w-full max-w-md p-8">
                    <p className="text-lg opacity-70 mb-8">Please sign in to view your dashboard, statistics, and study collections.</p>
                    <form action={async () => {
                        "use server";
                        await (signIn as any)("google");
                    }}>
                        <button type="submit" className="btn-primary w-full text-lg py-4">
                            Sign in with Google
                        </button>
                    </form>
                </Card>
            </div>
        );
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
