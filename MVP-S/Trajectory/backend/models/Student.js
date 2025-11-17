import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  group: {
    type: DataTypes.STRING
  },
  university: {
    type: DataTypes.STRING
  },
  direction: {
    type: DataTypes.STRING
  },
  gpa: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  total_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  match_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  success_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  leadership: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  innovation: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  practice_score: {
    type: DataTypes.INTEGER
  },
  dob: {
    type: DataTypes.DATE
  },
  resume: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'students'
});

export default Student;