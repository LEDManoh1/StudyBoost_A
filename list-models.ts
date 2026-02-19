import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy call to trigger internal versioning maybe
        // Actually the SDK has a listModels method
        // @ts-ignore
        const models = await genAI.listModels();
        console.log(JSON.stringify(models, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
