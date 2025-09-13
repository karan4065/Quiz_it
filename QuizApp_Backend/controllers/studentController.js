import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';

// Generate a JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expiry (30 days)
    });
};
import bcrypt from 'bcryptjs';

export const registerStudent = async (req, res) => {
    const { name, studentId, department, year, email, phone, password } = req.body;

    try {
        const studentExists = await Student.findOne({ $or: [{ email }, { studentId }] });

        if (studentExists) {
            return res.status(400).json({
                success: false,
                message: 'Student already registered with this email or studentId'
            });
        }

        // Create a new student
        const student = new Student({
            name,
            studentId,
            department,
            year,
            email,
            phone,
            password
        });

        // Save the student to the database
        const savedStudent = await student.save();

        // Optional: Remove the password from the response
        savedStudent.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: savedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(student._id);
        res.cookie('token', token, {
            httpOnly: true, // Helps prevent XSS attacks
            secure: process.env.NODE_ENV === 'production', // Set secure to true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 days
        });

        student.password = undefined;

        res.json({
            success: true,
            message: 'Student logged in successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getYearDeptStudents = async (req, res) => {
    try {
        const { year, department } = req.query;

        let query = {};
        
        if (year) {
            query.year = year;
        }
        
        if (department) {
            query.department = department;
        }

        const students = await Student.find(query);

        if (students.length > 0) {
            res.json({
                success: true,
                message: 'Students retrieved successfully',
                data: students
            });
        } else {
            res.json({
                success: false,
                message: 'No students found for the specified criteria'
            });
        }
    } catch (error) {wwwww
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getStudentByStudentID = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findOne({ studentId }).select('-password');
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        res.json({
            success: true,
            message: 'Student retrieved successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
