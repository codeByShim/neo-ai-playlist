
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationSettings, MusicMetadata } from "../types";

export const generateMusicPrompts = async (settings: GenerationSettings): Promise<Partial<MusicMetadata>[]> => {
  // Always use new GoogleGenAI({apiKey: process.env.API_KEY})
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Fixed property names: generationCount instead of count, description instead of prompt, and genres instead of genre
  const prompt = `
    Act as a professional music producer and lyricist. 
    Based on these settings, generate ${settings.generationCount} unique song concepts.
    
    Settings:
    - User Prompt: ${settings.description}
    - Genre: ${settings.genres.join(', ')}
    - Mood: ${settings.mood}
    - Language: ${settings.language}
    - Vocal Type: ${settings.vocalType} (${settings.vocalGender})
    
    For each concept, provide:
    1. A creative title.
    2. A detailed style description (instruments, rhythm, texture).
    3. Meaningful lyrics (if vocal) or musical structure description (if instrumental).
    4. A condensed "detailedPrompt" for an AI music engine.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              style: { type: Type.STRING },
              lyrics: { type: Type.STRING },
              detailedPrompt: { type: Type.STRING },
              mood: { type: Type.STRING }
            },
            required: ["title", "style", "lyrics", "detailedPrompt", "mood"]
          }
        }
      }
    });

    // Directly access .text property as per SDK documentation
    const result = JSON.parse(response.text || "[]");
    return result.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      // Using correct property 'tempo' from GenerationSettings
      bpm: settings.tempo,
      duration: "03:15",
      status: 'pending',
      createdAt: Date.now()
    }));
  } catch (error) {
    console.error("Gemini generation failed:", error);
    throw error;
  }
};
