import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const QuizResults = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const { quiz } = location.state || {};
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/${quizId}/submissions`);
        if (res.data.success) setSubmissions(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResults();
  }, [quizId]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{quiz?.title || "Quiz"} - Results</h2>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Student ID</th>
            <th className="border px-4 py-2">Submitted At</th>
            <th className="border px-4 py-2">Answers</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s._id} className="text-center">
              <td className="border px-4 py-2">{s.studentId?.name}</td>
              <td className="border px-4 py-2">{s.studentId?.studentId}</td>
              <td className="border px-4 py-2">{new Date(s.submittedAt).toLocaleString()}</td>
              <td className="border px-4 py-2">
                {s.answers.map((a) => (
                  <div key={a.questionId}>{a.selectedOption}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResults;
