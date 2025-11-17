import express from 'express';
import { User, Student } from '../models/index.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Student],
      order: [['name', 'ASC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    // If user is student, create student record
    if (req.body.role === 'student') {
      await Student.create({
        user_id: user.id,
        group: req.body.group,
        university: req.body.university
      });
    }

    const userWithStudent = await User.findByPk(user.id, {
      include: [Student]
    });

    res.status(201).json(userWithStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update(req.body);
    
    const updatedUser = await User.findByPk(req.params.id, {
      include: [Student]
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;