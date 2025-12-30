
import { AIResult } from "./services/aiService";

export interface MusicMetadata {
  id: string;
  title: string;
  style: string;
  mood: string;
  lyrics: string;
  detailedPrompt: string;
  bpm: number;
  duration: string;
  audioUrl?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  isFavorite?: boolean;
  // Added for library restoration
  settings?: GenerationSettings;
  aiResult?: AIResult;
}

export interface GenerationSettings {
  description: string;
  genres: string[];
  subGenres: string[];
  musicType: 'vocal' | 'instrumental';
  vocalType: string;
  vocalGender: string;
  tempo: number;
  mood: string[]; 
  instruments: string[];
  language: string;
  aiModel: string;
  negativeElements: string[];
  additionalRequests: string;
  generationCount: number;
  savePath: string;
  // New structure flags
  includeIntro: boolean;
  includeOutro: boolean;
}
