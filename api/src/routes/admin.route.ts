import express from 'express';
import {
  register,
  login,
  getAdmin,
  logout,
  deleteAdmin,
} from '../controller/admin.controller';

const adminRouter = express.Router();

adminRouter.post('/register', register);
adminRouter.post('/login', login);
adminRouter.get('/:id', getAdmin);
adminRouter.post('/logout', logout);
adminRouter.delete('/:id', deleteAdmin);

export default adminRouter;
