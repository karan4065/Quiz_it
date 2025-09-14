// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import facultyImg from './fac_login.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Attempt faculty login first
      let response = await fetch('http://localhost:5000/api/faculty/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
        credentials: 'include',
      });

      let result = await response.json();

      if (response.ok && result.success) {
        // Faculty login successful, navigate to faculty dashboard
        console.log('Faculty login successful:', result.data);
        navigate("/faculty-dashboard", { state: { facultyDetails: result.data } });
      } else {
        // If faculty login fails
        alert("Invalid Username or password");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert(`An error occurred: ${error.message || 'Please try again later.'}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Heading */}
      <div className="text-center py-6 bg-white">
        <h1 className="text-4xl font-bold text-red-500">
          Welcome to Quiz System 👨‍🏫
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Faculty Login Portal – manage quizzes, monitor results, and track student progress
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Side - Form */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px]">
            <h2 className="text-4xl font-semibold text-center mb-10 text-red-400">
              Faculty Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-400 text-white font-bold py-3 rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={facultyImg}
            alt="Faculty Illustration"
            className="w-[600px] h-[600px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
