import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import User  from '../model/user';
import '../db';
import dotenv from 'dotenv';


dotenv.config({ path: './config.env' });


const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/;
const message = { 'string.pattern.base': "Password must contain at least one alphabet, one number, and one special character (@#$%^&+=!)." }
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp(pattern)).required().messages(message)
});


function getRole(email: string): string {
  const adminEmail = process.env.ADMIN_EMAIL;
  const teacherEmail = process.env.TEACHER_EMAIL;


  if (adminEmail && new RegExp(adminEmail).test(email)) {
    return 'admin';
  } else if (teacherEmail && new RegExp(teacherEmail).test(email)) {
    return 'teacher';
  } else {
    return 'student';
  }
}


export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password } = value;

    const existingEmail = await User.findOne({ where: { email: email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = getRole(email);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Register successful' })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'oops! fail to register' });
  }
};

export default {signup};