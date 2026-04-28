import { Router } from 'express';
import supabase from '../db/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  const { topic_id, search } = req.query;

  let query = supabase
    .from('notes')
    .select('*, topics(id, name, color)')
    .order('created_at', { ascending: false });

  if (topic_id) query = query.eq('topic_id', topic_id);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,summary.ilike.%${search}%,preserved_clip.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { title, summary, preserved_clip, tag, topic_id, source, date } = req.body;

  const { data, error } = await supabase
    .from('notes')
    .insert({ title, summary, preserved_clip, tag, topic_id, source, date })
    .select('*, topics(id, name, color)')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id', async (req, res) => {
  const { tag, preserved_clip, source, topic_id } = req.body;
  const updates = {};
  if (tag) updates.tag = tag;
  if (preserved_clip !== undefined) updates.preserved_clip = preserved_clip;
  if (source !== undefined) updates.source = source;
  if (topic_id !== undefined) updates.topic_id = topic_id || null;

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', req.params.id)
    .select('*, topics(id, name, color)')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
