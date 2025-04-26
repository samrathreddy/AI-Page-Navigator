import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="page about-page">
      <h1>About Us</h1>
      <div className="content">
        <p>
          Speech Navigator is a cutting-edge application that demonstrates the power of 
          combining speech recognition with AI to create intuitive user experiences.
        </p>
        
        <div className="info-card">
          <h2>Our Technology</h2>
          <p>
            We use the Web Speech API for speech recognition and OpenAI's powerful models
            to understand user intent and navigate to the relevant page.
          </p>
        </div>
        
        <div className="info-card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to make technology more accessible and intuitive by leveraging
            natural language processing and speech recognition.
          </p>
        </div>
        
        <div className="info-card">
          <h2>Future Plans</h2>
          <p>
            We're working on expanding our capabilities to handle more complex instructions
            and support additional languages and dialects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 