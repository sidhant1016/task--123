import { Model, DataTypes } from 'sequelize';
import sequelize from '../db'; // Sequelize instance
import Student from './student';

class Result extends Model {
  public id!: number;
  public score!: number;
  public studentId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly student?: Student; // Optional association with Student model

  // Define the association
  static associate() {
    Result.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
  }
}

Result.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'result',
  }
);

export default Result;
