import express from 'express';
import { 
    createQuiz, 
    getQuiz, 
    getQuizAnswerDistribution, 
    getCategoryWiseAnswerDistribution,
    getCategoryWiseAnswerDistributionForStudent,saveProgress,
    createQuizByFaculty,getQuizSubmissions
} from '../controllers/quizController.js';
import { getCategoryDistribution } from '../controllers/quizSubmissionController.js';
import { submitQuiz } from '../controllers/quizSubmissionController.js';
// import { protect } from '../middlewares/user_middleware.js';
import protect2  from '../middlewares/user_middleware.js';
import { isAuthenticated } from '../middlewares/authMiddleware2.js';
const router = express.Router();



router.get("/:quizId/submissions", getQuizSubmissions);
// Save progress for a quiz
router.post("/:quizId/save-progress", isAuthenticated, saveProgress);
router.get('/quizzes/:quizId/student/:studentId/category-distribution', getCategoryDistribution);
// Route to create a quiz
router.post('/create', createQuiz);

// Get a specific quiz by ID
router.get('/:quizId',isAuthenticated, getQuiz);

// Submit a quiz
router.post('/:quizId/submit', protect2, submitQuiz);

// Get answer distribution for a specific quiz and student
router.get('/:quizId/student/:studentId', getQuizAnswerDistribution);

// Get category-wise answer distribution for a specific quiz
router.get('/:quizId/category-distribution', getCategoryWiseAnswerDistribution);

// Get category-wise answer distribution for a specific quiz and student
router.get('/:quizId/student/:studentId/category-distribution', getCategoryWiseAnswerDistributionForStudent);
router.post("/upload",createQuizByFaculty)


export default router;
