import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractText(file) {
  const { mimetype, buffer } = file;

  try {
    switch (mimetype) {
      case 'application/pdf':
        const pdfData = await pdfParse(buffer);
        return pdfData.text;

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ buffer });
        return docxResult.value;

      case 'text/plain':
        return buffer.toString('utf-8');

      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
}
