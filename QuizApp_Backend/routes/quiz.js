import express from 'express';
import { 
    createQuiz, 
    getQuiz, 
    getQuizAnswerDistribution, 
    getCategoryWiseAnswerDistribution,
    getCategoryWiseAnswerDistributionForStudent, 
    createQuizByFaculty,getQuizSubmissions
} from '../controllers/quizController.js';
import { submitQuiz } from '../controllers/quizSubmissionController.js';
// import { protect } from '../middlewares/user_middleware.js';
import protect2  from '../middlewares/user_middleware.js';
const router = express.Router();



router.get("/:quizId/submissions", getQuizSubmissions);


// Route to create a quiz
router.post('/create', createQuiz);

// Get a specific quiz by ID
router.get('/:quizId', getQuiz);

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
