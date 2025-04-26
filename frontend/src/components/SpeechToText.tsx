import React, { useState, useRef, useEffect } from 'react';

// Constants
const API_URL = 'http://localhost:3001/api';

interface SpeechToTextProps {
  onTranscriptReady: (transcript: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptReady }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Check if backend is available
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${API_URL}`);
        const isAvailable = response.ok;
        setIsBackendAvailable(isAvailable);
        console.log(`Backend API ${isAvailable ? 'is' : 'is not'} available`);
      } catch (error) {
        console.warn('Could not connect to backend API', error);
        setIsBackendAvailable(false);
      }
    };
    
    checkBackendStatus();
  }, []);

  const startListening = async () => {
    setTranscript('');
    setError(null);
    
    if (isBackendAvailable) {
      // Use backend API for recording and transcription with Deepgram
      startRecording();
    } else {
      setError('Backend API is not available. Please make sure the server is running.');
    }
  };

  const startRecording = async () => {
    try {
      setAudioChunks([]);
      setIsRecording(true);
      setIsListening(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.start(1000); // Collect data every 1 second
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing your microphone. Please check permissions.');
      setIsListening(false);
      setIsRecording(false);
    }
  };

  const stopListening = async () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop recording and send to backend API
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Wait for the final chunk to be added
      setTimeout(async () => {
        try {
          if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            
            // Create form data for API request
            const formData = new FormData();
            formData.append('audio', audioBlob);
            
            // Send to backend API for Deepgram transcription
            const response = await fetch(`${API_URL}/speech/transcribe`, {
              method: 'POST',
              body: formData
            });
            
            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }
            
            const result = await response.json();
            if (result.success && result.transcript) {
              setTranscript(result.transcript);
              onTranscriptReady(result.transcript);
            } else {
              throw new Error('No transcript returned from API');
            }
          }
        } catch (err) {
          console.error('Error transcribing audio:', err);
          setError('Error transcribing audio with Deepgram. Please try again.');
        } finally {
          // Clean up
          mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop());
          setIsListening(false);
        }
      }, 500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="speech-to-text">
      <div className="api-info">
        <span className="api-badge deepgram">Using Deepgram API</span>
      </div>
      
      <div className="controls">
        {!isListening ? (
          <button 
            onClick={startListening}
            className="record-button"
            disabled={!isBackendAvailable}
          >
            Start Recording
          </button>
        ) : (
          <button 
            onClick={stopListening}
            className="stop-button"
          >
            Stop Recording
          </button>
        )}
      </div>
      
      {!isBackendAvailable && (
        <div className="error">
          Backend server is not available. Make sure the server is running.
        </div>
      )}
      
      {isListening && (
        <div className="status recording">
          Listening...
        </div>
      )}
      
      {transcript && (
        <div className="transcript">
          <h3>Your Speech:</h3>
          <p>{transcript}</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpeechToText; 