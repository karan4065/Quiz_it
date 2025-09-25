import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateQuiz = ({ facultyDetails }) => {
  const [quizFile, setQuizFile] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizTable, setShowQuizTable] = useState(false);
  const navigate = useNavigate();

  // Fetch quizzes
  const fetchQuizzes = async () => {
    if (!facultyDetails?._id) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/faculty/${facultyDetails._id}`
      );
      if (res.data.success) {
        setQuizzes(res.data.data);
        setShowQuizTable(true);
      } else {
        setQuizzes([]);
        setShowQuizTable(false);
      }
    } catch (err) {
      console.error(err);
      setQuizzes([]);
      setShowQuizTable(false);
    }
  };

  const handleFileChange = (e) => setQuizFile(e.target.files[0]);

  const handleQuizUpload = async () => {
    if (!quizFile || !quizTitle) return alert("Title and CSV required");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvText = e.target.result;
      try {
        const res = await axios.post("http://localhost:5000/api/quizzes/upload", {
          title: quizTitle,
          facultyId: facultyDetails?._id,
          csvData: csvText,
        });

        if (res.data.success) {
          setQuizzes((prev) => [...prev, res.data.data]);
          setQuizFile(null);
          setQuizTitle("");
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(quizFile);
  };

  const handleViewResults = (quiz) => {
    navigate(`/quiz-results/${quiz._id}`, { state: { quiz, facultyDetails } });
  };


  const handleDeleteQuiz = async (quizId) => {
    try {
  
      const res = await axios.delete(
        `http://localhost:5000/api/quizzes/${quizId}`
      );
      if(res.data){
        alert("Quiz delete Successfully")
      }
      if (res.data.success) {
        setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
      } else {
        alert("Failed to delete quiz");
      }

    } catch (err) {
      console.error(err);
      alert("Error deleting quiz");
    }
  };

  return (
    <div className="relative">
      <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-50">
        <h4 className="text-md font-medium mb-2">Create Quiz</h4>

        <input
          type="text"
          placeholder="Enter Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md shadow-sm"
        />

        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border p-2 rounded-md"
          />
          <button
            onClick={handleQuizUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={fetchQuizzes}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Get My Quizzes
          </button>
        </div>
      </div>

      {showQuizTable && quizzes.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg shadow-md bg-white relative">
          <button
            onClick={() => setShowQuizTable(false)}
            className="absolute top-2 right-2 text-red-500 font-bold"
          >
            ✕
          </button>

          <h4 className="text-md font-medium mb-3">All My Quizzes</h4>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Quiz ID</th>
                <th className="border px-4 py-2">Quiz Title</th>
                <th className="border px-4 py-2">Faculty</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className="text-center">
                  <td className="border px-4 py-2">{quiz._id}</td>
                  <td className="border px-4 py-2">{quiz.title}</td>
                  <td className="border px-4 py-2">
                    {facultyDetails?.name || "Unknown"}
                  </td>
                  <td className="border px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleViewResults(quiz)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
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
