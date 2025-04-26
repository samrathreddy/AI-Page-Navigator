# Page AI Navigator

A modern web application that enables natural language and voice-based page navigation using Open AI. The system combines speech recognition, natural language processing, and intelligent page matching to provide an intuitive navigation experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

Page AI Navigator is a full-stack application that allows users to navigate between pages using natural language commands, either through voice or text input. The system uses AI-powered intent analysis to understand user commands and navigate to the appropriate page or perform specific actions.

### Key Components

1. **Frontend**: React-based user interface with voice and text input capabilities
2. **Backend**: Node.js server handling speech recognition and intent analysis
3. **AI Integration**: Deepgram for speech recognition and OpenAI for intent analysis

## Features

### Voice Navigation

- Convert speech to text using Deepgram
- Process voice commands for page navigation
- Support for natural language commands
- Real-time feedback and status updates

### Text Navigation

- Type commands for navigation
- Natural language processing
- Intelligent page matching
- Command history and suggestions

### Form Interaction

- Voice and text-based form filling
- Smart field detection and filling
- Form submission commands
- Error handling and validation

### Product Management

- Voice and text-based product filtering
- Sorting products by various criteria
- Search functionality
- Category-based navigation

### User Experience

- Floating navigation interface
- Responsive design for all devices
- Customizable settings
- Error handling and user feedback

## System Architecture

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/           # UI components
│   │   ├── SpeechNavigator  # Main navigation interface
│   │   ├── SpeechToText     # Speech recognition
│   │   └── Navbar           # Navigation bar
│   ├── pages/               # Page components
│   ├── utils/               # Utility functions
│   └── App.tsx              # Main application
```

### Backend Architecture

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   ├── services/           # Business logic
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
```

## Technology Stack

### Frontend

- React 18
- TypeScript
- Web Speech API
- React Router
- CSS Modules

### Backend

- Node.js
- Express
- TypeScript
- Deepgram API
- OpenAI API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Deepgram API key
- OpenAI API key
- Modern web browser with Web Speech API support

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Backend: Copy `.env.example` to `.env` and add your API keys
   - Frontend: Copy `.env.example` to `.env` and set the API URL

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

3. Access the application at http://localhost:3000

## API Documentation

### Speech Recognition

- **Endpoint**: `POST /api/speech/transcribe`
- **Purpose**: Convert audio to text
- **Input**: Audio file
- **Output**: Transcribed text

### Intent Analysis

- **Endpoint**: `POST /api/intent/analyze`
- **Purpose**: Analyze text for navigation intent
- **Input**: Text and page data
- **Output**: Navigation suggestions

## Development Guide

### Frontend Development

1. Follow React best practices
2. Use TypeScript for type safety
3. Implement responsive design
4. Handle errors gracefully
5. Maintain accessibility standards

### Backend Development

1. Follow RESTful API design
2. Implement proper error handling
3. Use TypeScript for type safety
4. Follow security best practices
5. Implement proper logging

## Deployment

### Backend Deployment

1. Build the application:

   ```bash
   cd backend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the application:

   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the build folder to your hosting service

### Deployment Options

- **Backend**:

  - Heroku
  - AWS
  - DigitalOcean
  - Docker

- **Frontend**:
  - Netlify
  - Vercel
  - GitHub Pages
  - AWS S3

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Development Workflow

1. Create an issue describing the feature/bug
2. Create a branch from main
3. Implement changes
4. Create a pull request
5. Get code review
6. Merge to main
