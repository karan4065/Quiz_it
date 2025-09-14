// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import pallotti from "./pallotti.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white text-slate-600 text-center px-6">
      {/* Logo at top center */}
      <div className="mt-2 mb-8 flex justify-center">
        <img
          src={pallotti}
          alt="pallotti_logo"
          className="h-28 w-auto object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="text-5xl text-red-400 font-bold mb-6 mt-20">
        Welcome to <span className="text-[#243185]">Quiz System</span>
      </h1>

      {/* Description */}
      <p className="text-lg text-red-00 max-w-2xl leading-relaxed mb-10">
        Our Quiz System is designed to provide an interactive platform for both{" "}
        <span className="font-semibold text-slate-700">students</span> and{" "}
        <span className="font-semibold text-slate-700">faculty</span>. Students can
        give quizzes to test their knowledge, while faculty members can create,
        manage, and analyze quiz results with ease.
        <br />
        <br />
        Simple. Fast. Reliable. Start exploring today..!!
      </p>

      {/* Buttons */}
      <div className="flex space-x-6">
        <button
          onClick={() => navigate("/student-login")}
          className="bg-[#243185] text-white font-semibold px-6 py-3 rounded-xl 
                     hover:bg-[#231171] transition transform hover:scale-105 shadow-lg"
        >
           Login as Student
        </button>

        <button
          onClick={() => navigate("/faculty-login")}
          className="bg-white text-red-400 font-semibold px-6 py-3 rounded-xl border 
                     hover:bg-white transition transform hover:scale-105 shadow-lg"
        >
           Login as Faculty
        </button>
      </div>
    </div>
  );
};

export default Home;
