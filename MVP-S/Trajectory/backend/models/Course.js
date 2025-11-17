import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Обязательный', 'Рекомендованный', 'Необязательный'),
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  direction: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('активен', 'неактивен'),
    defaultValue: 'активен'
  }
}, {
  tableName: 'courses'
});

export default Course;