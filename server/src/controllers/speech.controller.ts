import { Request, Response } from 'express';
import { deepgramTranscribe } from '../utils/deepgram';

/**
 * Transcribes audio using Deepgram API
 * @route POST /api/speech/transcribe
 */
export const transcribeAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file provided' });
      return;
    }

    // Get audio file from request
    const audioBuffer = req.file.buffer;
    
    // Transcribe using Deepgram
    const transcript = await deepgramTranscribe(audioBuffer);
    
    res.status(200).json({ success: true, transcript });
  } catch (error) {
    console.error('Error in transcribeAudio controller:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to transcribe audio', 
      details: errorMessage
    });
  }
}; 