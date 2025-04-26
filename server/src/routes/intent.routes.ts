import express from 'express';
import { analyzeIntent } from '../controllers/intent.controller';

const router = express.Router();

// POST /api/intent/analyze - Analyze text to determine user's intent
router.post('/analyze', analyzeIntent);

export default router; 