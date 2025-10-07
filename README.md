# LegalEase - AI-Powered Legal Document Summarizer

A modern web application that uses Google Gemini AI to generate concise, accurate summaries of legal documents.

## Features

- Upload PDF, DOCX, or TXT files (up to 10MB)
- Paste legal text directly
- Three summary modes:
  - **Short Summary**: Brief overview (150-200 words)
  - **Detailed Summary**: Comprehensive analysis (400-600 words)
  - **Plain English**: Non-technical explanation (250-350 words)
- Dark/Light theme toggle
- Copy and download summaries
- Reading time saved statistics
- History tracking (last 10 summaries)

## Prerequisites

- Node.js 18+ installed
- Google Gemini API key (free from Google AI Studio)

## Getting Your Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy your API key (starts with `AIza...`)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure your API key:

Open `.env` file and replace `your_gemini_api_key_here` with your actual Gemini API key:

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Running the Application

You need to run both the frontend and backend:

### Terminal 1 - Backend Server:
```bash
npm run server
```
The API will start on http://localhost:3001

### Terminal 2 - Frontend Dev Server:
```bash
npm run dev
```
The app will open automatically in your browser

## Usage

1. **Upload a file**: Drag and drop or click to browse for PDF, DOCX, or TXT files
2. **Or paste text**: Manually paste legal document text
3. **Choose summary mode**: Select Short, Detailed, or Plain English
4. **Click Summarize**: Wait for AI to process your document
5. **View results**: See summary with statistics, copy or download

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/        # React components
│   └── App.tsx           # Main app component
├── server/               # Backend Express server
│   ├── routes/          # API routes
│   ├── services/        # AI service (Gemini)
│   ├── utils/           # File parsers
│   └── middleware/      # Upload middleware
└── .env                 # Environment variables
```

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **File Processing**: pdf-parse, mammoth
- **Icons**: Lucide React

## Troubleshooting

### "GEMINI_API_KEY is not configured" Error
- Make sure you've added your API key to the `.env` file
- Restart the backend server after updating `.env`

### File Upload Fails
- Check file size is under 10MB
- Verify file type is PDF, DOCX, or TXT
- Ensure backend server is running on port 3001

### CORS Error
- Make sure both frontend and backend servers are running
- Backend should be on port 3001
- Frontend should be on port 5173 (Vite default)

## API Endpoints

### POST /api/summarize
Summarizes a legal document

**Request**:
- `file`: File upload (optional)
- `textInput`: Raw text (optional)
- `mode`: `short` | `detailed` | `plain`

**Response**:
```json
{
  "success": true,
  "summary": "Summary text...",
  "stats": {
    "originalWords": 5000,
    "summaryWords": 200,
    "compressionRatio": "4%",
    "readingTimeSaved": 24
  }
}
```

## License

MIT

## Support

For issues or questions, please open an issue on the project repository.
