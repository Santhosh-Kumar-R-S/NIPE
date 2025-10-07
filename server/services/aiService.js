import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const PROMPTS = {
  short: 'You are a legal document summarizer. Provide a brief, concise summary (150-200 words) of the key points in this legal document. Focus on the main arguments, decisions, and conclusions.',
  detailed: 'You are a legal document summarizer. Provide a comprehensive, detailed summary (400-600 words) of this legal document, preserving all important details, arguments, parties involved, legal principles, and conclusions. Maintain the logical flow and structure.',
  plain: 'You are a legal document summarizer. Summarize this legal document in plain English (250-350 words), avoiding legal jargon while maintaining accuracy. Make it easily understandable for non-lawyers. Explain any necessary legal terms in simple language.'
};

async function queryGemini(text, mode) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `${PROMPTS[mode]}

Legal Document:
${text}

Summary:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function chunkText(text, maxChunkSize = 4000) {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += maxChunkSize) {
    chunks.push(words.slice(i, i + maxChunkSize).join(' '));
  }

  return chunks;
}

export async function generateSummary(text, mode = 'short') {
  try {
    const wordCount = text.split(/\s+/).length;

    const chunkSize = {
      short: 5000,
      detailed: 6000,
      plain: 5000
    }[mode] || 5000;

    if (wordCount > chunkSize) {
      const chunks = chunkText(text, chunkSize);
      const summaries = [];

      console.log(`Processing ${chunks.length} chunks...`);

      for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        const summary = await queryGemini(chunks[i], mode);
        if (summary) {
          summaries.push(summary);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (summaries.length > 1) {
        console.log('Combining summaries...');
        const combinedText = summaries.join('\n\n');
        const finalPrompt = `${PROMPTS[mode]}

Please combine and synthesize these section summaries into one coherent, unified summary:

${combinedText}

Final Summary:`;

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text();
      }

      return summaries[0] || 'Unable to generate summary.';
    }

    return await queryGemini(text, mode);
  } catch (error) {
    console.error('AI Service Error:', error);

    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your .env file and ensure you have a valid API key from https://makersuite.google.com/app/apikey');
    }

    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}
