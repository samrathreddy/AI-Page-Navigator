// Deepgram API integration for speech recognition
// API key is read from environment variables
const DEEPGRAM_API_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY || '';

// Since we can't directly install the Deepgram SDK due to npm permission issues,
// we'll implement a direct API integration using fetch

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
 * @param audioBlob - The audio blob to transcribe
 * @returns The transcribed text
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Check if API key is provided
    if (!DEEPGRAM_API_KEY) {
      throw new Error("Deepgram API key not provided in environment variables");
    }

    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('https://api.deepgram.com/v1/listen?language=en-US&model=nova-2&detect_language=false', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      },
      body: audioBlob
    });

    if (!response.ok) {
      throw new Error(`Deepgram API request failed with status ${response.status}`);
    }

    const data = await response.json() as DeepgramResponse;
    
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

// Function to check if Deepgram can be used (API key is set)
export const canUseDeepgram = (): boolean => {
  return !!DEEPGRAM_API_KEY;
};

export default {
  transcribeAudio,
  canUseDeepgram
}; 