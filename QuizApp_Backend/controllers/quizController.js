import mongoose from 'mongoose';
import Quiz from "../models/Quiz.js";
import QuizSubmission from '../models/QuizSubmission.js';
import Student from '../models/Student.js';
import Papa from 'papaparse'

// Create a new quiz
const createQuiz = async (req, res) => {
    try {
        const { title, categories, createdBy } = req.body;

        // Validate inputs
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Quiz title is required",
                data: null
            });
        }

        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one category with questions is required",
                data: null
            });
        }

        // Validate each category and its questions
        const isValid = categories.every(category => {
            return category.category && Array.isArray(category.questions) && category.questions.length > 0 &&
                category.questions.every(question => question.question && Array.isArray(question.options) && question.options.length > 0);
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Each category must have a category name and at least one question with options",
                data: null
            });
        }

        // Create a new quiz object
        const quiz = new Quiz({ title, categories, createdBy });

        // Save quiz to the database
        await quiz.save();

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            data: quiz
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getQuizSubmissions = async (req, res) => {
  const { quizId } = req.params;

  try {
    const submissions = await QuizSubmission.find({ quizId })
      .populate("studentId", "name studentId");
console.log(submissions)
    res.status(200).json({ success: true, data: submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Get a specific quiz by ID
const getQuiz = async (req, res) => {
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findById(quizId).populate('createdBy', 'name');
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found!"
            });
        }
        res.json({
            success: true,
            message: "Quiz fetched successfully.",
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const createQuizByFaculty = async (req, res) => {
  try {
    const { title, facultyId, csvData } = req.body;

    if (!title || !facultyId || !csvData) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Parse CSV
    const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    if (!parsed.data || parsed.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV is empty or invalid"
      });
    }

    // Group questions by category
    const categoriesMap = {};
    parsed.data.forEach((row) => {
      const category = row.Category || row.category;
      const question = row.Question || row.question;
      const optionsRaw = row.Options || row.options;

      if (!category || !question) return;

      // Parse options → default Yes/No/Maybe if none provided
      let options = ["Yes", "No", "Maybe"];
      if (optionsRaw) {
        options = optionsRaw.split(",").map((opt) => opt.trim());
      }

      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }

      categoriesMap[category].push({
        _id: new mongoose.Types.ObjectId(), // 🔑 force _id for each question
        question: question.trim(),
        options
      });
    });

    // Convert into array format for schema
    const categories = Object.keys(categoriesMap).map((cat) => ({
      category: cat,
      questions: categoriesMap[cat]
    }));

    // Create quiz
    const quiz = new Quiz({
      title,
      categories,
      createdBy: facultyId
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz
    });
  } catch (err) {
    console.error("Quiz upload error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};
// Get answer distribution for a specific quiz and student
const getQuizAnswerDistribution = async (req, res) => {
    const { quizId, studentId } = req.params;

    try {
        const submission = await QuizSubmission.findOne({
            quizId: quizId,
            studentId: studentId
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "No submission found for this quiz by the specified student"
            });
        }

        const totalAnswers = submission.answers.length;
        const answerCount = {
            yes: 0,
            no: 0,
            maybe: 0
        };

        submission.answers.forEach(answer => {
            const selectedOption = answer.selectedOption?.toLowerCase();
            if (selectedOption === "yes") answerCount.yes++;
            else if (selectedOption === "no") answerCount.no++;
            else if (selectedOption === "maybe") answerCount.maybe++;
        });

        const answerDistribution = totalAnswers > 0 ? {
            yes: ((answerCount.yes / totalAnswers) * 100).toFixed(2),
            no: ((answerCount.no / totalAnswers) * 100).toFixed(2),
            maybe: ((answerCount.maybe / totalAnswers) * 100).toFixed(2)
        } : {
            yes: 0,
            no: 0,
            maybe: 0
        };

        res.json({
            success: true,
            message: "Answer distribution fetched successfully",
            data: answerDistribution,
            submission
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get all quiz submissions for a specific student


// Get category-wise answer distribution for a specific quiz
const getCategoryWiseAnswerDistribution = async (req, res) => {
    const { quizId } = req.params;

    try {
        const results = await QuizSubmission.aggregate([
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quizId',
                    foreignField: '_id',
                    as: 'quizDetails'
                }
            },
            { $unwind: '$quizDetails' },
            { $unwind: '$answers' },
            {
                $group: {
                    _id: {
                        category: {
                            $arrayElemAt: ['$quizDetails.categories.category', 0]
                        },
                        selectedOption: '$answers.selectedOption'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.category',
                    options: { $push: { option: '$_id.selectedOption', count: '$count' } },
                    total: { $sum: '$count' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    answers: {
                        $arrayToObject: {
                            $map: {
                                input: '$options',
                                as: 'opt',
                                in: {
                                    k: '$$opt.option',
                                    v: {
                                        count: '$$opt.count',
                                        percentage: {
                                            $multiply: [
                                                { $divide: ['$$opt.count', '$total'] },
                                                100
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);
console.log(results)
        res.json({
            success: true,
            message: "Category-wise answer distribution fetched successfully",
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// New function to get category-wise answer distribution for a student
const getCategoryWiseAnswerDistributionForStudent = async (req, res) => {
    const { quizId, studentId } = req.params;

    try {
        const results = await QuizSubmission.aggregate([
            { $match: { quizId: new mongoose.Types.ObjectId(quizId), studentId: new mongoose.Types.ObjectId(studentId) } },
            { $unwind: '$answers' },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quizId',
                    foreignField: '_id',
                    as: 'quizDetails'
                }
            },
            { $unwind: '$quizDetails' },
            { $unwind: '$quizDetails.categories' }, // Unwinding categories to match them correctly
            { $unwind: '$quizDetails.categories.questions' }, // Unwind questions inside categories
            {
                $match: {
                    $expr: { $eq: ['$quizDetails.categories.questions._id', '$answers.questionId'] }
                }
            },
            {
                $group: {
                    _id: {
                        category: '$quizDetails.categories.category',
                        selectedOption: '$answers.selectedOption'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.category',
                    options: { $push: { option: '$_id.selectedOption', count: '$count' } },
                    total: { $sum: '$count' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    answers: {
                        $arrayToObject: {
                            $map: {
                                input: '$options',
                                as: 'opt',
                                in: {
                                    k: '$$opt.option',
                                    v: {
                                        count: '$$opt.count',
                                        percentage: {
                                            $multiply: [
                                                { $divide: ['$$opt.count', '$total'] },
                                                100
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.json({ 
            success: true, 
            message: "Category-wise answer distribution for student fetched successfully", 
            data: results 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// Export all functions
export { 
    createQuiz, 
    getQuiz, 
    getQuizAnswerDistribution, 
    getCategoryWiseAnswerDistribution, 
    getCategoryWiseAnswerDistributionForStudent,
    createQuizByFaculty
};
