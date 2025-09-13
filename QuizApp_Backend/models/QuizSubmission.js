import mongoose from "mongoose";
const { Schema, model } = mongoose;

const QuizSubmissionSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  answers: [
    {
      questionId: {
        type: Schema.Types.ObjectId, // Ensuring consistency with `Quiz` model's question `_id`
        required: true
      },
      selectedOption: {
        type: String,
        enum: ["Yes", "No", "Maybe"], // Ensuring only valid responses
        required: true
      }
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const QuizSubmission = model("QuizSubmission", QuizSubmissionSchema);

export default QuizSubmission;
