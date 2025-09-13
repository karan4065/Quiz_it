import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import CreateQuiz from "./CreateQuiz";

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

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchStudents = async (year) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/student?year=${year}&department=IT`
      );
      if (response.data.success) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } else {
        console.error(response.data.message);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleStudentClick = (student) => {
    navigate("/student-result", { state: { student } });
    setSelectedStudent(student);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  
  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="h-screen w-1/5 bg-[#1e254a] text-white p-6 shadow-xl flex flex-col justify-between fixed z-20">
          <div>
            <h2 className="text-xl font-bold mb-6 border-b pb-2 border-gray-400">Faculty Profile</h2>
            <div className="space-y-3 text-sm bg-[#2e3561] p-4 rounded-xl shadow-inner">
              <div><span className="font-semibold">Name:</span> {facultyDetails.name}</div>
              <div><span className="font-semibold">Email:</span> {facultyDetails.email}</div>
              <div><span className="font-semibold">UID:</span> {facultyDetails.uid}</div>
              <div><span className="font-semibold">Department:</span> {facultyDetails.department}</div>
              <div><span className="font-semibold">Joined On:</span> {new Date(facultyDetails.createdAt).toLocaleDateString()}</div>
              <div><span className="font-semibold">Last Update:</span> {new Date(facultyDetails.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-red-500 w-full py-2 rounded-md hover:bg-red-600 transition transform hover:scale-105 text-sm font-medium"
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
                    className="p-3 bg-[#cd354d] text-white rounded-lg hover:bg-[#f29109] transition duration-200 transform hover:scale-105"
                    onClick={() => setSelectedClass(year)}
                  >
                    {year} Year
                  </button>
                ))}
              </div>

              {!selectedClass && (
                <div className="mt-6">
                  <CreateQuiz />
                </div>
              )}

              {selectedClass && (
                <>
                  <h3 className="text-lg font-semibold mt-6">{selectedClass} Year Students</h3>

                 

                  {/* Search Students */}
                  <input
                    type="text"
                    placeholder="Search by name or UID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-6 border p-3 w-full rounded-md shadow-sm focus:ring focus:border-blue-300"
                  />

                  {/* Students Table */}
                  <table className="mt-4 border-collapse border border-gray-300 w-full text-sm shadow-lg rounded-lg overflow-hidden">
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
            <div>
              <h2 className="text-lg font-semibold mt-4">Selected Student</h2>
              <div className="border p-4 rounded-lg shadow-lg bg-gray-50 transition transform hover:scale-105">
                <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                <p>UID: {selectedStudent.studentId}</p>
                <p>Email: {selectedStudent.email}</p>
                <p>Phone: {selectedStudent.phone}</p>
                <p>Department: {selectedStudent.department}</p>
                <p>Year: {selectedStudent.year}</p>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="mt-4 bg-blue-500 p-2 text-white rounded hover:bg-blue-600 transition duration-200 transform hover:scale-105"
                >
                  Back to Students
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
