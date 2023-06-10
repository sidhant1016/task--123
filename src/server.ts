import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import './db';
import * as dotenv from 'dotenv';
// import Result from './model/result';

import { addResult, updateResult, getResult } from './router/result';
import {signup} from './router/signup';
import  Result  from './model/result';

import {loginUser,forgotPassword,resetPassword} from './router/login';
import User from './model/user';
import path from "path"
import { multerConfig, uploadProfilePicture } from './multer/profile';
import Student from './model/student';
dotenv.config();
const port = 4444;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up User and Result models
User.sync();
Result.sync();

// Set up middleware to authenticate requests using JWT tokens
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN!);
    req.user = decodedToken as any;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
Result.associate();
Student.associate();

// Set up API routes
app.use('/upload/images', express.static(path.join(__dirname, 'upload', 'images')));
app.post('/user/signup', signup);
app.post('/user/login', loginUser);
app.post('/user/forgot-password', forgotPassword);
app.post('/user/reset-password', resetPassword);
app.post('/result', authenticateToken, addResult);
app.put('/result/:student_id', authenticateToken, updateResult);
app.get('/result',authenticateToken, getResult);
app.post('/user/profile-picture/:userId',authenticateToken, multerConfig.single('profilePicture'), uploadProfilePicture);
// Define the API endpoint
app.get('/api/students-results', async (req: Request, res: Response) => {
  try {
    const results = await Result.findAll({
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    // Transform the results to the desired output format
    const transformedResults = results.map((result) => {
      return {
        id: result.id,
        score: result.score,
        Student: {
          id: result.student?.id,
          name: result.student?.name,
          grade: result.student?.grade,
        },
      };
    }); 

    res.json(transformedResults);
  } catch (error) {
    console.error('Error fetching students and results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log("Server running on port:", port);
});


