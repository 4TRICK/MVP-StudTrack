import express from 'express';
import { Student, User, StudentPoints, Criteria, StudentCourse, Course } from '../models/index.js';

const router = express.Router();

// Get all students with user info
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role', 'phone']
      }],
      order: [['total_points', 'DESC']]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID with full info
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role', 'phone', 'avatar_bg']
        },
        {
          model: StudentPoints,
          include: [Criteria]
        },
        {
          model: Course,
          through: { attributes: ['status', 'completed_at'] }
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student points
router.put('/:id/points', async (req, res) => {
  try {
    const { criteria_id, points } = req.body;
    
    const studentPoint = await StudentPoints.findOne({
      where: {
        student_id: req.params.id,
        criteria_id
      }
    });

    if (studentPoint) {
      studentPoint.points = points;
      await studentPoint.save();
    } else {
      await StudentPoints.create({
        student_id: req.params.id,
        criteria_id,
        points
      });
    }

    // Recalculate total points
    const totalPoints = await StudentPoints.sum('points', {
      where: { student_id: req.params.id }
    });

    await Student.update(
      { total_points: totalPoints || 0 },
      { where: { id: req.params.id } }
    );

    res.json({ message: 'Points updated successfully', total_points: totalPoints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student courses
router.get('/:id/courses', async (req, res) => {
  try {
    const courses = await StudentCourse.findAll({
      where: { student_id: req.params.id },
      include: [Course]
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student course status
router.put('/:id/courses/:courseId', async (req, res) => {
  try {
    const { status } = req.body;
    
    const studentCourse = await StudentCourse.findOne({
      where: {
        student_id: req.params.id,
        course_id: req.params.courseId
      }
    });

    if (studentCourse) {
      studentCourse.status = status;
      if (status === 'Завершён') {
        studentCourse.completed_at = new Date();
      }
      await studentCourse.save();
    } else {
      await StudentCourse.create({
        student_id: req.params.id,
        course_id: req.params.courseId,
        status,
        completed_at: status === 'Завершён' ? new Date() : null
      });
    }

    res.json({ message: 'Course status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;