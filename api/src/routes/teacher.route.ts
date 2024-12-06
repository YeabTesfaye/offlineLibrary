import express from 'express';
import {
  deleteTeacher,
  getSingleTeacher,
  login,
  register,
  updateTeacher,
  logout,
  getAllTeacher,
} from '../controller/teacher.controller';
import {
  authenticatedUser,
  authorizeAdmin,
} from '../middleware/authentication';

const teacherRoute = express.Router();

teacherRoute.post('/register', register);
teacherRoute.post('/login', login);
teacherRoute.post('/logout', [authenticatedUser], logout);
teacherRoute.put('/:id', [authenticatedUser], authorizeAdmin, updateTeacher);
teacherRoute.get('/:id', [authenticatedUser], getSingleTeacher);
teacherRoute.delete('/:id', [authenticatedUser], authorizeAdmin, deleteTeacher);
teacherRoute.get('/', [authenticatedUser], getAllTeacher);
export default teacherRoute;
