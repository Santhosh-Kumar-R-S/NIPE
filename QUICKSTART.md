# Quick Start Guide

## Step 1: Get Your Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

## Step 2: Add API Key to .env

Open the `.env` file and replace this line:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

With your actual key:
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Step 3: Start Backend Server

Open Terminal 1 and run:
```bash
npm run server
```

You should see:
```
🚀 LegalEase API server running on port 3001
```

## Step 4: Frontend is Already Running

The frontend dev server starts automatically. Just open your browser to the provided URL (usually http://localhost:5173)

## Step 5: Test the Application

### Option A: Paste Sample Text
1. Copy the content from `sample-legal-text.txt`
2. Paste it in the text area
3. Select a summary mode (try "Plain English Summary")
4. Click "Summarize"

### Option B: Upload a File
1. Drag and drop a PDF, DOCX, or TXT file
2. Or click to browse for a file
3. Select summary mode
4. Click "Summarize"

## Troubleshooting

### Error: "GEMINI_API_KEY is not configured"
- Make sure you added your API key to `.env`
- Restart the backend server (Terminal 1: Ctrl+C, then `npm run server`)

### Error: "Failed to fetch"
- Ensure backend is running on port 3001
- Check Terminal 1 for any error messages

### Upload not working
- File must be PDF, DOCX, or TXT
- File size must be under 10MB
- Check browser console for errors

## What to Expect

- Processing time: 5-15 seconds for short documents
- Longer documents may take 30-60 seconds
- You'll see statistics showing:
  - Original word count
  - Summary word count
  - Compression ratio
  - Estimated time saved

## Features to Try

1. **Dark Mode**: Click the moon/sun icon in the top right
2. **Copy Summary**: Click the copy button after generating
3. **Download**: Save the summary as a TXT file
4. **Different Modes**: Try all three summary modes to see the difference

## Need Help?

Check the main README.md for detailed documentation and troubleshooting.
