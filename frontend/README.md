# Page AI Navigator Frontend

A modern React application that enables natural language and voice-based page navigation using advanced speech recognition and AI-powered intent analysis. Built with TypeScript and integrated with a Node.js backend for secure API handling.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [State Management](#state-management)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Customization](#customization)
- [Limitations](#limitations)
- [Contributing](#contributing)

## Features

- **Voice Navigation**: Navigate between pages using natural voice commands
- **Text Input Support**: Type commands for navigation and form filling
- **Form Interaction**: Fill contact forms using voice or text commands
- **Product Management**: Filter, sort, and search products using voice commands
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Floating Interface**: Accessible control panel from any page
- **Error Handling**: Graceful handling of speech recognition and API errors
- **Loading States**: Visual feedback during processing
- **Settings Management**: Customize application behavior and appearance

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── SpeechNavigator.tsx  # Main navigation interface
│   │   ├── SpeechToText.tsx     # Speech recognition component
│   │   └── Navbar.tsx           # Navigation bar
│   ├── pages/                # Page components
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── SettingsPage.tsx
│   ├── utils/                # Utility functions and data
│   │   ├── pageData.ts       # Page metadata and keywords
│   │   └── openai.ts         # OpenAI integration utilities
│   ├── App.tsx               # Main application component
│   ├── App.css               # Global styles
│   └── index.tsx             # Application entry point
```

## Core Components

### Page AI

The main interface component that handles:

- Voice and text input processing
- Navigation command execution
- Form interaction commands
- Product management commands
- Error handling and user feedback

### SpeechToText

Handles speech recognition functionality:

- Web Speech API integration
- Audio recording and processing
- Backend API communication
- Error handling and status management

### Page Components

Each page implements specific functionality:

- **HomePage**: Landing page with application overview
- **AboutPage**: Company information
- **ProductsPage**: Product listing with filtering and sorting
- **ContactPage**: Contact form with voice/text command support
- **SettingsPage**: Application configuration and preferences

## State Management

The application uses React's built-in state management with hooks:

### Component State

```typescript
// Example from SpeechNavigator
const [isProcessing, setIsProcessing] = useState(false);
const [detectedPage, setDetectedPage] = useState<{
  id: string;
  name: string;
  path: string;
} | null>(null);
const [error, setError] = useState<string | null>(null);
const [transcript, setTranscript] = useState<string>("");
```

### Form State Management

```typescript
// Example from ContactPage
const [formData, setFormData] = useState({
  name: "",
  email: "",
  subject: "",
  message: "",
});
```

### Product State Management

```typescript
// Example from ProductsPage
const [products, setProducts] = useState<Product[]>(allProducts);
const [categoryFilter, setCategoryFilter] = useState<string>("All");
const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
```

## Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- npm (v8 or higher)
- Modern web browser with Web Speech API support
- Backend server running (for API integration)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:

   ```bash
   cd speech-navigator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Configure environment variables:
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```

## Development

### Starting the Development Server

```bash
npm start
```

The application will be available at http://localhost:3000.

### Available Scripts

- `npm start`: Start development server
- `npm build`: Create production build
- `npm test`: Run tests
- `npm lint`: Run linter

## Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

1. **Static Hosting**

   - Netlify
   - Vercel
   - GitHub Pages

2. **Containerized**
   - Docker
   - Kubernetes

## Customization

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update page data in `src/utils/pageData.ts`

### Modifying Keywords

Edit `src/utils/pageData.ts` to update page keywords:

```typescript
export const pages = [
  {
    id: "home",
    name: "Home",
    path: "/",
    keywords: ["home", "main", "start"],
  },
  // Add more pages...
];
```

## Limitations
- Requires modern browser
- Best performance in quiet environments
- Currently supports English (US) only
- Requires internet connectivity for AI processing
- Limited to predefined page navigation
- Form filling limited to contact form
- Product management limited to predefined actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

```

```
