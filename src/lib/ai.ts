import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function handleAIRequest(modelName: string, prompt: string, errorPrefix: string) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const cleanedJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanedJson);
        } catch (error: any) {
            console.error(`${errorPrefix} Parsing Failed:`, text);
            throw new Error(`${errorPrefix} Failed: Invalid response format from AI.`);
        }
    } catch (error: any) {
        if (error.message?.includes("429") || error.status === 429) {
            throw new Error("AI Quota Exceeded: You've reached the free tier limit. Please wait a minute before trying again.");
        }
        console.error(`${errorPrefix} Request Failed:`, error);
        throw error;
    }
}

export async function generateFlashcards(topic: string, count: number = 5) {
    const prompt = `Generate ${count} educational flashcards about "${topic}". 
  Return the result as a JSON array of objects with "front" and "back" properties.
  Example: [{"front": "What is photosynthesis?", "back": "The process by which plants use sunlight to synthesize nutrients from CO2 and water."}]`;

    return handleAIRequest("gemini-flash-latest", prompt, "AI Flashcard Generation");
}

export async function generateSummary(content: string) {
    const prompt = `Summarize the following educational content in a concise, professional manner. 
  Focus on key learning points. Return a JSON object with "title" and "content" properties.
  
  Content: ${content}`;

    return handleAIRequest("gemini-flash-latest", prompt, "AI Summary Generation");
}

export async function generateExamQuestions(topic: string, count: number = 3) {
    const prompt = `Generate ${count} multiple-choice exam questions about "${topic}". 
  Return the result as a JSON array of objects with "question", "options" (array of 4 strings), "correctAnswer", and "explanation" properties.
  
  Example: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..."}]`;

    return handleAIRequest("gemini-flash-latest", prompt, "AI Exam Question Generation");
}

export async function generateRoadmap(goal: string, level: string, hours: number) {
    const prompt = `Act as an expert career coach. Generate a personalized learning roadmap for a student with the following details:
  - Goal: ${goal}
  - Current Level: ${level}
  - Time Availability: ${hours} hours per week
  
  The roadmap should be an "AI-powered career roadmap platform for serious learners".
  
  Return the result as a JSON array of objects with the following properties:
  "id" (string), "title" (string), "description" (string), "status" (always "upcoming").
  
  Generate exactly 5-7 meaningful steps. Make the descriptions actionable and serious.
  
  Example: [{"id": "1", "title": "...", "description": "...", "status": "upcoming"}]`;

    return handleAIRequest("gemini-flash-latest", prompt, "AI Roadmap Generation");
}
