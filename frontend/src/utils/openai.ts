// This file contains utility functions for interacting with OpenAI API
// API key is read from environment variables
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

export interface Page {
  id: string;
  name: string;
  path: string;
  keywords: string[];
  description?: string;
}

/**
 * Analyzes user text to determine which page they want to navigate to
 * @param userText - The text from the user's speech
 * @param availablePages - List of pages that the user can navigate to
 * @returns The page that best matches the user's request, or null if no match
 */
export const analyzeUserIntent = async (
  userText: string,
  availablePages: Page[]
): Promise<Page | null> => {
  try {
    // Create a prompt for the OpenAI API
    const prompt = `
      I have a website with the following pages:
      ${availablePages.map(page => `- ${page.id}: ${page.name} (Keywords: ${page.keywords.join(', ')})`).join('\n')}
      
      The user said: "${userText}"
      
      Based on what the user said, which page should I navigate to? 
      Respond with just the ID of the most relevant page. Only respond with one of these exact IDs: ${availablePages.map(p => p.id).join(', ')}. If there is no relevant page, respond with "NONE".
    `;

    // Check if OpenAI API key is provided
    if (!OPENAI_API_KEY) {
      console.warn("OpenAI API key not provided in environment variables, using fallback keyword matching instead");
      return findBestMatchingPage(userText, availablePages);
    }

    // Make API request to OpenAI
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
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
        })
      });

      console.log("Prompt sent to OpenAI:", prompt);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        throw new Error(`OpenAI API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      console.log("OpenAI response data:", data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error("Invalid response format from OpenAI:", data);
        throw new Error("Invalid response format from OpenAI");
      }
      
      // Extract and clean the page ID from the response
      const rawContent = data.choices[0].message.content.trim();
      console.log("Raw content from OpenAI:", rawContent);
      
      // Extract just the ID by removing any extra text
      // First, check if it's an exact ID match
      const exactIdMatch = availablePages.find(p => p.id === rawContent);
      if (exactIdMatch) {
        console.log("Found exact ID match:", exactIdMatch.id);
        return exactIdMatch;
      }
      
      // If not an exact match, try to extract the ID from the response
      // Look for any of our page IDs in the response
      for (const page of availablePages) {
        if (rawContent.includes(page.id)) {
          console.log("Found ID in response:", page.id);
          return page;
        }
      }
      
      // If we couldn't find any page ID, check if it's a "NONE" response
      if (rawContent.toLowerCase().includes("none")) {
        console.log("OpenAI returned NONE - no page match");
        return null;
      }
      
      // Still no match found, fall back to keyword matching
      console.log("No ID found in OpenAI response, falling back to keyword matching");
      return findBestMatchingPage(userText, availablePages);
      
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      console.log("Falling back to keyword matching");
      return findBestMatchingPage(userText, availablePages);
    }
  } catch (error) {
    console.error('Error analyzing user intent:', error);
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

export default analyzeUserIntent; 