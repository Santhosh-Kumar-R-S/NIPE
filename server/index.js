import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { summarizeRoute } from './routes/summarize.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', summarizeRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'LegalEase API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LegalEase API server running on port ${PORT}`);
});
