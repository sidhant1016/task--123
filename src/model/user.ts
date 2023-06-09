import { Model, DataTypes } from 'sequelize';
import sequelize  from '../db';


export class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!:string;
    profilePictureUrl: string | undefined;


}

User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin','teacher','student'),
      allowNull: false,
    },
  }, {
    tableName: 'users',
    sequelize,
    timestamps: false,
  });

  export default User