import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: This relies on process.env.API_KEY being present
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getHikingRecommendation = async (userQuery: string, location: string = 'Hong Kong') => {
  if (!process.env.API_KEY) {
    return "AI features require an API Key. Please configure your environment.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are an expert hiking guide for ${location}.
      The user asks: "${userQuery}".
      
      Provide a concise, enthusiastic, and safe hiking recommendation. 
      Include:
      1. Trail Name
      2. Difficulty (1-5)
      3. Estimated Time
      4. One key highlight (e.g., view, history).
      
      Keep it under 150 words. Format with markdown.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Sorry, I couldn't find a trail for you right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the hiking database (AI) right now.";
  }
};
