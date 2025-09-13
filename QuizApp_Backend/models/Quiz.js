import { Schema, model } from "mongoose";

const QuizSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    categories: [
        {
            category: { 
                type: String, 
                required: true 
            },
            questions: [
                {
                    _id: { type: Schema.Types.ObjectId, auto: true }, // Explicit ObjectId for each question
                    question: { 
                        type: String, 
                        required: true 
                    },
                    options: {
                        type: [String],
                        required: true,
                        default: ["Yes", "No", "Maybe"] // Default options
                    }
                }
            ]
        }
    ],
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'Faculty',
        required: true
    }
}, {
    timestamps: true
});

const Quiz = model("Quiz", QuizSchema);

export default Quiz;
