"use server";

import { generateFlashcards, generateSummary, generateRoadmap } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function ensureUserExists(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error("User record not found. Please log out and log back in to refresh your account.");
    }
    return user;
}

export async function createFlashcardsAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await ensureUserExists(session.user.id);

        const topic = formData.get("topic") as string;
        const count = parseInt(formData.get("count") as string) || 5;

        const cards = await generateFlashcards(topic, count);

        let collection = await prisma.collection.findFirst({
            where: { userId: session.user.id, name: topic },
        });

        if (!collection) {
            collection = await prisma.collection.create({
                data: {
                    name: topic,
                    userId: session.user.id,
                },
            });
        }

        await prisma.flashcard.createMany({
            data: cards.map((card: any) => ({
                front: card.front,
                back: card.back,
                collectionId: collection!.id,
            })),
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Flashcard generation error:", error);
        return { success: false, error: error.message || "Failed to generate flashcards" };
    }
}

export async function createSummaryAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await ensureUserExists(session.user.id);

        const content = formData.get("content") as string;

        const summary = await generateSummary(content);

        await prisma.summary.create({
            data: {
                title: summary.title,
                content: summary.content,
                sourceText: content,
                collection: {
                    create: {
                        name: summary.title,
                        userId: session.user.id,
                    }
                }
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Summary generation error:", error);
        return { success: false, error: error.message || "Failed to generate summary" };
    }
}

export async function generateRoadmapAction(goal: string, level: string, hoursPerWeek: number) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const roadmap = await generateRoadmap(goal, level, hoursPerWeek);
        return { success: true, data: roadmap };
    } catch (error: any) {
        console.error("Roadmap generation error:", error);
        return { success: false, error: error.message || "Failed to generate roadmap" };
    }
}

