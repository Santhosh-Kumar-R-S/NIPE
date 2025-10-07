import express from 'express';
import { upload } from '../index.js';
import { extractText } from '../utils/fileParser.js';
import { generateSummary } from '../services/aiService.js';

const router = express.Router();

router.post('/summarize', upload.single('file'), async (req, res) => {
  try {
    let text = '';
    const { mode = 'short', textInput } = req.body;

    // Extract text from file or use manual input
    if (req.file) {
      text = await extractText(req.file);
    } else if (textInput) {
      text = textInput;
    } else {
      return res.status(400).json({ error: 'No file or text provided' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the document' });
    }

    // Generate summary
    const summary = await generateSummary(text, mode);

    // Calculate stats
    const originalWords = text.split(/\s+/).length;
    const summaryWords = summary.split(/\s+/).length;
    const readingTimeSaved = Math.round((originalWords - summaryWords) / 200); // 200 words per minute

    res.json({
      success: true,
      summary,
      stats: {
        originalWords,
        summaryWords,
        compressionRatio: `${Math.round((summaryWords / originalWords) * 100)}%`,
        readingTimeSaved: Math.max(1, readingTimeSaved)
      }
    });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate summary'
    });
  }
});

export { router as summarizeRoute };
