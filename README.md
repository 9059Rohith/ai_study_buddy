EduAI Study Buddy An AI-powered study companion that transforms your PDFs into interactive learning experiences Overview EduAI Study Buddy is a React-based web application that helps students learn more effectively by converting PDF documents into interactive study sessions. Upload any PDF, get AI-generated summaries, ask questions about the content, and receive personalized study plans powered by Google Gemini AI. Features Core Functionality

PDF Upload & Processing: Drag-and-drop interface with real-time text extraction AI Document Summarization: Automatic key insights generation using Google Gemini Interactive Chat Interface: Ask questions about uploaded documents Study Plan Generation: Personalized learning schedules based on document content Local Data Persistence: All documents and chat history saved locally

Technical Features

Responsive Design: Mobile-first approach with clean UI Real-time Processing: Live feedback during PDF parsing and AI responses Error Handling: Comprehensive validation and graceful failure recovery Performance Optimized: Efficient PDF processing and API call management

Tech Stack

Frontend: React 18 + Vite Styling: Tailwind CSS Icons: Lucide React PDF Processing: PDF.js (CDN) AI Integration: Google Gemini Pro API Storage: localStorage Deployment: Netlify

Quick Start Prerequisites

Node.js 16+ npm or yarn Google Gemini API key

Installation bash# Clone the repository git clone https://github.com/9059Rohith/eduai-study-buddy.git

Navigate to project directory
cd eduai-study-buddy

Install dependencies
npm install

Set up environment variables
cp .env.example .env

Add your Gemini API key to .env
Environment Setup Create a .env file in the root directory: envVITE_GEMINI_API_KEY=your_gemini_api_key_here Development bash# Start development server npm run dev

Open browser to http://localhost:5173
Build for Production bash# Create production build npm run build

Preview production build
npm run preview

Deploy to Netlify
Upload dist/ folder or connect GitHub repository
Usage Guide

Upload Document
Click the upload area or drag and drop a PDF file Wait for text extraction to complete View extracted content preview

Get AI Summary
Automatic summary generation after upload Key concepts and main ideas highlighted Regenerate summary option available

Interactive Chat
Ask questions about the document content Get contextual AI responses Chat history preserved during session

Study Plan
Generate personalized study schedules Topic breakdown with timelines Track learning progress

Project Structure src/ ├── components/ │ ├── FileUploader.jsx # PDF upload interface │ ├── ChatInterface.jsx # AI chat component │ ├── DocumentSummary.jsx # Summary display │ ├── StudyPlan.jsx # Study plan generator │ └── Layout.jsx # Main layout wrapper ├── hooks/ │ ├── useGemini.js # Gemini API integration │ ├── useLocalStorage.js # Storage management │ └── usePDFExtractor.js # PDF processing ├── utils/ │ ├── pdfExtractor.js # PDF.js utilities │ ├── apiClient.js # API call handlers │ └── storage.js # localStorage helpers ├── App.jsx # Main application └── main.jsx # Entry point API Integration Gemini AI Configuration The application uses Google Gemini Pro API for AI features:

Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent Authentication: API key via environment variable Rate Limiting: Built-in request throttling Error Handling: Automatic retry with exponential backoff

Sample API Usage javascriptconst response = await fetch(${GEMINI_API_URL}?key=${API_KEY}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }); Configuration PDF Processing Settings javascript// Maximum pages to process const MAX_PAGES = 10;

// File size limit const MAX_FILE_SIZE = 10 _ 1024 _ 1024; // 10MB

// Supported file types const SUPPORTED_TYPES = ['application/pdf']; Storage Configuration javascript// localStorage keys const STORAGE_KEYS = { DOCUMENTS: 'eduai_documents', CHAT_HISTORY: 'eduai_chat_history', SUMMARIES: 'eduai_summaries', STUDY_PLANS: 'eduai_study_plans' }; Troubleshooting Common Issues PDF Upload Fails

Check file size (max 10MB) Ensure file is a valid PDF Try with a different PDF document

AI Responses Not Working

Verify Gemini API key is correct Check internet connection Review browser console for errors

Text Extraction Issues

Some PDFs may be image-based (scanned) Password-protected PDFs not supported Complex layouts may have formatting issues

Storage Errors

Clear browser cache and localStorage Check available storage space Disable browser extensions that block storage

Performance Tips

Upload smaller PDF files for faster processing Close unused browser tabs to free memory Use modern browsers for best performance Avoid processing multiple large files simultaneously

Browser Support

Chrome 90+ Firefox 88+ Safari 14+ Edge 90+

Contributing Development Workflow

Fork the repository Create feature branch (git checkout -b feature/amazing-feature) Commit changes (git commit -m 'Add amazing feature') Push to branch (git push origin feature/amazing-feature) Open Pull Request

Code Standards

Use ESLint configuration provided Follow React Hooks best practices Write comprehensive error handling Add JSDoc comments for complex functions Maintain responsive design principles

Testing bash# Run linting npm run lint

Fix linting issues
npm run lint:fix

Type checking (if using TypeScript)
npm run type-check Deployment Netlify Deployment

Automatic Deployment:

Connect GitHub repository to Netlify Set build command: npm run build Set publish directory: dist Add environment variables in Netlify dashboard

Manual Deployment: bashnpm run build

Upload dist/ folder to Netlify
Environment Variables for Production envVITE_GEMINI_API_KEY=your_production_api_key Build Optimization The production build includes:

Code splitting and tree shaking Asset optimization and compression PDF.js worker configuration Service worker for caching (optional)

Security Considerations

API keys stored as environment variables Client-side data storage only No server-side data persistence HTTPS required for production Content Security Policy recommended

License This project is licensed under the MIT License - see the LICENSE file for details. Acknowledgments

Google Gemini AI for intelligent content processing PDF.js team for excellent PDF parsing capabilities React and Vite communities for robust development tools Tailwind CSS for efficient styling framework

Support For support and questions:

Create an issue on GitHub Check troubleshooting section above Review existing issues for solution
