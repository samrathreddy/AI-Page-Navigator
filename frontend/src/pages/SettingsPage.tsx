import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    speechRecognition: true,
    language: 'en-US',
    theme: 'light',
    fontSize: 'medium',
    notifications: true,
    autoNavigate: true
  });

  const handleToggleChange = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to localStorage or a backend
    alert('Settings saved successfully!');
  };

  const resetSettings = () => {
    setSettings({
      speechRecognition: true,
      language: 'en-US',
      theme: 'light',
      fontSize: 'medium',
      notifications: true,
      autoNavigate: true
    });
  };

  return (
    <div className="page settings-page">
      <h1>Settings</h1>
      
      <div className="settings-container">
        <div className="settings-group">
          <h2>Voice & Navigation</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Speech Recognition</h3>
              <p>Enable or disable speech recognition functionality</p>
            </div>
            <div className="setting-control">
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={settings.speechRecognition}
                  onChange={() => handleToggleChange('speechRecognition')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>Select your preferred language for speech recognition</p>
            </div>
            <div className="setting-control">
              <select 
                name="language" 
                value={settings.language}
                onChange={handleSelectChange}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
              </select>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Auto-Navigate</h3>
              <p>Automatically navigate to the detected page</p>
            </div>
            <div className="setting-control">
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={settings.autoNavigate}
                  onChange={() => handleToggleChange('autoNavigate')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-group">
          <h2>Appearance</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Theme</h3>
              <p>Choose between light and dark theme</p>
            </div>
            <div className="setting-control">
              <select 
                name="theme" 
                value={settings.theme}
                onChange={handleSelectChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Font Size</h3>
              <p>Adjust the size of text throughout the application</p>
            </div>
            <div className="setting-control">
              <select 
                name="fontSize" 
                value={settings.fontSize}
                onChange={handleSelectChange}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-group">
          <h2>Notifications</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Enable Notifications</h3>
              <p>Receive notifications about navigation events</p>
            </div>
            <div className="setting-control">
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={settings.notifications}
                  onChange={() => handleToggleChange('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button onClick={saveSettings} className="save-btn">Save Settings</button>
          <button onClick={resetSettings} className="reset-btn">Reset to Default</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 