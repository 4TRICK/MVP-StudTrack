import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentPoints = sequelize.define('StudentPoints', {
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
  criteria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'criteria',
      key: 'id'
    }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'student_points',
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'criteria_id']
    }
  ]
});

export default StudentPoints;