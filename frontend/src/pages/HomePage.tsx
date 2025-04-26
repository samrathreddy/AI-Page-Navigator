import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="page home-page">
      <h1>Welcome to Speech Navigator</h1>
      <p>This demo showcases a speech-to-page navigation system. Try saying something like:</p>
      <ul>
        <li>"Take me to the about page"</li>
        <li>"I want to see the products"</li>
        <li>"Show me the contact information"</li>
        <li>"Go to settings"</li>
      </ul>
      <div className="feature-section">
        <h2>How It Works</h2>
        <p>
          The application listens to your speech, converts it to text, and then uses 
          AI to analyze your request and navigate to the appropriate page.
        </p>
      </div>
    </div>
  );
};

export default HomePage; 