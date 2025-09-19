import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Convert answer to score
const getScore = (answers, questionId) => {
  const answer = answers.find((a) => a.questionId === questionId);
  if (!answer) return "";
  switch (answer.selectedOption) {
    case "Yes":
      return 1;
    case "Maybe":
      return 2;
    case "No":
      return 0;
    default:
      return "";
  }
};

const QuizResults = () => {
  const { quizId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch submissions (with student + answers + quiz data)
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}/submissions`
        );
        if (res.data.success) {
          const subs = res.data.data;
          console.log("Submissions:", subs);
          setSubmissions(subs);

          // Prefer questions from quiz object
          if (subs.length > 0 && subs[0].quiz?.questions) {
            setQuestions(subs[0].quiz.questions);
          } else if (subs.length > 0) {
            // If quiz.questions not included, build from answers
            const uniqueQs = [];
            subs[0].answers.forEach((ans) => {
              uniqueQs.push({ _id: ans.questionId });
            });
            setQuestions(uniqueQs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [quizId]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Quiz Results</h2>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border border-gray-300">Student Name</th>
              <th className="px-4 py-2 border border-gray-300">Student ID</th>
              <th className="px-4 py-2 border border-gray-300">Created At</th>
              {/* Dynamically add Q.1, Q.2, ... */}
              {questions.map((_, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 border border-gray-300 text-center"
                >
                  Q.{idx + 1}
                </th>
              ))}
              <th className="px-4 py-2 border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, sIdx) => {
              const { studentId, answers, submittedAt } = submission;
              const totalScore = questions.reduce((sum, q) => {
                const score = getScore(answers, q._id);
                return typeof score === "number" ? sum + score : sum;
              }, 0);

              return (
                <tr
                  key={submission._id}
                  className={`${
                    sIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-4 py-2 border border-gray-300">
                    {studentId?.name || "-"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {studentId?.studentId || "-"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {new Date(submittedAt).toLocaleString()}
                  </td>
                  {/* Dynamically render scores for each question */}
                  {questions.map((q) => (
                    <td
                      key={q._id}
                      className="px-3 py-2 border border-gray-300 text-center font-medium"
                    >
                      {getScore(answers, q._id)}
                    </td>
                  ))}
                  <td className="px-4 py-2 border border-gray-300 text-center font-bold text-blue-600">
                    {totalScore}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizResults;
