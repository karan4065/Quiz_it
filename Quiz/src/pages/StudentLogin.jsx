// StudentLogin.js
import React, { useState } from "react";
import quizImg from "./stu_login.jpg";

const StudentLogin = () => {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [quizId, setQuizId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Login Data:", { uid, password, quizId });
    alert(`UID: ${uid}\nPassword: ${password}\nQuiz ID: ${quizId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Heading */}
      <div className="text-center py-4 bg-white">
        <h1 className="text-3xl font-bold text-[#243185]">
          Welcome to Quiz System 🎓
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Student Login Portal – access quizzes and track your performance
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Side - Form */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
            <h2 className="text-3xl font-semibold text-center mb-8 text-[#243185]">
              Student Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* UID Field */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-1"
                  htmlFor="uid"
                >
                  UID
                </label>
                <input
                  type="text"
                  id="uid"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#313970]"
                  placeholder="Enter your UID"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#313970]"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Quiz ID Field */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-1"
                  htmlFor="quizId"
                >
                  Quiz ID
                </label>
                <input
                  type="text"
                  id="quizId"
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#313970]"
                  placeholder="Enter quiz ID"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#243185] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#cd354d] transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={quizImg}
            alt="Quiz Illustration"
            className="w-[600px] h-[600px] object-cover "
          />
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
