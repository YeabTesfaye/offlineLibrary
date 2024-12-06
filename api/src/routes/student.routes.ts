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
import {
  authenticatedUser,
  authorizeAdmin,
} from '../middleware/authentication';

const studentRouter = express.Router();

studentRouter.post('/register', register);
studentRouter.post('/login', login);
studentRouter.post('/logout', authenticatedUser, logout);
studentRouter.put('/:id', [authenticatedUser], authorizeAdmin, updateStudent);
studentRouter.delete(
  '/:id',
  [authenticatedUser],
  authorizeAdmin,
  deleteStudent,
);
studentRouter.get('/:id', [authenticatedUser], getSingleStudent);
studentRouter.get('/', [authenticatedUser], getAllStudent);
export default studentRouter;
