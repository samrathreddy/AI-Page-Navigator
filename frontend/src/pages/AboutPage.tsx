import React from 'react';
import '../styles/AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="page about-page">
      <h1>About AI Page Navigator</h1>
      <div className="content">
        <p className="intro">
          Welcome to AI Page Navigator - a revolutionary web application that combines 
          the power of voice commands and text-based input with artificial intelligence to create a seamless,
          hands-free or typed navigation experience.
        </p>
        
        <div className="info-card">
          <h2>How It Works</h2>
          <p>
            You can interact with our system in two ways:
            <ul>
              <li><strong>Voice Navigation:</strong> Click the microphone button and speak naturally</li>
              <li><strong>Text Navigation:</strong> Type your command in the text input field</li>
            </ul>
            Our AI-powered system will:
            <ul>
              <li>Process your input (voice or text) using advanced AI models</li>
              <li>Understand your intent and context</li>
              <li>Navigate you to the most relevant page or perform the requested action</li>
            </ul>
          </p>
        </div>
        
        <div className="info-card">
          <h2>Key Features</h2>
          <p>
            <ul>
              <li>Dual Input Methods: Choose between voice commands or text input</li>
              <li>Natural Language Processing: Understand conversational commands</li>
              <li>Real-time Speech Recognition: Instant voice-to-text conversion</li>
              <li>Smart Text Processing: Intelligent text command interpretation</li>
              <li>Cross-browser Compatibility: Works on all modern browsers</li>
              <li>Accessibility: Multiple ways to interact with the system</li>
            </ul>
          </p>
        </div>
        
        <div className="info-card">
          <h2>Example Commands</h2>
          <p>
            Try these commands (either speak or type):
            <ul>
              <li>"Take me to the home page" or "go to home"</li>
              <li>"Show me the contact information" or "contact page"</li>
              <li>"Navigate to about section" or "about"</li>
              <li>"Go back to previous page" or "back"</li>
              <li>"What can I do here?" or "help"</li>
              <li>"Show me all available pages" or "list pages"</li>
            </ul>
          </p>
        </div>

        <div className="info-card">
          <h2>Technology Stack</h2>
          <p>
            Built with cutting-edge technologies:
            <ul>
              <li>React.js for the frontend interface</li>
              <li>Web Speech API for voice recognition</li>
              <li>OpenAI's models for natural language understanding</li>
              <li>Express.js backend for API handling</li>
              <li>Advanced text processing algorithms</li>
              <li>State-of-the-art intent recognition system</li>
            </ul>
          </p>
        </div>
        
        <div className="info-card">
          <h2>Accessibility & Flexibility</h2>
          <p>
            We believe in making navigation accessible to everyone:
            <ul>
              <li>Voice commands for hands-free operation</li>
              <li>Text input for quiet environments or preference</li>
              <li>Simple, intuitive interface for both input methods</li>
              <li>Clear feedback on command recognition</li>
              <li>Support for different command phrasings</li>
            </ul>
          </p>
        </div>
        
        <div className="info-card">
          <h2>Future Developments</h2>
          <p>
            We're actively working on:
            <ul>
              <li>Multi-language support for both voice and text</li>
              <li>Custom command configurations</li>
              <li>Enhanced accessibility features</li>
              <li>Integration with more AI models</li>
              <li>Advanced natural language understanding</li>
              <li>Personalized command preferences</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 