import express from 'express';
import { Criteria } from '../models/index.js';

const router = express.Router();

// Get all criteria
router.get('/', async (req, res) => {
  try {
    const criteria = await Criteria.findAll({
      order: [['id', 'ASC']]
    });
    res.json(criteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new criteria
router.post('/', async (req, res) => {
  try {
    const criteria = await Criteria.create(req.body);
    res.status(201).json(criteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update criteria
router.put('/:id', async (req, res) => {
  try {
    const criteria = await Criteria.findByPk(req.params.id);
    if (!criteria) {
      return res.status(404).json({ error: 'Criteria not found' });
    }

    await criteria.update(req.body);
    res.json(criteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;