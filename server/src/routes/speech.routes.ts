import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../controllers/speech.controller';

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// POST /api/speech/transcribe - Transcribe audio to text
router.post('/transcribe', upload.single('audio'), transcribeAudio);

export default router; 