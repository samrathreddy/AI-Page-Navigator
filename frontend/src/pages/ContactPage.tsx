import React, { useState, useEffect } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setFormStatus('success');
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  // Fill form field via voice command
  const fillField = (fieldName: string, value: string) => {
    if (fieldName in formData) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
      return true;
    }
    return false;
  };

  // Handle subject selection
  const selectSubject = (subjectValue: string) => {
    // Map common phrases to subject values - enhanced for more natural language
    const subjectMap: {[key: string]: string} = {
      // General inquiry
      'general': 'general',
      'general inquiry': 'general',
      'question': 'general',
      'inquiry': 'general',
      'information': 'general',
      'info': 'general',
      'ask': 'general',
      'asking': 'general',
      'about': 'general',
      
      // Technical support
      'support': 'support',
      'technical support': 'support',
      'technical': 'support',
      'tech support': 'support',
      'help': 'support',
      'tech': 'support',
      'assistance': 'support',
      'issue': 'support',
      'problem': 'support',
      'bug': 'support',
      'error': 'support',
      'trouble': 'support',
      'fix': 'support',
      'broken': 'support',
      'not working': 'support',
      
      // Sales
      'sales': 'sales',
      'purchase': 'sales',
      'buy': 'sales',
      'pricing': 'sales',
      'cost': 'sales',
      'price': 'sales',
      'subscription': 'sales',
      'order': 'sales',
      'payment': 'sales',
      'license': 'sales',
      'upgrade': 'sales',
      
      // Feedback
      'feedback': 'feedback',
      'suggestion': 'feedback',
      'comment': 'feedback',
      'feature request': 'feedback',
      'idea': 'feedback',
      'improvement': 'feedback',
      'feature': 'feedback',
      'recommend': 'feedback',
      'opinion': 'feedback',
      'review': 'feedback'
    };

    // Normalize input and try direct match first
    const normalizedSubject = subjectValue.toLowerCase().trim();
    if (subjectMap[normalizedSubject]) {
      setFormData(prev => ({
        ...prev,
        subject: subjectMap[normalizedSubject]
      }));
      return true;
    }
    
    // If no direct match, try to find partial matches in the input
    // This handles cases like "I have a technical issue" -> should map to "support"
    for (const [key, value] of Object.entries(subjectMap)) {
      if (normalizedSubject.includes(key)) {
        setFormData(prev => ({
          ...prev,
          subject: value
        }));
        return true;
      }
    }
    
    // If still no match, use some heuristics for common patterns
    if (normalizedSubject.includes('need help') || 
        normalizedSubject.includes('having trouble') || 
        normalizedSubject.includes('not working') || 
        normalizedSubject.includes('can\'t') || 
        normalizedSubject.includes('cannot')) {
      setFormData(prev => ({
        ...prev,
        subject: 'support'
      }));
      return true;
    }
    
    // If no match, default to general inquiry if the subject has some text
    if (normalizedSubject.length > 0) {
      setFormData(prev => ({
        ...prev,
        subject: 'general'
      }));
      return true;
    }
    
    return false;
  };

  // Fill multiple form fields at once
  const fillMultiple = (fields: Array<{field: string, value: string}>): number => {
    let successCount = 0;
    
    for (const fieldData of fields) {
      if (fieldData.field === 'subject') {
        const success = selectSubject(fieldData.value);
        if (success) successCount++;
      } else if (fieldData.field in formData) {
        setFormData(prev => ({
          ...prev,
          [fieldData.field]: fieldData.value
        }));
        successCount++;
      }
    }
    
    return successCount;
  };

  // Expose form commands to the window object for the speech navigator
  useEffect(() => {
    window.contactFormCommands = {
      fillField,
      selectSubject,
      submitForm: handleSubmit,
      fillMultiple,
      getFormData: () => formData,
      getFormStatus: () => formStatus
    };

    return () => {
      // Clean up when component unmounts
      delete window.contactFormCommands;
    };
  }, [formData, formStatus]);

  return (
    <div className="page contact-page">
      <h1>Contact Us</h1>
      
      <p className="voice-command-instructions">
        You can use voice commands to fill this form. Try saying:
        <ul className="voice-commands-list">
          <li>"Fill name with John Doe"</li>
          <li>"Set email to example@email.com"</li>
          <li>"Choose subject Technical Support"</li>
          <li>"Fill message with I need help with voice navigation"</li>
          <li>"Submit the contact form"</li>
        </ul>
      </p>
      
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you! Reach out to us using the form or through the following contact methods:</p>
          
          <div className="info-item">
            <strong>Email:</strong> 
            <a href="mailto:info@speech-navigator.com">info@speech-navigator.com</a>
          </div>
          
          <div className="info-item">
            <strong>Phone:</strong> +1 (555) 123-4567
          </div>
          
          <div className="info-item">
            <strong>Address:</strong> 123 AI Avenue, Tech District, CA 94043
          </div>
          
          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 5:00 PM PST</p>
            <p>Saturday - Sunday: Closed</p>
          </div>
        </div>
        
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>

            {formStatus === 'success' && (
              <div className="form-success-message">
                Thank you for your message! We will get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Add TypeScript declaration for the window object to include contactFormCommands
declare global {
  interface Window {
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

export default ContactPage; 