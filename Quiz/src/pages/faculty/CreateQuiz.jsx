import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facultyDetails = location.state?.facultyDetails;

  // Quiz Upload States
  const [quizFile, setQuizFile] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizzes, setQuizzes] = useState([]); // ✅ store uploaded quizzes

  const handleFileChange = (e) => {
    setQuizFile(e.target.files[0]);
  };

  // Handle quiz upload
  const handleQuizUpload = async () => {
    if (!quizFile || !quizTitle) {
      alert("Please enter a title and select a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvText = e.target.result;

      try {
        const res = await axios.post("http://localhost:5000/api/quizzes/upload", {
          title: quizTitle,
          facultyId: facultyDetails._id,
          csvData: csvText,
        });

        if (res.data.success) {
          alert("Quiz created successfully!");

          // ✅ Add new quiz to table
          const newQuiz = {
            id: res.data.data._id,
            title: res.data.data.title,
          };
          setQuizzes((prev) => [...prev, newQuiz]);

          setQuizFile(null);
          setQuizTitle("");
        } else {
          alert("❌ Error: " + res.data.message);
        }
      } catch (err) {
        console.error("Quiz upload error:", err);
        alert("❌ Something went wrong.");
      }
    };

    reader.readAsText(quizFile);
  };

  return (
    <div>
      {/* ✅ Create Quiz Section */}
      <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-50">
        <h4 className="text-md font-medium mb-2">Create Quiz</h4>

        <input
          type="text"
          placeholder="Enter Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md shadow-sm focus:ring focus:border-blue-300"
        />

        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border p-2 rounded-md shadow-sm"
          />
          <button
            onClick={handleQuizUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>

      {/* ✅ Quiz Table Section */}
      {quizzes.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
          <h4 className="text-md font-medium mb-3">Uploaded Quizzes</h4>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Quiz ID</th>
                <th className="border px-4 py-2">Quiz Title</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="text-center">
                  <td className="border px-4 py-2">{quiz.id}</td>
                  <td className="border px-4 py-2">{quiz.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
