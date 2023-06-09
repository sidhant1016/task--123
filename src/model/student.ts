import { Model, DataTypes } from 'sequelize';
import sequelize from '../db'; // Sequelize instance
import Result from './result';

class Student extends Model {
  public id!: number;
  public name!: string;
  public grade!: string; // Add the grade attribute

  // Define associations
  static associate() {
    Student.hasMany(Result, { foreignKey: 'studentId', as: 'results' });
  }
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING, // Set the data type for the grade attribute
      allowNull: true,
    },
    // Add other student attributes here
  },
  {
    sequelize,
    tableName: 'students',
    modelName: 'Student',
  }
);

export default Student;
