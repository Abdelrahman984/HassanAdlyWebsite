// API Service Layer
// ============================================================================
// CONNECT TO YOUR .NET BACKEND:
// ============================================================================
// Replace the mock implementations below with actual fetch calls to your API.
//
// Example .NET API structure:
// GET  /api/surahs                    → Returns all surahs
// GET  /api/qiraat                    → Returns all qira'at
// GET  /api/audio/{surahId}/{qiraaId} → Returns audio track URL and metadata
//
// Example implementation:
// const API_BASE_URL = 'https://your-backend-api.com/api';
//
// async getSurahs() {
//   const response = await fetch(`${API_BASE_URL}/surahs`);
//   return response.json();
// }
// ============================================================================

import { surahs } from "../data/surahs";
import { qiraat } from "../data/qiraat";

export interface AudioTrack {
  surahId: number;
  surahName: string;
  qiraaId: number;
  qiraaName: string;
  audioUrl: string;
  duration: number; // in seconds
}

// Mock audio URLs - replace with actual backend URLs
const generateMockAudioUrl = (surahId: number, qiraaId: number): string => {
  // TODO: Replace with your .NET backend endpoint
  // return `https://your-api.com/api/audio/${surahId}/${qiraaId}`;
  return "/audio/alhaqah.mp3";
};

const generateMockDuration = (surahId: number): number => {
  const surah = surahs.find((s) => s.id === surahId);
  return surah ? surah.verses * 15 : 300; // Mock: ~15 seconds per verse
};

export const apiService = {
  // Fetch all surahs
  async getSurahs() {
    // TODO: Replace with actual API call
    // const response = await fetch('https://your-api.com/api/surahs');
    // return response.json();
    return Promise.resolve(surahs);
  },

  // Fetch all qira'at
  async getQiraat() {
    // TODO: Replace with actual API call
    // const response = await fetch('https://your-api.com/api/qiraat');
    // return response.json();
    return Promise.resolve(qiraat);
  },

  // Fetch audio URL for specific surah and qira'a
  async getAudioTrack(surahId: number, qiraaId: number): Promise<AudioTrack> {
    // TODO: Replace with actual API call
    // const response = await fetch(`https://your-api.com/api/audio/${surahId}/${qiraaId}`);
    // return response.json();

    const surah = surahs.find((s) => s.id === surahId);
    const qiraa = qiraat.find((q) => q.id === qiraaId);

    return Promise.resolve({
      surahId,
      surahName: surah?.nameArabic || "",
      qiraaId,
      qiraaName: qiraa?.nameArabic || "",
      audioUrl: generateMockAudioUrl(surahId, qiraaId),
      duration: 0,
    });
  },
};
