import express from 'express';
import { Event, EventParticipant } from '../models/index.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'DESC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;