import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import CircularProgressBar from "../faculty/CircularProgressBar";

const StStudentQuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, submissionId } = location.state || {};

  const [categories, setCategories] = useState([]);
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
          // Assuming the main quiz result is elsewhere or you just want categories here:
          setCategories(response.data.data); // <-- categories array here
          setResult(response.data.data); // Optional: store full result if needed
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

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-red-600">
        Could not load quiz result or no categories available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 space-y-8">
      {/* Quiz & Student Details */}
      <section className="bg-[#f8fafc] p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {student.name}'s Quiz Result
        </h2>
        <p className="text-gray-700">
          <strong>Student ID:</strong> {student.studentId}
        </p>
        {/* You can add other details if you have */}
      </section>

      {/* Category-wise Distribution */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Category-wise Answer Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat._id || idx}
              className="p-6 border rounded-lg shadow-sm bg-gray-50 flex flex-col items-center"
            >
              <h4 className="text-lg font-bold text-gray-700 mb-4">
                {cat.category}
              </h4>

              <div className="flex flex-col space-y-6 w-full max-w-sm">
                {/* Yes */}
                <div className="flex items-center space-x-4">
                  <CircularProgressBar
                    percentage={cat.answers.Yes?.percentage || 0}
                    color="#22c55e"
                    size={70}
                    strokeWidth={6}
                  />
                  <div>
                    <p className="text-green-600 font-semibold text-lg">Yes</p>
                    <p className="text-gray-700">
                      Count: {cat.answers.Yes?.count || 0}
                    </p>
                    <p className="text-gray-500">
                      {cat.answers.Yes?.percentage?.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>

                {/* No */}
                <div className="flex items-center space-x-4">
                  <CircularProgressBar
                    percentage={cat.answers.No?.percentage || 0}
                    color="#ef4444"
                    size={70}
                    strokeWidth={6}
                  />
                  <div>
                    <p className="text-red-600 font-semibold text-lg">No</p>
                    <p className="text-gray-700">
                      Count: {cat.answers.No?.count || 0}
                    </p>
                    <p className="text-gray-500">
                      {cat.answers.No?.percentage?.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>

                {/* Maybe */}
                <div className="flex items-center space-x-4">
                  <CircularProgressBar
                    percentage={cat.answers.Maybe?.percentage || 0}
                    color="#facc15"
                    size={70}
                    strokeWidth={6}
                  />
                  <div>
                    <p className="text-yellow-500 font-semibold text-lg">Maybe</p>
                    <p className="text-gray-700">
                      Count: {cat.answers.Maybe?.count || 0}
                    </p>
                    <p className="text-gray-500">
                      {cat.answers.Maybe?.percentage?.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
