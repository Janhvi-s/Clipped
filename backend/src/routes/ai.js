import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import supabase from '../db/supabase.js';

const router = Router();

async function resolveProvider() {
  // Env vars take priority — OpenAI beats Gemini if both present
  if (process.env.OPENAI_API_KEY) {
    return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY };
  }
  if (process.env.GEMINI_API_KEY) {
    return { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY };
  }
  // Fallback: check keys saved via the Settings page in Supabase
  const { data, error } = await supabase
    .from('settings')
    .select('anthropic_api_key, openai_api_key')
    .eq('id', 1)
    .maybeSingle();

  if (!error && data?.openai_api_key) {
    return { provider: 'openai', apiKey: data.openai_api_key };
  }
  if (!error && data?.anthropic_api_key) {
    return { provider: 'gemini', apiKey: data.anthropic_api_key };
  }
  throw new Error(
    'No LLM API key configured. Set OPENAI_API_KEY or GEMINI_API_KEY in backend .env, or add a key in the app Settings page.'
  );
}

function buildPrompt(source, clippedText, topicName, tag, existingNotes) {
  const contextBlock = existingNotes?.length
    ? `\n\nHere are existing notes from the topic "${topicName}" for context:\n${existingNotes
        .slice(0, 5)
        .map((n) => `- ${n.title}: ${n.summary}`)
        .join('\n')}`
    : '';

  return `You are a learning assistant helping a user organize their notes.
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
}

async function callOpenAI(apiKey, prompt) {
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content.trim());
}

async function callGemini(apiKey, prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned);
}

router.post('/process', async (req, res) => {
  const { clippedText, source, topicId, topicName, tag, existingNotes } = req.body;
  if (!clippedText) return res.status(400).json({ error: 'clippedText is required' });

  let provider, apiKey;
  try {
    ({ provider, apiKey } = await resolveProvider());
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const prompt = buildPrompt(source, clippedText, topicName, tag, existingNotes);

  try {
    const parsed = provider === 'openai'
      ? await callOpenAI(apiKey, prompt)
      : await callGemini(apiKey, prompt);

    res.json({
      title: parsed.title,
      summary: parsed.summary,
      preserved_clip: clippedText,
      tag: tag || 'concept',
      topic_id: topicId,
      source: source || 'Unknown',
      date: new Date().toISOString().split('T')[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
