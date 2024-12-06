import express from 'express';
import {
  deleteGrade,
  getSingleGrade,
  registerGrade,
} from '../controller/grade.controller';

const gradeRouter = express.Router();

gradeRouter.post('/register', registerGrade);
gradeRouter.get('/:id', getSingleGrade);
gradeRouter.delete('/:id', deleteGrade);

export default gradeRouter;
