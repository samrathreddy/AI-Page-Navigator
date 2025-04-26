import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SpeechToText from './SpeechToText';
import pages from '../utils/pageData';

// Constants
const API_URL = 'http://localhost:3001/api';

// Type definition for product action
interface ProductAction {
  action: 'filter' | 'sort' | 'search' | 'clear';
  type?: string;
  value?: string;
}

// Type definition for contact form action
interface ContactFormAction {
  action: 'fill-field' | 'submit-form' | 'fill-multiple';
  field?: string;
  value?: string;
  fields?: Array<{field: string, value: string}>; // Added for fill-multiple action
}

const SpeechNavigator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedPage, setDetectedPage] = useState<{id: string, name: string, path: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [navigationMessage, setNavigationMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [pendingContactFormAction, setPendingContactFormAction] = useState<ContactFormAction | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Add useEffect to handle page navigation and pending form actions
  useEffect(() => {
    // Check if we have a pending form action and we're now on the contact page
    if (pendingContactFormAction && location.pathname === '/contact') {
      console.log("Applying pending contact form action after navigation:", pendingContactFormAction);
      
      // Apply the contact form action after a small delay to ensure the contact page is loaded
      const timer = setTimeout(() => {
        applyContactFormAction(pendingContactFormAction);
        setPendingContactFormAction(null); // Clear the pending action after applying
      }, 500);
      
      return () => clearTimeout(timer); // Clean up
    }
  }, [location.pathname, pendingContactFormAction]);

  const handleTranscript = async (transcript: string) => {
    // Expand if minimized when new speech is detected
    if (isMinimized) {
      setIsMinimized(false);
    }
    
    if (!transcript) return;
    
    await processInput(transcript);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleTextInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    
    await processInput(textInput);
    setTextInput(''); // Clear input after processing
  };

  // Common processing logic for both speech and text input
  const processInput = async (input: string) => {
    setTranscript(input);
    setIsProcessing(true);
    setError(null);
    setNavigationMessage(null);
    setDetectedPage(null);
    setPendingContactFormAction(null); // Reset pending action
    
    try {
      console.log("Analyzing input:", input);
      
      // Get current page ID from location path
      const currentPath = location.pathname;
      let currentPageId: string | undefined = undefined;
      
      // Map the path to page ID
      if (currentPath === '/') {
        currentPageId = 'home';
      } else {
        // Remove leading slash and convert to page ID
        const pathWithoutSlash = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath;
        currentPageId = pathWithoutSlash || 'home';
      }
      
      console.log("Current path:", currentPath);
      console.log("Detected current page ID:", currentPageId);
      
      // Send text to backend API for intent analysis
      const response = await fetch(`${API_URL}/intent/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: input,
          pages: pages,  // Send all available pages
          currentPageId  // Send current page ID
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API response:", result);
      
      if (result.success && result.hasMatch) {
        if (result.intentType === 'navigation' && result.matchedPage) {
          // Handle page navigation
          const matchedPage = result.matchedPage;
          
          setDetectedPage({
            id: matchedPage.id,
            name: matchedPage.name,
            path: matchedPage.path
          });
          
          // Navigate directly to the matched page
          navigate(matchedPage.path);
          setNavigationMessage(`Navigated to ${matchedPage.name}`);
        } 
        else if (result.intentType === 'product-action' && result.productAction) {
          // Handle product action
          const productAction = result.productAction as ProductAction;
          
          // First navigate to products page if we're not already there
          if (location.pathname !== '/products') {
            navigate('/products');
            setNavigationMessage(`Navigated to Products page and applied: ${formatProductAction(productAction)}`);
          } else {
            setNavigationMessage(`Applied: ${formatProductAction(productAction)}`);
          }
          
          // Apply the product action after a small delay to ensure the products page is loaded
          setTimeout(() => {
            applyProductAction(productAction);
          }, 300);
        }
        else if (result.intentType === 'contact-form-action' && result.contactFormAction) {
          // Handle contact form action
          const contactFormAction = result.contactFormAction as ContactFormAction;
          
          // Check if we need to navigate to the contact page (if API returned a matchedPage with the contact form action)
          if (result.matchedPage && result.matchedPage.id === 'contact' && location.pathname !== '/contact') {
            // Store the contact form action to apply after navigation
            setPendingContactFormAction(contactFormAction);
            
            // We detected form filling intent from another page
            navigate('/contact');
            setNavigationMessage(`Navigated to Contact page and will ${formatContactFormAction(contactFormAction)}`);
          }
          // First navigate to contact page if we're not already there
          else if (location.pathname !== '/contact') {
            // Store the contact form action to apply after navigation
            setPendingContactFormAction(contactFormAction);
            
            navigate('/contact');
            setNavigationMessage(`Navigated to Contact page and will ${formatContactFormAction(contactFormAction)}`);
          } else {
            setNavigationMessage(`${formatContactFormAction(contactFormAction)}`);
            
            // Apply the contact form action immediately as we're already on the contact page
            applyContactFormAction(contactFormAction);
          }
        } else {
          setDetectedPage(null);
          setError("Received an unknown intent type from the server.");
        }
      } else {
        setDetectedPage(null);
        setError("Sorry, I couldn't determine what you want to do. Please try again with different wording.");
      }
    } catch (err) {
      console.error('Error processing request:', err);
      setError("An error occurred while processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle minimized state
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  // Format product action for display
  const formatProductAction = (action: ProductAction): string => {
    switch (action.action) {
      case 'filter':
        return `Filtering by ${action.type}: ${action.value}`;
      case 'sort':
        return `Sorting by ${action.value}`;
      case 'search':
        return `Searching for: ${action.value}`;
      case 'clear':
        return 'Cleared all filters';
      default:
        return 'Unknown action';
    }
  };
  
  // Format contact form action for display
  const formatContactFormAction = (action: ContactFormAction): string => {
    switch (action.action) {
      case 'fill-field':
        return `Filled ${action.field} with "${action.value}"`;
      case 'submit-form':
        return 'Submitted the contact form';
      case 'fill-multiple':
        if (action.fields && action.fields.length > 0) {
          const fieldNames = action.fields.map(f => f.field).join(', ');
          return `Filled multiple fields (${fieldNames})`;
        }
        return 'Filled form fields';
      default:
        return 'Unknown contact form action';
    }
  };

  // Apply product action using the global window.productCommands object
  const applyProductAction = (action: ProductAction) => {
    // Check if we're on the products page and if the productCommands are available
    if (typeof window.productCommands !== 'undefined') {
      switch (action.action) {
        case 'filter':
          if (action.type === 'category' && action.value) {
            window.productCommands.applyFilter('category', action.value);
          }
          break;
        case 'sort':
          if (action.type === 'price' && action.value) {
            window.productCommands.applyFilter('price', action.value);
          }
          break;
        case 'search':
          if (action.value) {
            window.productCommands.applyFilter('search', action.value);
          }
          break;
        case 'clear':
          window.productCommands.applyFilter('clear', '');
          break;
      }
    } else {
      console.error('Product commands not available. Make sure you are on the products page.');
    }
  };
  
  // Apply contact form action using the global window.contactFormCommands object
  const applyContactFormAction = (action: ContactFormAction) => {
    // Check if we're on the contact page and if the contactFormCommands are available
    if (typeof window.contactFormCommands !== 'undefined') {
      switch (action.action) {
        case 'fill-field':
          if (action.field === 'subject' && action.value) {
            // For subjects, we need to normalize the input to match the select options
            window.contactFormCommands.selectSubject(action.value);
          } else if (action.field && action.value) {
            // For email field, do basic validation
            if (action.field === 'email' && action.value) {
              const emailValue = action.value.trim();
              // Basic email validation - contains @ and at least one dot after @
              const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
              if (!isValidEmail) {
                console.warn("Invalid email format detected:", emailValue);
                setError(`The email "${emailValue}" doesn't appear to be valid. Please try again.`);
                return;
              }
            }
            
            // For regular text fields, clean up the input
            const cleanValue = action.value
              .replace(/^(is|as|with|to)\s+/i, '') // Remove leading "is", "as", "with", "to"
              .trim();
              
            window.contactFormCommands.fillField(action.field, cleanValue);
          }
          break;
        case 'fill-multiple':
          // fillMultiple is now required in the interface, not optional
          // Make sure fields exists and is not empty
          if (action.fields && action.fields.length > 0) {
            const fieldsProcessed = window.contactFormCommands.fillMultiple(action.fields);
            if (fieldsProcessed > 0) {
              // Extract field names for the message
              const fieldNames = action.fields.map(f => f.field).join(', ');
              setNavigationMessage(`Filled ${fieldsProcessed} fields (${fieldNames})`);
            } else {
              setError("Failed to fill any form fields.");
            }
          } else {
            setError("No form fields provided to fill.");
          }
          break;
        case 'submit-form':
          window.contactFormCommands.submitForm();
          break;
      }
    } else {
      console.error('Contact form commands not available. Make sure you are on the contact page.');
      // If command isn't available yet, store it as pending for later execution
      setPendingContactFormAction(action);
    }
  };

  return (
    <div className={`speech-navigator ${isMinimized ? 'minimized' : ''}`}>
      <div className="navigator-container">
        <div className="navigator-header">
          <div className="header-content">
            <h2>Page AI</h2>
            <p>Use speech or text to navigate</p>
          </div>
          <button 
            className="minimize-toggle" 
            onClick={toggleMinimized} 
            aria-label={isMinimized ? "Expand navigator" : "Minimize navigator"}
          >
            {isMinimized ? '➕' : '➖'}
          </button>
        </div>
        
        {!isMinimized && (
          <>
            {/* Text Input Section */}
            <div className="text-input-section">
              <form onSubmit={handleTextInputSubmit}>
                <div className="text-input-container">
                  <input
                    type="text"
                    className="text-command-input"
                    placeholder="Type a command (e.g., 'go to contact page')"
                    value={textInput}
                    onChange={handleTextInputChange}
                    aria-label="Command input"
                  />
                  <button 
                    type="submit" 
                    className="text-submit-button"
                    disabled={isProcessing}
                  >
                    Send
                  </button>
                </div>
              </form>
              <div className="input-separator">
                <span>or use speech</span>
              </div>
            </div>

            {/* Speech Input Section */}
            <SpeechToText onTranscriptReady={handleTranscript} />
            
            {isProcessing && (
              <div className="processing-indicator">
                <span className="spinner"></span>
                <span>Processing your request...</span>
              </div>
            )}
            
            {transcript && !isProcessing && !error && !navigationMessage && (
              <div className="analyzing-message">
                <p>Analyzing: "{transcript}"</p>
              </div>
            )}
            
            {navigationMessage && !isProcessing && (
              <div className="navigation-success">
                <p>{navigationMessage}</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <div className="debug-info">
                  <details>
                    <summary>Debug Info</summary>
                    <p><strong>Transcript:</strong> {transcript}</p>
                    <p><strong>Available Pages:</strong></p>
                    <ul>
                      {pages.map(page => (
                        <li key={page.id}>
                          {page.name} (ID: {page.id}) - Keywords: {page.keywords.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Add TypeScript declaration for the window object to include productCommands
declare global {
  interface Window {
    productCommands?: {
      applyFilter: (filterType: string, value: string) => void;
      getCategories: () => string[];
      getProducts: () => any[];
      getAllProducts: () => any[];
    };
    contactFormCommands?: {
      fillField: (fieldName: string, value: string) => boolean;
      selectSubject: (subject: string) => boolean;
      submitForm: () => void;
      fillMultiple: (fields: Array<{field: string, value: string}>) => number;
      getFormData: () => any;
      getFormStatus: () => string | null;
    };
  }
}

export default SpeechNavigator; 