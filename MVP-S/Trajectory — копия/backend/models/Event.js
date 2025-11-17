import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Семинар', 'Воркшоп', 'Хакатон', 'Конференция'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Обязательное', 'Рекомендованное', 'Необязательное')
  },
  points: {
    type: DataTypes.INTEGER
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Запланировано', 'Завершено'),
    defaultValue: 'Запланировано'
  },
  participants_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'events'
});

export default Event;