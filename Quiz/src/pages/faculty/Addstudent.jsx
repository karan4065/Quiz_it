import React, { useState } from "react";
import axios from "axios";

const AddStudent = () => {
  const [studentFile, setStudentFile] = useState(null);
  const [students, setStudents] = useState([]);

  // Add form states
  const [addStudentId, setAddStudentId] = useState("");
  const [addName, setAddName] = useState("");
  const [addDepartment, setAddDepartment] = useState("");
  const [addYear, setAddYear] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");

  // Edit form states
  const [editStudentIdInput, setEditStudentIdInput] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editStudentId, setEditStudentId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // --- File Upload ---
  const handleFileChange = (e) => setStudentFile(e.target.files[0]);

  const handleStudentUpload = () => {
    if (!studentFile) return alert("Please select a CSV file.");
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvText = e.target.result;
      try {
        const res = await axios.post("http://localhost:5000/api/student/upload-csv", { csvData: csvText });
        if (res.data.success) {
          alert("✅ Students uploaded successfully!");
          setStudents([...students, ...res.data.data]);
          setStudentFile(null);
        } else alert("❌ " + res.data.message);
      } catch (err) {
        console.error(err);
        alert("❌ Something went wrong.");
      }
    };
    reader.readAsText(studentFile);
  };

  // --- Add Student ---
  const handleAddStudent = async () => {
    if (!addStudentId || !addName || !addDepartment || !addYear || !addEmail) {
      return alert("Fill all required fields");
    }
    try {
      const res = await axios.post("http://localhost:5000/api/student/register", {
        studentId: addStudentId,
        name: addName,
        department: addDepartment,
        year: addYear,
        email: addEmail,
        phone: addPhone,
      });
      if (res.data.success) {
        alert("✅ Student added successfully!");
        setStudents([...students, res.data.data]);
        clearAddForm();
      } else alert("❌ " + res.data.message);
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    }
  };

  // --- Fetch Student by Student ID for Update ---
  const handleFetchStudent = async () => {
    if (!editStudentIdInput) return alert("Enter a Student ID to fetch");
    try {
      const res = await axios.get(`http://localhost:5000/api/student/id/${editStudentIdInput}`);
      if (res.data.success) {
        const stu = res.data.data;
        setEditingStudent(stu);
        setEditStudentId(stu.studentId);
        setEditName(stu.name);
        setEditDepartment(stu.department);
        setEditYear(stu.year);
        setEditEmail(stu.email);
        setEditPhone(stu.phone);
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("❌ Student not found");
    }
  };

  // --- Update Student ---
  const handleUpdateStudent = async () => {
    if (!editingStudent) return alert("Fetch a student first");
    try {
      const res = await axios.put(`http://localhost:5000/api/student/${editingStudent._id}`, {
        studentId: editStudentId,
        name: editName,
        department: editDepartment,
        year: editYear,
        email: editEmail,
        phone: editPhone,
      });
      if (res.data.success) {
        alert("✅ Student updated successfully!");
        setStudents(students.map((stu) => (stu._id === editingStudent._id ? res.data.data : stu)));
        clearEditForm();
      } else alert("❌ " + res.data.message);
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    }
  };

  // --- Delete Student ---
  const handleDeleteStudent = async () => {
    if (!editingStudent) return alert("Fetch a student first");
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/student/${editingStudent._id}`);
      if (res.data.success) {
        alert("✅ Student deleted!");
        setStudents(students.filter((stu) => stu._id !== editingStudent._id));
        clearEditForm();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    }
  };

  const clearAddForm = () => {
    setAddStudentId(""); setAddName(""); setAddDepartment(""); setAddYear(""); setAddEmail(""); setAddPhone("");
  };
  const clearEditForm = () => {
    setEditingStudent(null); setEditStudentIdInput(""); setEditStudentId(""); setEditName("");
    setEditDepartment(""); setEditYear(""); setEditEmail(""); setEditPhone("");
  };

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-50">
      {/* Add Student */}
      <h4 className="text-lg font-semibold mb-3">➕ Add Students</h4>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input type="text" placeholder="Student ID" value={addStudentId} onChange={(e) => setAddStudentId(e.target.value)} className="border p-2 rounded-md" />
        <input type="text" placeholder="Name" value={addName} onChange={(e) => setAddName(e.target.value)} className="border p-2 rounded-md" />
        <input type="text" placeholder="Department" value={addDepartment} onChange={(e) => setAddDepartment(e.target.value)} className="border p-2 rounded-md" />
        <input type="text" placeholder="Year" value={addYear} onChange={(e) => setAddYear(e.target.value)} className="border p-2 rounded-md" />
        <input type="email" placeholder="Email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} className="border p-2 rounded-md" />
        <input type="text" placeholder="Phone" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} className="border p-2 rounded-md" />
      </div>
      <button onClick={handleAddStudent} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-4">Add Student</button>

      {/* Upload CSV */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-2">Upload Students via CSV</h4>
        <div className="flex items-center space-x-2">
          <input type="file" accept=".csv" onChange={handleFileChange} className="border p-2 rounded-md" />
          <button onClick={handleStudentUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Upload CSV</button>
        </div>
      </div>

      {/* Student List */}
      <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
        <h4 className="text-md font-medium mb-3">📋 Student List</h4>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Dept</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu._id} className="text-center">
                <td className="border px-4 py-2">{stu.studentId}</td>
                <td className="border px-4 py-2">{stu.name}</td>
                <td className="border px-4 py-2">{stu.department}</td>
                <td className="border px-4 py-2">{stu.year}</td>
                <td className="border px-4 py-2">{stu.email}</td>
                <td className="border px-4 py-2">{stu.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update/Delete */}
      <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
        <h4 className="text-md font-medium mb-3">✏️ Update / Delete Student by ID</h4>
        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="Enter Student ID" value={editStudentIdInput} onChange={(e) => setEditStudentIdInput(e.target.value)} className="border p-2 rounded-md" />
          <button onClick={handleFetchStudent} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Fetch</button>
        </div>

        {editingStudent && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="Student ID" value={editStudentId} onChange={(e) => setEditStudentId(e.target.value)} className="border p-2 rounded-md" />
            <input type="text" placeholder="Name" value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-2 rounded-md" />
            <input type="text" placeholder="Department" value={editDepartment} onChange={(e) => setEditDepartment(e.target.value)} className="border p-2 rounded-md" />
            <input type="text" placeholder="Year" value={editYear} onChange={(e) => setEditYear(e.target.value)} className="border p-2 rounded-md" />
            <input type="email" placeholder="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="border p-2 rounded-md" />
            <input type="text" placeholder="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="border p-2 rounded-md" />
            <div className="col-span-2 flex gap-2 mt-2">
              <button onClick={handleUpdateStudent} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Update</button>
              <button onClick={handleDeleteStudent} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
              <button onClick={clearEditForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
