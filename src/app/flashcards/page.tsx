import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FlashcardsClient from "@/components/FlashcardsClient";

export default async function FlashcardsPage() {
    const session = await auth();

    if (!session) {
        redirect("/api/auth/signin");
    }

    const collectionsData = await prisma.collection.findMany({
        where: { userId: session.user.id },
        include: { _count: { select: { flashcards: true } } },
        orderBy: { createdAt: 'desc' }
    });

    const collections = collectionsData.map(col => ({
        ...col,
        createdAt: col.createdAt.toISOString(),
        _count: { flashcards: col._count.flashcards }
    }));

    return (
        <div className="flex min-h-[calc(100vh-80px)]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <FlashcardsClient collections={collections} />
            </main>
        </div>
    );
}
