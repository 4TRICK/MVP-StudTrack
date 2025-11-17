import express from 'express';
import { Course } from '../models/index.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['title', 'ASC']]
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new course
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;