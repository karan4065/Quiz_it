// routes/userRoutes.js
import express from 'express';
import {
  registerStudent,
  loginStudent,
  getStudentByStudentID,
  getYearDeptStudents,
  uploadStudentsCSV,
  updateStudent,
  deleteStudent,
  getStudentMe,getStudentQuizzes,getStudentQuizResult
} from '../controllers/studentController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Auth middleware to protect routes

const router = express.Router();

router.post('/register', registerStudent);

router.post('/login', loginStudent);
router.get("/me",getStudentMe);
router.get('/studentId/:studentId', getStudentByStudentID );

router.get('/', getYearDeptStudents);
router.get("/quiz-result/:submissionId", getStudentQuizResult);
router.post('/upload-csv', uploadStudentsCSV);
router.delete("/:id", deleteStudent);
// UPDATE / DELETE
router.put('/:studentId', updateStudent);
router.get('/id/:id',getStudentByStudentID)
router.delete('/delete/:studentId', deleteStudent);
router.get('/:studentId/quizzes', getStudentQuizzes);
export default router;
