import { GoogleGenAI } from "@google/genai";

// 安全获取 API Key
const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_API_KEY || '';
  }
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env.VITE_GOOGLE_API_KEY || process.env.API_KEY || '';
    }
  } catch (e) {}
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const getHikingRecommendation = async (userQuery: string, location: string = 'Hong Kong') => {
  if (!apiKey) {
    console.warn("Missing Gemini API Key. Please set VITE_GOOGLE_API_KEY in your .env file.");
    return "AI features require an API Key. Please configure your environment variables.";
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