import sequelize from '../config/database.js';
import User from './User.js';
import Student from './Student.js';
import Criteria from './Criteria.js';
import StudentPoints from './StudentPoints.js';
import Course from './Course.js';
import StudentCourse from './StudentCourse.js';
import Event from './Event.js';
import EventParticipant from './EventParticipant.js';
import HardSkill from './HardSkill.js';
import StudentSkill from './StudentSkill.js';
import Project from './Project.js';
import StudentProject from './StudentProject.js';
import ResearchWork from './ResearchWork.js';
import Internship from './Internship.js';
import Recommendation from './Recommendation.js';
import Application from './Application.js';
import Document from './Document.js';
import ApplicantScore from './ApplicantScore.js';

// Define associations
User.hasOne(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });

Student.hasMany(StudentPoints, { foreignKey: 'student_id' });
StudentPoints.belongsTo(Student, { foreignKey: 'student_id' });
Criteria.hasMany(StudentPoints, { foreignKey: 'criteria_id' });
StudentPoints.belongsTo(Criteria, { foreignKey: 'criteria_id' });

Student.belongsToMany(Course, { through: StudentCourse, foreignKey: 'student_id' });
Course.belongsToMany(Student, { through: StudentCourse, foreignKey: 'course_id' });

Student.belongsToMany(Event, { through: EventParticipant, foreignKey: 'student_id' });
Event.belongsToMany(Student, { through: EventParticipant, foreignKey: 'event_id' });

Student.belongsToMany(HardSkill, { through: StudentSkill, foreignKey: 'student_id' });
HardSkill.belongsToMany(Student, { through: StudentSkill, foreignKey: 'skill_id' });

Student.belongsToMany(Project, { through: StudentProject, foreignKey: 'student_id' });
Project.belongsToMany(Student, { through: StudentProject, foreignKey: 'project_id' });

Student.hasMany(ResearchWork, { foreignKey: 'student_id' });
ResearchWork.belongsTo(Student, { foreignKey: 'student_id' });

Student.hasMany(Internship, { foreignKey: 'student_id' });
Internship.belongsTo(Student, { foreignKey: 'student_id' });

Student.hasMany(Recommendation, { foreignKey: 'student_id' });
Recommendation.belongsTo(Student, { foreignKey: 'student_id' });

Student.hasMany(Application, { foreignKey: 'student_id' });
Application.belongsTo(Student, { foreignKey: 'student_id' });

Student.hasMany(Document, { foreignKey: 'student_id' });
Document.belongsTo(Student, { foreignKey: 'student_id' });

Student.hasMany(ApplicantScore, { foreignKey: 'student_id' });
ApplicantScore.belongsTo(Student, { foreignKey: 'student_id' });

export {
  sequelize,
  User,
  Student,
  Criteria,
  StudentPoints,
  Course,
  StudentCourse,
  Event,
  EventParticipant,
  HardSkill,
  StudentSkill,
  Project,
  StudentProject,
  ResearchWork,
  Internship,
  Recommendation,
  Application,
  Document,
  ApplicantScore
};