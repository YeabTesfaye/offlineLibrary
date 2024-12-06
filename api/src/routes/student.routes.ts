import express from 'express';
import {
  deleteStudent,
  getAllStudent,
  getSingleStudent,
  login,
  logout,
  register,
  updateStudent,
} from '../controller/student.controller';

const studentRouter = express.Router();

studentRouter.post('/register', register);
studentRouter.post('/login', login);
studentRouter.post('/logout', logout);
studentRouter.put('/update/:id', updateStudent);
studentRouter.delete('/delete/:id', deleteStudent);
studentRouter.get('/:id', getSingleStudent);
studentRouter.get('/', getAllStudent);
export default studentRouter;
