
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTeamNames = async (count: number, theme: string = "Professional and Creative"): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} creative team names based on the theme: ${theme}. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const result = JSON.parse(response.text || '[]');
    return result;
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};
