import express from 'express';
import {
  deleteGrade,
  getAllGrades,
  getSingleGrade,
  registerGrade,
} from '../controller/grade.controller';
import {
  authenticatedUser,
  authorizeAdmin,
} from '../middleware/authentication';

const gradeRouter = express.Router();

gradeRouter.post('/register', registerGrade);
gradeRouter.get('/:id', [authenticatedUser], getSingleGrade);
gradeRouter.delete('/:id', [authenticatedUser], authorizeAdmin, deleteGrade);
gradeRouter.get('/', [authenticatedUser], getAllGrades);

export default gradeRouter;
