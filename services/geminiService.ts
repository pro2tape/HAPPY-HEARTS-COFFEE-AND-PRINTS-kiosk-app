import { GoogleGenAI } from "@google/genai";
import { MenuItem } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getRecommendation = async (mood: string, menu: MenuItem[]): Promise<string> => {
  if (!API_KEY) {
    return "I recommend a classic Iced Coffee. (AI Key missing)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const menuNames = menu.map(m => m.name).join(", ");
    
    const prompt = `
      You are a friendly barista at "Happy Hearts Coffee". 
      The customer is feeling: "${mood}".
      Our menu includes: ${menuNames}.
      
      Recommend ONE item from the menu that fits their mood. 
      Keep it short, sweet, and fun (max 2 sentences). 
      Format: "I recommend the [Item Name] because [reason]."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "How about a refreshing Fruit Soda?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'd recommend our best-seller, the Halo-Halo!";
  }
};