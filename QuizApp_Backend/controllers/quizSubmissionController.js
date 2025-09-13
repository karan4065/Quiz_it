import Quiz from "../models/Quiz.js";
import QuizSubmission from "../models/QuizSubmission.js";

export const submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  try {
    // Validate answers
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    // Fetch quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Flatten all questions across categories
    const allQuestions = quiz.categories.flatMap((cat) => cat.questions);

    // Calculate score
    let score = 0;
    const totalQuestions = allQuestions.length;

    const answerDetails = answers.map((answer) => {
      const question = allQuestions.find(
        (q) => q._id.toString() === answer.questionId
      );

      if (!question) {
        return {
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          correctAnswer: null,
          isCorrect: false,
          marksAwarded: 0,
        };
      }

      const correctAnswer = question.correctAnswer;
      let marksAwarded = 0;

      if (answer.selectedOption === "Maybe") {
        marksAwarded = 0.5; // ✅ half marks
      } else if (answer.selectedOption === correctAnswer) {
        marksAwarded = 1; // ✅ full marks
      } else {
        marksAwarded = 0; // ❌ wrong
      }

      score += marksAwarded;

      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        correctAnswer,
        isCorrect: marksAwarded === 1,
        marksAwarded,
      };
    });

    // Save submission (only allowed fields in schema)
    const submission = await QuizSubmission.create({
      studentId: req.user._id,
      quizId,
      answers, // only stores questionId + selectedOption
    });

    res.status(201).json({
      message: "Quiz submitted successfully",
      success: true,
      data: {
        score,
        totalQuestions,
        answerDetails,
        submissionId: submission._id,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
