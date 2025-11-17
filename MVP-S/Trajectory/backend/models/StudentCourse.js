import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentCourse = sequelize.define('StudentCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Завершён', 'В процессе', 'Не завершён', 'Не начат'),
    defaultValue: 'Не начат'
  },
  completed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'student_courses',
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'course_id']
    }
  ]
});

export default StudentCourse;