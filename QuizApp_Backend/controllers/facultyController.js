import jwt from 'jsonwebtoken';
import Faculty from '../models/Faculty.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, 'divyansh', {
      expiresIn: '30d', // Token expiry (30 days)
  });
};

export const registerFaculty = async (req, res) => {
    const { name, email, password, department, phone, address } = req.body;
  
    try {
      // Create a new user (basic details)
      const user = await Faculty.create({
        name, email, password, department, phone, address // explicitly set role to 'student'
      });
      if(user){
        res.json({
            success: true,
            message: 'Faculty register successfully',
            data: user
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


export const loginFaculty = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
       const user = await Faculty.findOne({ email });

        if (user && await user.password==password) {
          user.password = undefined;
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 1 days
            });
            res.json({
                success: true,
                message: 'User login successfully',
                data: user
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                data: null
            });
        }
    } catch (error) {
      console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            data: null
        });
    }
};