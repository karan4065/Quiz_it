import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';
import Papa from 'papaparse';
// Generate a JWT token
const generateToken = (userId,quizId) => {
    return jwt.sign({ id: userId,quizId:quizId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expiry (30 days)
    });
};
import bcrypt from 'bcryptjs';

export const registerStudent = async (req, res) => {
    const { name, studentId, department, year, email, phone } = req.body;

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
            password:name
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
  console.log("Login request body:", req.body);

  const { uid, password, quizId } = req.body;

  // Validate presence
  if (!uid || !password || !quizId) {
    return res.status(400).json({
      success: false,
      message: "UID, password, and quizId are required",
    });
  }

  // Validate quizId is alphanumeric
  const alphaNumRegex = /^[a-zA-Z0-9]+$/;
  if (!alphaNumRegex.test(quizId)) {
    return res.status(400).json({
      success: false,
      message: "Quiz ID must be alphanumeric",
    });
  }

  try {
    // Find student by UID (assuming uid field exists in your Student model)
    const student = await Student.findOne({studentId: uid });
    console.log(student)
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid UID or password",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, student.password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid UID or password",
      });
    }

    // Generate JWT token
    const token = generateToken(student._id,quizId);

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
    });

    // Remove password before sending student data
    student.password = undefined;

    // Optionally include quizId in response if needed
    res.status(200).json({
      success: true,
      message: "Student logged in successfully",
      data: {
        student,
        quizId,  // Return quizId back if needed on frontend
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
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

// export const getStudentByStudentID = async (req, res) => {
//     const { studentId } = req.params;

//     try {
//         const student = await Student.findOne({ studentId }).select('-password');
//         if (!student) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Student not found'
//             });
//         }
//         res.json({
//             success: true,
//             message: 'Student retrieved successfully',
//             data: student
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error',
//             error: error.message
//         });
//     }
// };
export const uploadStudentsCSV = async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ success: false, message: "CSV data is required" });
    }

    // Parse the CSV data
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true, // skip empty lines automatically
    });

    if (parsed.errors.length > 0) {
      return res.status(400).json({ success: false, message: "CSV parsing error", errors: parsed.errors });
    }

    // Filter out rows missing essential fields
    const validStudents = parsed.data.filter(stu => stu.name && stu.studentId && stu.email && stu.password && stu.department && stu.year);

    if (validStudents.length === 0) {
      return res.status(400).json({ success: false, message: "No valid student data found" });
    }

    // Prepare student documents for insertion
    const studentsToInsert = await Promise.all(
      validStudents.map(async (stu) => {
        const hashedPassword = await bcrypt.hash(stu.password, 10);
        return {
          name: stu.name.trim(),
          studentId: stu.studentId.trim(),
          department: stu.department.trim(),
          year: Number(stu.year),
          email: stu.email.trim(),
          password: hashedPassword,
          phone: stu.phone ? stu.phone.trim() : "0000000000", // default if missing
        };
      })
    );

    // Insert into database
    const saved = await Student.insertMany(studentsToInsert, { ordered: false });

    res.json({ success: true, message: "Students uploaded successfully", data: saved });

  } catch (err) {
    console.error("Error uploading students CSV:", err);

    // Handle duplicate key errors specifically
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate entry error", error: err.keyValue });
    }

    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
// Delete student
// --- Update student by ID ---
export const updateStudent = async (req, res) => {
  try {
    const { name, studentId, department, year, email, phone } = req.body;
console.log(req.params)
console.log(req.body)
    // Find student by MongoDB _id
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Update only provided fields
    student.name = name || student.name;
    student.studentId = studentId || student.studentId;
    student.department = department || student.department;
    student.year = year || student.year;
    student.email = email || student.email;
    student.phone = phone || student.phone;

    // Update password if provided
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   student.password = await bcrypt.hash(password, salt);
    // }

    const updatedStudent = await student.save();
    updatedStudent.password = undefined; // Hide password in response
    res.json({ success: true, message: "Student updated successfully", data: updatedStudent });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Delete student by ID ---
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getStudentByStudentID = async (req, res) => {
  try {
    console.log(req.params)
    const student = await Student.findOne({ studentId: req.params.id }).select("-password");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    res.json({ success: true, message: "Student fetched successfully", data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};