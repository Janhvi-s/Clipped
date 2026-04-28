import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import supabase from '../db/supabase.js';

const router = Router();

async function getApiKey() {
  const { data, error } = await supabase
    .from('settings')
    .select('anthropic_api_key')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data?.anthropic_api_key) {
    throw new Error('Gemini API key not configured. Please add it in Settings.');
  }
  return data.anthropic_api_key;
}

router.post('/process', async (req, res) => {
  const { clippedText, source, topicId, topicName, tag, existingNotes } = req.body;

  if (!clippedText) return res.status(400).json({ error: 'clippedText is required' });

  let apiKey;
  try {
    apiKey = await getApiKey();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const contextBlock = existingNotes?.length
    ? `\n\nHere are existing notes from the topic "${topicName}" for context:\n${existingNotes
        .slice(0, 5)
        .map((n) => `- ${n.title}: ${n.summary}`)
        .join('\n')}`
    : '';

  const prompt = `You are a learning assistant helping a user organize their notes.
Given a clipped text from an AI tool or article, write a concise title and a 1-2 line summary that captures the key insight.
Always respond with valid JSON only — no markdown, no code fences, just raw JSON.

The user clipped this text from "${source || 'Unknown'}":

"${clippedText}"

Topic: ${topicName || 'General'}
Tag: ${tag || 'concept'}${contextBlock}

Return a JSON object with exactly these fields:
{
  "title": "A short, descriptive title (max 8 words)",
  "summary": "A 1-2 sentence explanation of why this is useful or what it means"
}`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    let parsed;
    try {
      const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: 'Gemini returned invalid JSON', raw });
    }

    const today = new Date().toISOString().split('T')[0];

    res.json({
      title: parsed.title,
      summary: parsed.summary,
      preserved_clip: clippedText,
      tag: tag || 'concept',
      topic_id: topicId,
      source: source || 'Unknown',
      date: today,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
