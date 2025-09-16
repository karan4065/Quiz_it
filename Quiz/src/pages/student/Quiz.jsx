import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar"; // adjust path as needed

const Quiz = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null); // ✅ fetched student details

  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Toggle Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ✅ Logout handler
  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/"); // redirect to login
  };

  // ✅ Fetch student details using cookie
  const loadStudent = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/student/me", {
        withCredentials: true, // send cookie
      });
      console.log(data)
      if (data.success) {
        setStudent(data.student); // backend should return { success: true, student: {...} }
      }
    } catch (err) {
      console.error("Student fetch error:", err);
      handleLogout(); // if cookie invalid → logout
    }
  };

  // ✅ Load quiz questions
  const loadQuiz = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/quizzes/${quizId}`,
        { withCredentials: true }
      );
      if (data.success) setCategories(data.data.categories || []);
    } catch (err) {
      console.error("Quiz fetch error:", err);
    }
  };

  useEffect(() => {
    if (quizId) loadQuiz();
    loadStudent(); // ✅ fetch student on mount
  }, [quizId]);

  const questions = categories.flatMap((cat) => cat.questions);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!quizCompleted && timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      } else if (timeLeft === 0) {
        setQuizCompleted(true);
        handleSubmit();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizCompleted]);

  // Handle option selection
  const handleOptionClick = (option) => {
    const updated = [...answers];
    const qId = questions[currentQuestionIndex]?._id;
    const index = updated.findIndex((ans) => ans.questionId === qId);

    if (index !== -1) {
      updated[index].selectedOption = option;
    } else {
      updated.push({ questionId: qId, selectedOption: option });
    }

    setAnswers(updated);
    setSelectedOption(option);
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/quizzes/${quizId}/submit`,
        { answers },
        { withCredentials: true }
      );
      navigate("/thank-you");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Keep selected answer highlighted
  useEffect(() => {
    const currQ = questions[currentQuestionIndex];
    const ans = answers.find((a) => a.questionId === currQ?._id);
    setSelectedOption(ans?.selectedOption || null);
  }, [currentQuestionIndex]);

  const isAnswered = (i) =>
    answers.some((a) => a.questionId === questions[i]?._id);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar with toggleSidebar */}
      <Navbar
        userName={student?.name || "Student"}
        onProfileClick={toggleSidebar}
      />

      {/* Sidebar Drawer (👉 opens from LEFT now) */}
      {sidebarOpen && (
        <aside className="h-screen w-1/5 bg-[#1e254a] text-white p-6 shadow-xl flex flex-col justify-between fixed top-0 left-0 z-50">
          <div>
            <h2 className="text-xl font-bold mb-6 border-b pb-2 border-gray-400">
              Student Profile
            </h2>
            <div className="space-y-3 text-sm bg-[#2e3561] p-4 rounded-xl shadow-inner">
              <div>
                <span className="font-semibold">Name:</span> {student?.name}
              </div>
              <div>
                <span className="font-semibold">ID:</span> {student?.studentId}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {student?.email}
              </div>
              <div>
                <span className="font-semibold">Department:</span>{" "}
                {student?.department}
              </div>
              <div>
                <span className="font-semibold">Year:</span> {student?.year}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 w-full py-2 rounded-md hover:bg-red-600 transition transform hover:scale-105 text-sm font-medium"
          >
            Logout
          </button>
        </aside>
      )}

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Quiz Section */}
      <div className="flex flex-grow">
        {/* Quiz Questions */}
        <div className="flex-grow p-6">
          {/* Timer Display */}
          <div className="flex justify-end mb-4 text-lg font-semibold text-red-600">
            Time Left: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>

          {questions.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                {questions[currentQuestionIndex]?.question}
              </h2>
              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt)}
                    className={`block w-full p-3 rounded-lg border ${
                      selectedOption === opt
                        ? "bg-green-100 border-green-600"
                        : "bg-white border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="bg-[#cd354d] text-white py-2 px-4 rounded hover:bg-[#f29109]"
            >
              Previous
            </button>
            <button
              disabled={currentQuestionIndex === questions.length - 1}
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="bg-[#cd354d] text-white py-2 px-4 rounded hover:bg-[#f29109]"
            >
              Next
            </button>
            {currentQuestionIndex === questions.length - 1 && (
              <button
                onClick={handleSubmit}
                disabled={answers.length !== questions.length}
                className={`py-2 px-4 rounded text-white ${
                  answers.length === questions.length
                    ? "bg-[#cd354d] hover:bg-[#f29109]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {/* Navigation Panel */}
        <div className="w-full md:w-1/4 bg-white p-4 shadow-md rounded-lg mt-6 md:mt-0 md:ml-4">
          <h2 className="font-bold text-lg mb-4 border-b pb-2 text-center">
            Question Navigation
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-3">
            {questions.map((_, i) => {
              const isCurrent = i === currentQuestionIndex;
              const answered = isAnswered(i);
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`
                    w-10 h-10 rounded-full font-semibold text-sm flex items-center justify-center
                    transition duration-300 ease-in-out
                    ${
                      isCurrent
                        ? "ring-2 ring-blue-500 bg-blue-100"
                        : answered
                        ? "bg-green-300 hover:bg-green-400"
                        : "bg-yellow-100 hover:bg-yellow-200"
                    }
                  `}
                  title={`Question ${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
