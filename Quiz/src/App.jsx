import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Correct path
import Quiz from "./pages/student/Quiz"; // Make sure the path is correct
import ThankYou from "./pages/student/ThankYou"; // Make sure the path is correct
import FacultyDashboard from "./pages/faculty/FacultyDashboard"; // Import your faculty dashboard
import StudentResult from "./pages/faculty/StudentResult"; // Import the StudentResult component
import StudentDetails from "./pages/student/StudentDetails"; // Import StudentDetails

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/student-details" element={<StudentDetails />} /> {/* Add route for Student Details */}
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                <Route path="/student-result" element={<StudentResult />} />
            </Routes>
        </Router>
    );
};

export default App;
