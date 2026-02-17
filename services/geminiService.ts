import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

export const startChat = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatSession = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    startChat();
  }
  
  if (!chatSession) throw new Error("Failed to initialize chat session");

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un error de conexión. Por favor intenta de nuevo.";
  }
};