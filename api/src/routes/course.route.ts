import express from 'express';
import {
  deleteCourse,
  getAllCourses,
  getCourseByCourseCode,
  register,
  updateCourse,
} from '../controller/course.controller';
import {
  authenticatedUser,
  authorizeAdmin,
} from '../middleware/authentication';

const courseRouter = express.Router();

courseRouter.post('/register', register);
courseRouter.get('/', [authenticatedUser], getAllCourses);
courseRouter.get('/:id', [authenticatedUser], getCourseByCourseCode);
courseRouter.put('/:id', [authenticatedUser], authorizeAdmin, updateCourse);
courseRouter.delete('/:id', [authenticatedUser], authorizeAdmin, deleteCourse);
export default courseRouter;
