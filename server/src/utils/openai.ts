/**
 * OpenAI API integration for intent analysis
 */
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Get API key from environment
const apiKey = process.env.OPENAI_API_KEY;
console.log("OPENAI_API_KEY presence:", apiKey ? "API key is set" : "API key is missing");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey || '' // Provide empty string as fallback to avoid undefined
});

export interface Page {
  id: string;
  name: string;
  path: string;
  keywords: string[];
  description?: string;
}

export interface ProductAction {
  action: 'filter' | 'sort' | 'search' | 'clear';
  type?: string;
  value?: string;
}

export interface ContactFormAction {
  action: 'fill-field' | 'submit-form' | 'fill-multiple';
  field?: string;
  value?: string;
}

export interface IntentResult {
  type: 'navigation' | 'product-action' | 'contact-form-action';
  page?: Page;
  productAction?: ProductAction;
  contactFormAction?: ContactFormAction;
}

/**
 * Analyzes user text to determine which page they want to navigate to
 * @param userText - The text from the user's speech
 * @param availablePages - List of pages that the user can navigate to
 * @param currentPageId - The ID of the current page the user is on (optional)
 * @returns The page that best matches the user's request, or null if no match
 */
export const analyzeUserIntent = async (
  userText: string,
  availablePages: Page[],
  currentPageId?: string
): Promise<IntentResult | null> => {
  try {
    console.log("Current page ID received by server:", currentPageId);
    
    // First check for form submission intent regardless of current page
    const submissionIntent = await checkForFormSubmission(userText);
    if (submissionIntent) {
      console.log("Detected form submission intent");
      return {
        type: 'contact-form-action',
        contactFormAction: submissionIntent
      };
    }
    
    // Try to extract all form fields, regardless of current page
    // This gives priority to form filling intents from any page
    const multiFieldExtraction = await extractAllFormFields(userText);
    if (multiFieldExtraction && multiFieldExtraction.action === 'fill-multiple') {
      console.log("Extracted multiple form fields:", multiFieldExtraction);
      
      // If we're not on the contact page, include navigation info
      if (currentPageId !== 'contact') {
          return {
            type: 'contact-form-action',
            contactFormAction: multiFieldExtraction,
            page: availablePages.find(page => page.id === 'contact') || undefined
          };
      } else {
        // Already on contact page, just return the form action
          return {
            type: 'contact-form-action',
            contactFormAction: multiFieldExtraction
          };
      }
    }
      
    // Legacy handling for other cases
    if (currentPageId !== 'contact') {
      console.log("User is not on contact page - checking for form filling intent");
      // First check if this might be a contact form action when not on the contact page
      const contactFormResult = await checkForContactFormAction(userText, false);
      if (contactFormResult) {
        console.log("Detected contact form action while not on contact page");
        
        // Check for special marker value indicating generic "go to contact page" intent
        if (contactFormResult.action === 'fill-field' && 
            contactFormResult.field === 'name' && 
            contactFormResult.value === 'CONTACT_PAGE_NAVIGATION_INTENT') {
          
          console.log("Detected generic contact page navigation intent");
          // This is just a navigation intent, not actual form filling
          // Just return the page to navigate to
          return {
            type: 'navigation',
            page: availablePages.find(page => page.id === 'contact') || undefined
          };
      }
      
        // For normal form filling, return both the form action and page to navigate to
        return {
          type: 'contact-form-action',
          contactFormAction: contactFormResult,
          // Return the contact page object to trigger navigation
          page: availablePages.find(page => page.id === 'contact') || undefined
        };
      }
      }
      
    // If on contact page, use the older form field extraction method as fallback
    if (currentPageId === 'contact') {
      console.log("User is on contact page - checking for individual form fields");
      const contactFormResult = await checkForContactFormAction(userText, true);
      if (contactFormResult) {
        return {
          type: 'contact-form-action',
          contactFormAction: contactFormResult
        };
      }
    }

    // If not a contact form action, check for product action (when on products page)
    if (currentPageId === 'products') {
      const productActionResult = await checkForProductAction(userText);
      if (productActionResult) {
        return {
          type: 'product-action',
          productAction: productActionResult
        };
      }
    }

    // Then check if this is a product command from any page
    const productActionResult = await checkForProductAction(userText);
    if (productActionResult) {
      return {
        type: 'product-action',
        productAction: productActionResult
      };
    }

    // If not a product command, check for page navigation
    // Create a prompt for the OpenAI API
    const prompt = `
      I have a website with the following pages:
      ${availablePages.map(page => `- ${page.id}: ${page.name} (Keywords: ${page.keywords.join(', ')})`).join('\n')}
      
      The user said: "${userText}"
      
      Based on what the user said, which page should I navigate to? 
      Respond with just the ID of the most relevant page. Only respond with one of these exact IDs: ${availablePages.map(p => p.id).join(', ')}. If there is no relevant page, respond with "NONE".
    `;

    // Make API request to OpenAI
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that identifies which page a user wants to navigate to based on their speech. Respond ONLY with the page ID, nothing else.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      });

      console.log("Prompt sent to OpenAI:", prompt);
      console.log("OpenAI response:", response);
      
      if (!response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
        console.error("Invalid response format from OpenAI:", response);
        throw new Error("Invalid response format from OpenAI");
      }
      
      // Extract and clean the page ID from the response
      const rawContent = response.choices[0].message.content.trim();
      console.log("Raw content from OpenAI:", rawContent);
      
      // Extract just the ID by removing any extra text
      // First, check if it's an exact ID match
      const exactIdMatch = availablePages.find(p => p.id === rawContent);
      if (exactIdMatch) {
        console.log("Found exact ID match:", exactIdMatch.id);
        return {
          type: 'navigation',
          page: exactIdMatch
        };
      }
      
      // If not an exact match, try to extract the ID from the response
      // Look for any of our page IDs in the response
      for (const page of availablePages) {
        if (rawContent.includes(page.id)) {
          console.log("Found ID in response:", page.id);
          return {
            type: 'navigation',
            page: page
          };
        }
      }
      
      // If we couldn't find any page ID, check if it's a "NONE" response
      if (rawContent.toLowerCase().includes("none")) {
        console.log("OpenAI returned NONE - no page match");
        return null;
      }
      
      // Still no match found, fall back to keyword matching
      console.log("No ID found in OpenAI response, falling back to keyword matching");
      const matchedPage = findBestMatchingPage(userText, availablePages);
      return matchedPage ? { type: 'navigation', page: matchedPage } : null;
      
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      console.log("Falling back to keyword matching");
      const matchedPage = findBestMatchingPage(userText, availablePages);
      return matchedPage ? { type: 'navigation', page: matchedPage } : null;
    }
  } catch (error) {
    console.error('Error analyzing user intent:', error);
    return null;
  }
};

/**
 * Checks if the user text contains contact form actions like filling fields or submitting
 * @param userText - The text from the user's speech
 * @param onContactPage - Whether the user is currently on the contact page
 * @returns ContactFormAction object or null if not a contact form action
 */
const checkForContactFormAction = async (userText: string, onContactPage = false): Promise<ContactFormAction | null> => {
  try {
    // Use OpenAI for all form field extraction
    return await extractAllFormFields(userText);
  } catch (error) {
    console.error("Error checking for contact form action:", error);
    return null;
  }
};

/**
 * Checks if the user text contains product-related actions like filtering or sorting
 * @param userText - The text from the user's speech
 * @returns ProductAction object or null if not a product action
 */
const checkForProductAction = async (userText: string): Promise<ProductAction | null> => {
  try {
    // Create a prompt for the OpenAI API to detect product actions
    const prompt = `
      I have a products page with filtering, sorting, and search functionality.
      The user said: "${userText}"
      
      Is the user trying to:
      1. Filter products by a category
      2. Sort products by price (low to high or high to low)
      3. Search for specific products
      4. Clear filters
      5. None of these (not a product-related command)
      
      If it's a product command, respond in this exact JSON format:
      {
        "action": "filter|sort|search|clear",
        "type": "category|price|text" (omit for clear),
        "value": "the value to filter/sort/search by" (omit for clear)
      }
      
      If it's not a product command, just respond with: NONE
      
      Examples:
      1. "Show me Enterprise products" -> {"action":"filter","type":"category","value":"Enterprise"}
      2. "Sort products by price from low to high" -> {"action":"sort","type":"price","value":"low-to-high"}
      3. "Search for voice products" -> {"action":"search","type":"text","value":"voice"}
      4. "Clear all filters" -> {"action":"clear"}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that identifies product filtering and sorting commands. Respond ONLY with the JSON format specified or "NONE".'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    });

    console.log("Product action prompt sent to OpenAI:", prompt);
    console.log("OpenAI response:", response);

    if (!response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
      console.error("Invalid response format from OpenAI:", response);
      return null;
    }

    const rawContent = response.choices[0].message.content.trim();
    console.log("Raw content from product action detection:", rawContent);

    // Check if it's a "NONE" response
    if (rawContent.toLowerCase().includes("none")) {
      console.log("OpenAI determined this is not a product action");
      return null;
    }

    // Try to parse the JSON response
    try {
      // First clean up the response in case it includes markdown code block formatting
      const jsonText = rawContent.replace(/```json\n?|\n?```/g, ''); // Remove markdown code blocks if present
      const parsedAction = JSON.parse(jsonText);
      
      // Validate that the parsed action has the expected format
      if (
        parsedAction && 
        parsedAction.action && 
        ['filter', 'sort', 'search', 'clear'].includes(parsedAction.action)
      ) {
        console.log("Detected product action:", parsedAction);
        return parsedAction as ProductAction;
      }
    } catch (error) {
      console.error("Error parsing product action JSON:", error);
    }

    return null;
  } catch (error) {
    console.error("Error checking for product action:", error);
    return null;
  }
};

/**
 * Simple function to find the best matching page based on keywords
 * This is a fallback for when the OpenAI API is not available
 */
const findBestMatchingPage = (userText: string, pages: Page[]): Page | null => {
  const userTextLower = userText.toLowerCase();
  
  // Score each page based on how many of its keywords are in the user text
  const scoredPages = pages.map(page => {
    const score = page.keywords.reduce((count, keyword) => {
      return userTextLower.includes(keyword.toLowerCase()) ? count + 1 : count;
    }, 0);
    
    // Also check if the page name is mentioned
    const nameScore = userTextLower.includes(page.name.toLowerCase()) ? 3 : 0;
    
    return {
      page,
      score: score + nameScore
    };
  });
  
  // Sort pages by score (highest first)
  scoredPages.sort((a, b) => b.score - a.score);
  
  // Return the highest scoring page, if it has a score > 0
  return scoredPages[0] && scoredPages[0].score > 0 ? scoredPages[0].page : null;
}; 

/**
 * Extracts all form fields at once from user speech
 * @param userText - The text from the user's speech
 * @returns Array of ContactFormAction objects with all fields to fill
 */
const extractAllFormFields = async (userText: string): Promise<ContactFormAction | null> => {
  try {
    // Send raw input directly to OpenAI without preprocessing
    console.log("Raw input text:", userText);
    
    // Create a prompt for the OpenAI API to extract all contact form fields at once
    const prompt = `
      Extract ALL contact form information from the following text. The form has these fields: name, email, subject, message.
      
      User text: "${userText}"
      
      Extract any information that could fill a contact form, even if implied. Return ALL fields that can be extracted.
      You must be very precise in separating different fields from the text. Specifically:
      
      1. For name fields, extract only the actual name, not instructions like "my name is" or "name as"
      2. For email fields, extract the complete email address, even if it's written in speech format
      3. For subject, map to one of: "general", "support", "sales", "feedback"
      4. For message, capture actual message content
      
      Pay special attention to:
      - When multiple fields are mentioned in one sentence (e.g., "fill name as John email as john@example.com")
      - When fields are separated by "as", "with", "to", or similar words
      - When fields are mentioned in different orders
      
      Respond ONLY with a JSON object in this exact format:
      {
        "name": "extracted name or null if not mentioned",
        "email": "extracted email or null if not mentioned",
        "subject": "extracted subject or null if not mentioned",
        "message": "extracted message or null if not mentioned",
        "submit": true/false (whether user wants to submit the form)
      }
      
      Example: "fill name as John Smith email as john@example.com" →
      {
        "name": "John Smith",
        "email": "john@example.com",
        "subject": null,
        "message": null,
        "submit": false
      }
      
      If there is absolutely no form-related content, respond with "NONE".
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a specialized assistant that extracts ALL possible contact form field data from user speech. Extract any name, email, subject, and message content. Be very careful to correctly separate different field data. Pay special attention to multiple fields mentioned in one sentence and ensure you don\'t include field identifiers in the values.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 250
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
      console.error("Invalid response format from OpenAI:", response);
      return null;
    }
    console.log("Response from OpenAI:", response.choices[0].message.content);

    const rawContent = response.choices[0].message.content.trim();
    console.log("Raw content from form extraction:", rawContent);

    // Check if it's a "NONE" response
    if (rawContent.toLowerCase() === "none") {
      console.log("OpenAI determined this has no form content");
      return null;
    }

    // Try to parse the JSON response
    try {
      // Clean up the response in case it includes markdown code block formatting
      const jsonText = rawContent.replace(/```json\n?|\n?```/g, '');
      const fields = JSON.parse(jsonText);
      
      // Check if it's a form submission
      if (fields.submit === true) {
        return {
          action: 'submit-form'
        };
      }
      
      // Check if we have any fields to fill
      const fieldsToFill: {field: string, value: string}[] = [];
      for (const field of ['name', 'email', 'subject', 'message']) {
        if (fields[field] && fields[field] !== "null" && fields[field] !== null) {
          fieldsToFill.push({
            field,
            value: fields[field]
          });
        }
      }
      
      console.log("Fields to fill:", fieldsToFill);
      
      if (fieldsToFill.length === 0) {
        return null;
      }
      
      if (fieldsToFill.length === 1) {
        // If only one field, return standard format
        return {
          action: 'fill-field',
          field: fieldsToFill[0].field,
          value: fieldsToFill[0].value
        };
      }
      
      // If multiple fields, use the fill-multiple action
      return {
        action: 'fill-multiple',
        fields: fieldsToFill
      } as ContactFormAction;
    } catch (error) {
      console.error("Error parsing form field extraction JSON:", error);
    }

    return null;
  } catch (error) {
    console.error("Error extracting form fields:", error);
    return null;
  }
};

/**
 * Pre-process speech text to standardize formats and fix common speech-to-text issues
 * @param text Original speech text
 * @returns Processed text
 */
function preprocessSpeechText(text: string): string {
  // Make a copy to work with
  let processedText = text;
  
  // Fix common email speech patterns
  // Replace " at " with "@" when it appears in potential email contexts
  processedText = processedText.replace(/(\w+)\s+at\s+(\w+)/gi, '$1@$2');
  
  // Replace " dot " with "." when it appears in potential email contexts
  processedText = processedText.replace(/(\w+@\w+)\s+dot\s+(\w+)/gi, '$1.$2');
  
  // Replace spoken "dot com", "dot org", etc.
  processedText = processedText.replace(/(\w+@\w+)\.(\w+)\s+dot\s+(\w+)/gi, '$1.$2.$3');
  processedText = processedText.replace(/dot\s+(com|org|net|io|edu|gov)/gi, '.$1');
  
  // Remove any spacing between characters in what appears to be an email
  processedText = processedText.replace(/(\w)\s+(\w)/g, '$1$2');
  
  // Handle common speech-to-text name patterns
  processedText = processedText.replace(/my name is/gi, 'name:');
  processedText = processedText.replace(/i am ([^,\.]+)/gi, 'name: $1.');
  
  // Handle common speech-to-text email patterns
  processedText = processedText.replace(/my email is/gi, 'email:');
  processedText = processedText.replace(/you can reach me at/gi, 'email:');
  processedText = processedText.replace(/my email address is/gi, 'email:');
  
  // Handle common speech-to-text subject/message patterns
  processedText = processedText.replace(/(?:about|regarding|subject|topic)\s*(?:is|about)?\s*([^,\.]+)/gi, 'subject: $1.');
  processedText = processedText.replace(/(?:i need help with|my issue is|i have a problem with)\s*([^,\.]+)/gi, 'message: $1.');
  
  return processedText;
}

/**
 * Checks if the user text contains a form submission intent
 * @param userText - The text from the user's speech
 * @returns ContactFormAction object for submission or null if not a submission intent
 */
const checkForFormSubmission = async (userText: string): Promise<ContactFormAction | null> => {
  try {
    // Create a prompt for the OpenAI API to detect form submission intent
    const prompt = `
      Analyze if the following text indicates an intent to submit a contact form.
      
      User text: "${userText}"
      
      Common submission phrases include:
      - "submit the form"
      - "send the message"
      - "submit my contact information"
      - "send my details"
      - "submit"
      - "send"
      - "go ahead and submit"
      - "submit now"
      
      Respond with ONLY "SUBMIT" if the text indicates form submission intent, or "NONE" if it does not.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a specialized assistant that detects form submission intent. Respond with ONLY "SUBMIT" or "NONE".'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
      console.error("Invalid response format from OpenAI:", response);
      return null;
    }

    const rawContent = response.choices[0].message.content.trim();
    console.log("Form submission detection response:", rawContent);

    if (rawContent.toLowerCase() === "submit") {
      return {
        action: 'submit-form'
      };
    }

    return null;
  } catch (error) {
    console.error("Error checking for form submission:", error);
    return null;
  }
};