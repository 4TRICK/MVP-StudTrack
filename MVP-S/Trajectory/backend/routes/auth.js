import express from 'express';
import jwt from 'jsonwebtoken';
import { User, Student } from '../models/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'trajectory-secret-key';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [Student]
    });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Account is blocked' });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        avatar_bg: user.avatar_bg,
        student: user.Student
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register (for demo purposes)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      organization
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;