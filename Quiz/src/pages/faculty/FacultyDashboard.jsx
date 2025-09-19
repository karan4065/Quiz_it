import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import CreateQuiz from "./CreateQuiz";
import Addstudent from "./Addstudent";

const FacultyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facultyDetails = location.state?.facultyDetails;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const cardRef = useRef();

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async (year) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/student?year=${year}&department=IT`
      );
      if (response.data.success) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudents([]);
    }
  };

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/student/submissions/${student._id}`
      );
      if (res.data.success) {
        setSubmissions(res.data.submissions);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setSubmissions([]);
    }
  };

  // Close student card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setSelectedStudent(null);
        setSubmissions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardRef]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="h-screen w-1/5 bg-[#1e254a] text-white p-6 shadow-xl fixed z-20 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 border-b pb-2 border-gray-400">
              Faculty Profile
            </h2>
            <div className="space-y-3 text-sm bg-[#2e3561] p-4 shadow-inner rounded-sm">
              <div>
                <span className="font-semibold">Name:</span> {facultyDetails.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {facultyDetails.email}
              </div>
              <div>
                <span className="font-semibold">UID:</span> {facultyDetails.uid}
              </div>
              <div>
                <span className="font-semibold">Department:</span> {facultyDetails.department}
              </div>
              <div>
                <span className="font-semibold">Joined On:</span>{" "}
                {new Date(facultyDetails.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Last Update:</span>{" "}
                {new Date(facultyDetails.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-red-500 w-full py-2 rounded-sm hover:bg-red-600 transition transform hover:scale-105 text-sm font-medium"
          >
            Logout
          </button>
        </aside>
      )}

      {/* Main Content */}
      <div className={`flex-grow transition-all duration-300 ${sidebarOpen ? "ml-[20%]" : ""}`}>
        <Navbar userName={`Hey, ${facultyDetails.name}`} onProfileClick={toggleSidebar} />

        <main className="p-8">
          {!selectedStudent ? (
            <div>
              <h2 className="text-xl font-semibold mt-4">Select a Class</h2>
              <div className="flex space-x-4 mt-2">
                {[1, 2, 3, 4].map((year) => (
                  <button
                    key={year}
                    className="p-3 bg-[#cd354d] text-white rounded-sm hover:bg-[#f29109] transition duration-200 transform hover:scale-105"
                    onClick={() => setSelectedClass(year)}
                  >
                    {year} Year
                  </button>
                ))}
              </div>

              {!selectedClass && (
                <div className="mt-6">
                  <CreateQuiz key={location.key} facultyDetails={facultyDetails} />
                  <Addstudent />
                </div>
              )}

              {selectedClass && (
                <>
                  <h3 className="text-lg font-semibold mt-6">{selectedClass} Year Students</h3>
                  <input
                    type="text"
                    placeholder="Search by name or UID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-6 border p-3 w-full rounded-sm shadow-sm focus:ring focus:border-blue-300"
                  />

                  <table className="mt-4 border-collapse border border-gray-300 w-full text-sm shadow-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3">Sr. No</th>
                        <th className="border border-gray-300 p-3">UID</th>
                        <th className="border border-gray-300 p-3">Student Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr
                            key={student._id}
                            onClick={() => handleStudentClick(student)}
                            className="cursor-pointer hover:bg-gray-200 transition-colors"
                          >
                            <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                            <td className="border border-gray-300 p-3 text-center">{student.studentId}</td>
                            <td className="border border-gray-300 p-3 text-center">{student.name}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center border border-gray-300 p-3">
                            No students found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          ) : (
            <div
              ref={cardRef}
              className="border shadow-lg bg-white rounded-sm max-w-3xl mx-auto p-6 mt-4 relative"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold border-b pb-2 mb-3">{selectedStudent.name}</h3>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">UID:</span> {selectedStudent.studentId}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {selectedStudent.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {selectedStudent.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Department:</span> {selectedStudent.department}
                  </p>
                  <p>
                    <span className="font-semibold">Year:</span> {selectedStudent.year}
                  </p>
                </div>

                <h4 className="text-lg font-semibold mt-4 border-b pb-1">Quiz Submissions</h4>
                {submissions.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    {submissions.map((sub) => (
                      <div key={sub._id} className="p-4 border shadow-sm bg-gray-50 rounded-sm hover:shadow-md transition duration-200">
                        <h5 className="font-semibold">{sub.quizId?.title || "Untitled Quiz"}</h5>
                        <p className="text-gray-600 text-sm">
                          Submitted: {new Date(sub.submittedAt).toLocaleString()}
                        </p>

                        <button
                           onClick={() =>
    navigate("/result", {
      state: {
        student: selectedStudent,
        submissionId: sub._id,
        quizTitle: sub.quizId?.title || "Untitled Quiz",
      },
    })
  }
                          className="mt-2 bg-green-500 text-white px-3 py-1 rounded-sm hover:bg-green-600 transition"
                        >
                          See Result 
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-600">No quiz submissions found.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
