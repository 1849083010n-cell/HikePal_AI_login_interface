import { GoogleGenAI } from "@google/genai";

// Helper to safely access env vars
const getEnvVar = (key: string) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || '';
    }
  } catch (e) {
    console.warn('Error reading env var:', key);
  }
  return '';
};

// 在 Vite 前端项目中，我们使用 import.meta.env.VITE_GOOGLE_API_KEY
// 而不是 process.env.API_KEY (后者通常用于 Node.js 后端)
const apiKey = getEnvVar('VITE_GOOGLE_API_KEY');

// 只有当 apiKey 存在时才初始化
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getHikingRecommendation = async (userQuery: string, location: string = 'Hong Kong') => {
  if (!ai) {
    console.warn("Gemini API Key missing");
    return "AI features are currently unavailable. Please check your API key configuration.";
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
    return "I'm having trouble connecting to the hiking database (AI) right now. Please check your connection.";
  }
};