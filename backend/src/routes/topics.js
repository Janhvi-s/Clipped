import { Router } from 'express';
import supabase from '../db/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const { data, error } = await supabase
    .from('topics')
    .insert({ name, color: color || '#6366f1' })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
