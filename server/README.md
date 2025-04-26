# Page AI Backend

A robust backend server for the Page AI application that handles speech recognition and intent analysis using Deepgram and OpenAI APIs. This server provides the core functionality for converting speech to text and analyzing user intent for page navigation.

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Processing Flow](#processing-flow)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)

## Features

- **Speech Recognition**: Convert audio to text using Deepgram's advanced speech recognition API
- **Intent Analysis**: Analyze text to determine user's intent using OpenAI's GPT models
- **RESTful API**: Well-documented endpoints for seamless frontend integration
- **Health Monitoring**: Built-in health check endpoints for system monitoring

## Architecture Overview

The backend follows a layered architecture pattern with clear separation of concerns:

1. **API Layer**: Handles HTTP requests and responses
2. **Controller Layer**: Manages request validation and response formatting
3. **Service Layer**: Contains business logic and external API integrations
4. **Utility Layer**: Provides shared functionality and helper methods

### Key Components

- **Speech Recognition Service**: Interfaces with Deepgram API for audio-to-text conversion
- **Intent Analysis Service**: Uses OpenAI's GPT models to understand user intent
- **Page Matching Engine**: Matches analyzed intent with available pages
- **Error Handling Middleware**: Centralized error management
- **Request Validation**: Input sanitization and validation
- **Response Formatter**: Standardized API responses

## Processing Flow

### Speech Recognition Flow

1. **Audio Reception**

   - Receive audio file via multipart/form-data
   - Validate file format and size
   - Convert to appropriate format if needed

2. **Deepgram Processing**

   - Stream audio to Deepgram API
   - Handle real-time transcription
   - Process confidence scores
   - Apply language detection

3. **Response Generation**
   - Format transcription results
   - Include confidence metrics
   - Handle partial results

### Intent Analysis Flow

1. **Text Processing**

   - Clean and normalize input text
   - Remove noise and irrelevant content
   - Tokenize for analysis

2. **OpenAI Processing**

   - Generate context-aware prompts
   - Handle conversation history
   - Process intent classification
   - Extract relevant entities

3. **Page Matching**
   - Compare intent with page keywords
   - Calculate relevance scores
   - Apply matching thresholds
   - Handle multiple matches

## Error Handling

The system implements comprehensive error handling:

### Error Types

1. **Input Validation Errors**

   - Invalid file formats
   - Missing required fields
   - Malformed requests

2. **API Integration Errors**

   - Deepgram API failures
   - OpenAI API timeouts
   - Rate limiting issues

3. **Processing Errors**
   - Audio processing failures
   - Intent analysis errors
   - Page matching failures

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific error details"
    }
  }
}
```

## Performance Considerations

### Optimization Strategies

1. **Audio Processing**

   - Stream processing for large files
   - Chunked audio handling
   - Background processing for long files

2. **API Integration**

   - Request batching
   - Response caching
   - Connection pooling

3. **Resource Management**
   - Memory usage optimization
   - CPU load balancing
   - Connection timeout handling

### Monitoring and Logging

- Request/response logging
- Performance metrics collection
- Error rate monitoring
- API usage tracking

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Deepgram API key
- OpenAI API key

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the server directory:

   ```bash
   cd speech-navigator/server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your API keys:
   ```
   DEEPGRAM_API_KEY=your_deepgram_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

This starts the server with hot-reloading enabled.

### Production Mode

```bash
npm run build
npm start
```

This builds and starts the production server.

## API Documentation

### Health Check Endpoints

#### GET /health

- **Purpose**: Basic health check
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-03-21T12:00:00Z"
  }
  ```

#### GET /api

- **Purpose**: API health check
- **Response**:
  ```json
  {
    "status": "ok",
    "version": "1.0.0"
  }
  ```

### Speech Recognition

#### POST /api/speech/transcribe

- **Purpose**: Convert audio to text
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `audio`: Audio file (supported formats: wav, mp3, m4a)
- **Response**:
  ```json
  {
    "success": true,
    "transcript": "the transcribed text"
  }
  ```

### Intent Analysis

#### POST /api/intent/analyze

- **Purpose**: Analyze text to determine user's intent
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "text": "the text to analyze",
    "pages": [
      {
        "id": "pageId",
        "name": "Page Name",
        "path": "/page-path",
        "keywords": ["keyword1", "keyword2"]
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "matchedPage": {
      "id": "pageId",
      "name": "Page Name",
      "path": "/page-path",
      "keywords": ["keyword1", "keyword2"]
    },
    "hasMatch": true
  }
  ```

## Project Structure

```
server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── tests/               # Test files
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Environment Variables

| Variable           | Description                             | Required |
| ------------------ | --------------------------------------- | -------- |
| `DEEPGRAM_API_KEY` | API key for Deepgram speech recognition | Yes      |
| `OPENAI_API_KEY`   | API key for OpenAI intent analysis      | Yes      |
| `PORT`             | Server port (default: 3000)             | No       |
| `NODE_ENV`         | Environment (development/production)    | No       |
