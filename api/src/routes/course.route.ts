import express from 'express';
import {
  deleteCourse,
  getAllCourses,
  getCourseByCourseCode,
  register,
  updateCourse,
} from '../controller/course.controller';

const courseRouter = express.Router();

courseRouter.post('/register', register);
courseRouter.get('/', getAllCourses);
courseRouter.get('/:id', getCourseByCourseCode);
courseRouter.put('/:id', updateCourse);
courseRouter.delete('/:id', deleteCourse);
export default courseRouter;
