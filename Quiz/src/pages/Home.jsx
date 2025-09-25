import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "./pallotti_img.png"; // Use "/image.jpg" if placed in public
import logo from "../assets/logo.png";
import { FaUserGraduate, FaBuilding, FaUsers, FaTrophy, FaGlobe, FaFlag } from "react-icons/fa";
import { FaUniversity } from "react-icons/fa";
 

const stats = [
  { icon: <FaUserGraduate size={40} />, value: "670+", label: "Students Opted for Internship" },
  { icon: <FaBuilding size={40} />, value: "100+", label: "Companies for Internship" },
  { icon: <FaUsers size={40} />, value: "4000+", label: "Strong Alumni Connect" },
  { icon: <FaGlobe size={40} />, value: "5", label: "Continents" },
  { icon: <FaFlag size={40} />, value: "53", label: "Nations" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animation styles for stats cards */}
      <style>
        {`
          .stat-card {
            transition: transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
            will-change: transform;
          }
          .stat-card:hover {
            transform: rotateY(180deg);
          }
        `}
      </style>

      <nav
        style={{
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          background: "rgba(255,255,255,0.1)",
        }}
        className="w-full flex items-center justify-between px-6 py-3 absolute top-0 left-0 z-20"
      >
        {/* Left section: logo + title */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="College Logo"
            className="h-10 w-10 rounded-md object-contain"
            style={{ background: "white" }}
          />
          <span className="text-xl md:text-xl font-semibold text-white">
            St. Vincent Pallotti College of Engineering and Technology, Nagpur
          </span>
        </div>

        {/* Right section: buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/student-login")}
            className="bg-yellow-100 text-slate-900 font-semibold px-4 py-2 rounded hover:bg-yellow-200 transition shadow-lg"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate("/faculty-login")}
            className="bg-white text-blue-900 font-semibold px-4 py-2 rounded border hover:bg-blue-100 transition shadow-lg"
          >
            Faculty Login
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-70 z-0"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
        {/* Top header section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "3rem",
            padding: "3rem 1rem 1rem 1rem",
            textAlign: "left",
            flexWrap: "wrap",
            marginTop: "6rem", // <-- This adds margin to the top header section
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              color: "whitesmoke",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20%",
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "80px",
              minHeight: "80px",
            }}
          >
            <FaUniversity />
          </div>
          <div
            style={{
              maxWidth: "900px",
              fontSize: "22px",
              lineHeight: "1.6",
              textAlign: "justify",
              margin: "1rem auto",
              borderRadius: "20px",
              padding: "1.5rem 2rem",
            }}
          >
            <p className="font-semibold text-slate-200">
              St. Vincent Pallotti College of Engineering & Technology was established in 2004 by the Nagpur Pallottine Society. The College is accredited by NAAC with an A grade. It is affiliated to Nagpur University, approved by the Director of Technical Education, Mumbai, and AICTE, Government of India.
            </p>
          </div>
        </div>

        {/* Stats section with hover animation */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "2rem 0",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "20px",
                minWidth: "180px",
                padding: "1.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "1rem 0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{stat.icon}</div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>{stat.value}</h2>
              <div style={{ fontSize: "1.2rem", color: "palegoldenrod", marginTop: "0.5rem", fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* About + Vision & Mission section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            background: "rgba(255,255,255,0.03)",
            padding: "2rem",
            borderRadius: "14px",
            flexWrap: "wrap",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Add your About, Vision, Mission sections here as needed */}
        </div>
      </div>
    </div>
  );
};

export default Home;
