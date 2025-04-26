/**
 * Deepgram API integration for speech recognition
 */
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Get API key from environment
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
console.log("DEEPGRAM_API_KEY presence:", DEEPGRAM_API_KEY ? "API key is set" : "API key is missing");

interface DeepgramResponse {
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
      }>;
    }>;
  };
}

/**
 * Transcribes audio using Deepgram API
 * @param audioBuffer - The audio buffer to transcribe
 * @returns The transcribed text
 */
export const deepgramTranscribe = async (audioBuffer: Buffer): Promise<string> => {
  try {
    // Check if API key is provided
    if (!DEEPGRAM_API_KEY) {
      throw new Error("Deepgram API key not provided in environment variables");
    }

    // Convert buffer to blob for fetch API
    const response = await fetch('https://api.deepgram.com/v1/listen?language=en-US&model=nova-2&detect_language=false', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/octet-stream'
      },
      body: audioBuffer
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepgram API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json() as DeepgramResponse;
    console.log("Deepgram response:", data);
    
    if (data.results?.channels[0]?.alternatives[0]?.transcript) {
      return data.results.channels[0].alternatives[0].transcript;
    } else {
      throw new Error("No transcript found in Deepgram response");
    }
  } catch (error) {
    console.error('Error transcribing audio with Deepgram:', error);
    throw error;
  }
}; 