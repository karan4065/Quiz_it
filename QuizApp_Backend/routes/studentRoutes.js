// routes/userRoutes.js
import express from 'express';
import { registerStudent, loginStudent, getStudentByStudentID, getYearDeptStudents } from '../controllers/studentController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Auth middleware to protect routes

const router = express.Router();

router.post('/register', registerStudent);

router.post('/login', loginStudent);

router.get('/studentId/:studentId', getStudentByStudentID );

router.get('/', getYearDeptStudents);

export default router;
