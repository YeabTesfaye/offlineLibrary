import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express, { Request, Response } from 'express';
const app = express();

// Rest package
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Security Package
import cors from 'cors';
import helmet from 'helmet';

// Routes
import studentRouter from './routes/student.routes';

// Middleware
import notFoundMiddleware from './middleware/notFound';
import errorHandlerMiddlewar from './middleware/errorHandler';
import teacherRoute from './routes/teacher.route';
import courseRouter from './routes/course.route';
import fileUpload from 'express-fileupload';
import gradeRouter from './routes/grade.route';
import adminRouter from './routes/admin.route';

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (_req: Request, res: Response) => {
  res.send('Offiline Liberary');
});
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  }),
);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/teachers', teacherRoute);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/grades', gradeRouter);
app.use('/api/v1/admin', adminRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddlewar);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server is listing at port ${PORT}`));
