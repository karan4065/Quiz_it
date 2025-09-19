import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import CircularProgressBar from "./CircularProgressBar";

const StStudentQuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, submissionId } = location.state || {};

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!student || !submissionId) {
    return (
      <div className="text-center text-red-600">
        Missing required data. Please go back.
      </div>
    );
  }

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/student/quiz-result/${submissionId}`
        );

        console.log("Result API Response:", response.data);

        if (response.data.success) {
          setResult(response.data.data);
        } else {
          console.error("Failed to fetch result:", response.data.message);
        }
      } catch (error) {
        console.error(
          "Error fetching quiz result:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [submissionId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!result) {
    return (
      <div className="text-center text-red-600">
        Could not load quiz result.
      </div>
    );
  }

  const percentage =
    result.totalQuestions > 0
      ? Math.round((result.score / result.totalQuestions) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 space-y-8">
      {/* Quiz & Student Details */}
      <section className="bg-[#f8fafc] p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {result.quiz?.title || "Quiz Result"}
        </h2>
        <p className="text-gray-700">
          <strong>Student:</strong> {student.name} ({student.studentId})
        </p>
        <p className="text-gray-700">
          <strong>Submitted At:</strong>{" "}
          {new Date(result.submittedAt).toLocaleString()}
        </p>
      </section>

      {/* Score Section */}
      <section className="flex flex-col items-center space-y-4">
        <CircularProgressBar percentage={percentage} />
        <p className="text-lg font-semibold text-gray-700">
          Score: {result.score} / {result.totalQuestions}
        </p>
      </section>

      {/* Section-wise Breakdown */}
      {result.sections && result.sections.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Section Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.sections.map((sec, idx) => {
              const secPercentage =
                sec.total > 0 ? Math.round((sec.score / sec.total) * 100) : 0;
              return (
                <div
                  key={idx}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col items-center"
                >
                  <h4 className="font-bold text-gray-700 mb-2">{sec.name}</h4>
                  <CircularProgressBar percentage={secPercentage} />
                  <p className="text-sm text-gray-600 mt-2">
                    {sec.score} / {sec.total}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Back Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center py-3 px-6 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition ease-in-out"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>
    </div>
  );
};

export default StStudentQuizResult;
