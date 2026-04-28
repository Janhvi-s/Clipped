import { Router } from 'express';
import supabase from '../db/supabase.js';

const router = Router();

function mask(key) {
  if (!key) return '';
  return key.length > 8 ? key.slice(0, 6) + '••••••••' + key.slice(-4) : '••••••••';
}

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('settings')
    .select('anthropic_api_key, openai_api_key')
    .eq('id', 1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  const geminiKey = data?.anthropic_api_key || '';
  const openaiKey = data?.openai_api_key || '';

  res.json({
    gemini: { hasKey: !!geminiKey, maskedKey: mask(geminiKey) },
    openai: { hasKey: !!openaiKey, maskedKey: mask(openaiKey) },
  });
});

router.post('/', async (req, res) => {
  const { gemini_api_key, openai_api_key } = req.body;
  if (!gemini_api_key && !openai_api_key) {
    return res.status(400).json({ error: 'Provide at least one API key.' });
  }

  const updates = { id: 1 };
  if (gemini_api_key !== undefined) updates.anthropic_api_key = gemini_api_key;
  if (openai_api_key !== undefined) updates.openai_api_key = openai_api_key;

  const { error } = await supabase.from('settings').upsert(updates);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
