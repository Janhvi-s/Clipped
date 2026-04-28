import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import topicsRouter from './routes/topics.js';
import notesRouter from './routes/notes.js';
import settingsRouter from './routes/settings.js';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/topics', topicsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/ai', aiRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Clipped backend running on http://localhost:${PORT}`);
});
