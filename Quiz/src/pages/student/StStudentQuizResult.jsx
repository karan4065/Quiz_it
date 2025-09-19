import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import CircularProgressBar from "../faculty/CircularProgressBar";

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
          `http://localhost:5000/api/student/result/${submissionId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log("Result API Response:", response.data);
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

  if (loading) return <div className="text-center">Loading...</div>;

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

      {/* Overall Score */}
      <section className="flex flex-col items-center space-y-4">
        <CircularProgressBar percentage={percentage} />
        <p className="text-lg font-semibold text-gray-700">
          Score: {result.score} / {result.totalQuestions}
        </p>
      </section>

      {/* Category-wise Distribution */}
      {result.sections && result.sections.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Category-wise Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.sections.map((sec, idx) => {
              // calculate Yes / No / Maybe percentages
              const total = sec.total || 1;
              const yesPercent = Math.round((sec.yes || 0) / total * 100);
              const noPercent = Math.round((sec.no || 0) / total * 100);
              const maybePercent = Math.round((sec.maybe || 0) / total * 100);

              return (
                <div
                  key={idx}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col items-center"
                >
                  <h4 className="font-bold text-gray-700 mb-2">{sec.name}</h4>
                  <div className="flex space-x-6 mt-4">
                    <div className="flex flex-col items-center">
                      <CircularProgressBar percentage={yesPercent} color="#22c55e" />
                      <span className="mt-2 text-sm font-medium">Yes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CircularProgressBar percentage={noPercent} color="#ef4444" />
                      <span className="mt-2 text-sm font-medium">No</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CircularProgressBar percentage={maybePercent} color="#facc15" />
                      <span className="mt-2 text-sm font-medium">Maybe</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {sec.score} / {total} correct
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
