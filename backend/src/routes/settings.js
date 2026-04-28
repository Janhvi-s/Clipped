import { Router } from 'express';
import supabase from '../db/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('settings')
    .select('anthropic_api_key')
    .eq('id', 1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  const key = data?.anthropic_api_key || '';
  const masked = key.length > 8
    ? key.slice(0, 6) + '••••••••' + key.slice(-4)
    : key ? '••••••••' : '';

  res.json({ hasKey: !!key, maskedKey: masked });
});

router.post('/', async (req, res) => {
  const { anthropic_api_key } = req.body;
  if (!anthropic_api_key) return res.status(400).json({ error: 'anthropic_api_key is required' });

  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, anthropic_api_key, updated_at: new Date().toISOString() });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
