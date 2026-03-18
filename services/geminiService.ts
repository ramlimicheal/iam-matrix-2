import { GoogleGenAI } from "@google/genai";
import { WEAVER_SYSTEM_INSTRUCTION } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWeaverSuggestion = async (
  context: string,
  userQuery: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key missing. Please check configuration.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: The user is working on their Matrix. ${context}\n\nUser Request: ${userQuery}`,
      config: {
        systemInstruction: WEAVER_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "The Weaver remains silent (No response generated).";
  } catch (error) {
    console.error("Weaver Error:", error);
    return "The Weaver is currently disconnected. Please try again later.";
  }
};
