import { GoogleGenAI } from "@google/genai";

// Initialize the API client
const getAiClient = () => {
    // In a real production app, you might proxy this or handle keys differently.
    // Assuming process.env.API_KEY is available as per instructions.
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found in environment.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateComfortingMessage = async (deceasedName: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "May peace and blessings be upon them.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a short, comforting, and respectful Islamic condolence message and a brief Dua (supplication) in English for the deceased named "${deceasedName}". Keep it under 60 words. Tone: Serene, hopeful, respectful.`,
        });
        
        return response.text || "May Allah grant them the highest level of Paradise.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "May Allah grant them peace and patience to the family.";
    }
};

export const generateSharingMessage = async (deceasedName: string, completedPercentage: number, link: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return `Join us in reciting the Quran for ${deceasedName}. ${link}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Draft a short WhatsApp message inviting people to recite a Juz of the Quran for "${deceasedName}". 
            Current progress is ${completedPercentage}%. 
            Include the link: ${link}. 
            Use emojis appropriate for the context (e.g., 🤲, 🕌).`,
        });
        
        return response.text || `Please join us in completing the Quran for ${deceasedName}. Link: ${link}`;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return `Please join us in completing the Quran for ${deceasedName}. Link: ${link}`;
    }
};