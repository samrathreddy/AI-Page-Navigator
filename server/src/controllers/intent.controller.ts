import { Request, Response } from 'express';
import { analyzeUserIntent } from '../utils/openai';

// Define the expected request body type
interface AnalyzeIntentRequest {
  text: string;
  pages: Array<{
    id: string;
    name: string;
    path: string;
    keywords: string[];
    description?: string;
  }>;
  currentPageId?: string; // Optional current page ID
}

/**
 * Analyzes text to determine user's intent
 * @route POST /api/intent/analyze
 */
export const analyzeIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, pages, currentPageId } = req.body as AnalyzeIntentRequest;

    // Validate request
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      res.status(400).json({ error: 'Valid pages array is required' });
      return;
    }

    // Analyze intent using OpenAI
    const intentResult = await analyzeUserIntent(text, pages, currentPageId);
    
    if (!intentResult) {
      res.status(200).json({ 
        success: true, 
        hasMatch: false,
        matchedPage: null,
        intentType: null,
        productAction: null,
        contactFormAction: null
      });
      return;
    }

    if (intentResult.type === 'navigation' && intentResult.page) {
      // Return navigation intent
      res.status(200).json({ 
        success: true, 
        hasMatch: true,
        matchedPage: intentResult.page,
        intentType: 'navigation',
        productAction: null,
        contactFormAction: null
      });
    } else if (intentResult.type === 'product-action' && intentResult.productAction) {
      // Return product action intent
      res.status(200).json({ 
        success: true, 
        hasMatch: true,
        matchedPage: null,
        intentType: 'product-action',
        productAction: intentResult.productAction,
        contactFormAction: null
      });
    } else if (intentResult.type === 'contact-form-action' && intentResult.contactFormAction) {
      // Return contact form action intent
      res.status(200).json({ 
        success: true, 
        hasMatch: true,
        matchedPage: null,
        intentType: 'contact-form-action',
        productAction: null,
        contactFormAction: intentResult.contactFormAction
      });
    } else {
      res.status(200).json({ 
        success: true, 
        hasMatch: false,
        matchedPage: null,
        intentType: null,
        productAction: null,
        contactFormAction: null
      });
    }
  } catch (error) {
    console.error('Error in analyzeIntent controller:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to analyze intent', 
      details: errorMessage
    });
  }
}; 