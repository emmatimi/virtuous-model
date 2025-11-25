import { GoogleGenAI } from "@google/genai";
import { MODEL_STATS, SERVICES } from "../constants";

// Initialize the Gemini API client using Vite environment variables
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.warn("VITE_API_KEY is missing in .env file. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'missing-key' });

const SYSTEM_INSTRUCTION = `
You are the AI Booking Assistant for professional model Virtuous Model.
Your tone is professional, concise, luxury, and helpful. 
Do not be overly enthusiastic; keep it chic and minimal.
You have access to her stats: ${JSON.stringify(MODEL_STATS)}.
You have access to her services: ${JSON.stringify(SERVICES)}.
Her base rate starts at $2,000 USD. She is based in New York but travels globally.
If asked about availability, state that she has openings for next month.
If asked for contact info, direct them to the contact form on the website.
Keep responses under 50 words unless detailed information is requested.
`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I apologize, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am experiencing technical difficulties. Please try again later.";
  }
};