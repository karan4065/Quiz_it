// routes/userRoutes.js
import express from 'express';
import { loginFaculty, registerFaculty } from '../controllers/facultyController.js';

const router = express.Router();

router.post('/register', registerFaculty);
router.get('')
// Login a user
router.post('/login', loginFaculty);

export default router;
