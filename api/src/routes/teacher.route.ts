import express from 'express';
import {
  deleteTeacher,
  getSingleTeacher,
  login,
  register,
  updateTeacher,
} from '../controller/teacher.controller';

const teacherRoute = express.Router();

teacherRoute.post('/register', register);
teacherRoute.post('/login', login);
teacherRoute.put('/:id', updateTeacher);
teacherRoute.get('/:id', getSingleTeacher);
teacherRoute.delete('/:id', deleteTeacher);
export default teacherRoute;
