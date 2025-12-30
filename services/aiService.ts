
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationSettings } from "../types";

export interface AIResult {
  titles: string[];
  detailedPrompt: string;
  lyrics: string;
  recommendedGender: string;
  imagePrompt: string; // Right-side version for thumbnails
  imagePromptCenter: string; // Center-composed version
}

/**
 * AI 분석 결과를 UI 설정값에 맞게 정제하고 타입을 강제합니다.
 */
export const analyzeDescription = async (description: string, apiSettings: any): Promise<Partial<GenerationSettings>> => {
  const { selectedModel, geminiKey, openaiKey } = apiSettings;
  
  const systemPrompt = `
    Extract music production parameters from: "${description}"
    
    Guidelines:
    - vocalType: Must be one of ["맑음", "거친", "부드러움", "파워풀", "소프트", "숨소리"]
    - mood: Array of strings from ["행복한", "슬픈", "에너제틱", "차분한", "로맨틱", "우울한", "밝은", "어두운", "향수", "몽환적", "공격적", "평화로운"]
    - negativeElements: Array of strings from ["허밍 (humming)", "긴 인트로 (long intro)", "긴 아웃트로 (long outro)", "보컬라이즈 (vocalise)", "박수 소리 (clapping)", "휘파람 (whistling)", "오토튠 (auto-tune)"]
    - musicType: "vocal" or "instrumental"
    
    Output JSON format only.
  `;

  try {
    if (selectedModel === 'gemini') {
      const key = geminiKey || process.env.API_KEY;
      if (!key) throw new Error("API Key missing");
      
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              genres: { type: Type.ARRAY, items: { type: Type.STRING } },
              subGenres: { type: Type.ARRAY, items: { type: Type.STRING } },
              musicType: { type: Type.STRING },
              vocalType: { type: Type.STRING },
              vocalGender: { type: Type.STRING },
              tempo: { type: Type.INTEGER },
              mood: { type: Type.ARRAY, items: { type: Type.STRING } },
              instruments: { type: Type.ARRAY, items: { type: Type.STRING } },
              language: { type: Type.STRING },
              negativeElements: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      
      const parsed = JSON.parse(response.text || "{}");
      return {
        genres: Array.isArray(parsed.genres) ? parsed.genres : [],
        subGenres: Array.isArray(parsed.subGenres) ? parsed.subGenres : [],
        musicType: parsed.musicType === 'instrumental' ? 'instrumental' : 'vocal',
        vocalType: String(parsed.vocalType || ""),
        vocalGender: parsed.vocalGender || "",
        tempo: typeof parsed.tempo === 'number' ? Math.min(Math.max(parsed.tempo, 60), 180) : 120,
        mood: Array.isArray(parsed.mood) ? parsed.mood : [],
        instruments: Array.isArray(parsed.instruments) ? parsed.instruments : [],
        language: String(parsed.language || "English"),
        negativeElements: Array.isArray(parsed.negativeElements) ? parsed.negativeElements : []
      };
    } else {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: systemPrompt }],
          response_format: { type: "json_object" }
        })
      });
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    }
  } catch (error) {
    console.error("Analysis Failed:", error);
    return {};
  }
};

export const generateAIPrompt = async (settings: GenerationSettings, apiSettings: any): Promise<AIResult[]> => {
  const { selectedModel, geminiKey, openaiKey } = apiSettings;
  
  const systemPrompt = `
    Act as a professional music producer and hit songwriter specialized in Suno AI optimization, with a DEEP expertise in K-Trot and senior targeting. 
    Generate exactly ${settings.generationCount} different song concepts based on:
    - User Desc: ${settings.description}
    - Genre: ${settings.genres.join(', ')}
    - Mood: ${settings.mood.join(', ')}
    - Tempo: ${settings.tempo} BPM
    - Target Language: ${settings.language}
    - Structure Flags: 
      - Include [Intro]: ${settings.includeIntro ? "YES" : "STRICTLY NO"}
      - Include [Outro]: ${settings.includeOutro ? "YES" : "STRICTLY NO"}

    CRITICAL TROT LYRIC STRUCTURE (MANDATORY SEQUENCE):
    The core of the song MUST ALWAYS be generated without special effect tags like [Shout], [Laugh], [Sigh], [Gasp].
    STRICTLY FORBIDDEN: Do not include [Interlude] or any instrumental break markers in the lyrics.
    
    1. ${settings.includeIntro ? "[Intro]: Instrumental description (Accordion/Saxophone focus)." : "Skip to [Verse 1]."}
    2. [Verse 1]: Narrative introduction.
    3. [Pre-Chorus]: Emotional buildup.
    4. [Chorus]: Main hook/Title.
    5. [Verse 2]: Storytelling.
    6. [Chorus]: Repeat main hook.
    7. [Bridge]: Climax/Emotional turn.
    8. [Chorus]: Final powerful repetition.
    9. ${settings.includeOutro ? "[Outro]: Final lingering feel." : "End immediately after final [Chorus]."}

    CRITICAL IMAGE GENERATION STRATEGY (IMAGEFX):
    Generate highly stylized, hooking visual prompts optimized for YouTube thumbnails (16:9).
    
    MANDATORY STYLE:
    - "Hooking" composition: Intense facial expression, singing with passion, charismatic eye contact.
    - Glamorous Spotlights: Volumetric light beams, lens flares, dramatic stage lighting, shimmering atmosphere.
    - High Quality: 8k, photorealistic, cinematic bokeh, masterwork.
    - Aspect Ratio: Always include "Aspect ratio: 16:9".
    - NO NAMES: Never use specific names in the prompt.

    SINGER LOOK-ALIKE SELECTION:
    Based on the vocal gender, pick ONE singer from the list below and describe their PHYSICAL FEATURES, HAIRSTYLE, and AURA to create a "similar but not identical" appearance.
    
    MALE LIST: 임영웅, 영탁, 이찬원, 김호중, 정동원, 장민호, 김희재, 안성훈, 박지현, 진해성, 나상도, 최수호, 진욱, 박성온, 박서진, 신성, 민수현, 김용빈
    FEMALE LIST: 송가인, 정미애, 홍자, 김나희, 숙행, 정다경, 양지은, 홍지윤, 김다현, 김태연, 김연지, 은가은, 별사랑, 정서주, 배아현, 오유진, 미스김, 나영, 김소연, 정슬, 전유진, 빈예서, 강혜연, 윤태화

    FEMALE STAGE OUTFIT (MANDATORY):
    - Elegant female stage outfit inspired by Korean trot singers.
    - Sleeveless or short-sleeve fitted dress, waist-accentuated silhouette.
    - Knee-length or mini-length, luxurious fabric with subtle sheen.
    - Sequins, crystals, or light glitter details.
    - Clean V-neck or square neckline.
    - Refined feminine elegance.

    MALE STAGE OUTFIT:
    - Luxurious, high-end bespoke stage suit with subtle patterns or velvet textures.
    - Perfectly tailored for a clean, professional superstar look.

    The image prompts (imagePrompt, imagePromptCenter) must include these details, the specific outfit, and the dramatic spotlight effects.
    - imagePrompt: Character on the right side for YouTube thumbnail text space.
    - imagePromptCenter: Character centered.

    Output a JSON array of objects.
  `;

  try {
    if (selectedModel === 'gemini') {
      const key = geminiKey || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                detailedPrompt: { type: Type.STRING },
                lyrics: { type: Type.STRING },
                recommendedGender: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                imagePromptCenter: { type: Type.STRING }
              },
              required: ["titles", "detailedPrompt", "lyrics", "recommendedGender", "imagePrompt", "imagePromptCenter"]
            }
          }
        }
      });
      const parsed = JSON.parse(response.text || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } else {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: systemPrompt }],
          response_format: { type: "json_object" }
        })
      });
      const data = await response.json();
      const rawData = JSON.parse(data.choices[0].message.content);
      return Array.isArray(rawData.results) ? rawData.results : (rawData.concepts || []);
    }
  } catch (error) {
    console.error("Generation Failed:", error);
    throw error;
  }
};
