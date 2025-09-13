import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';
import CircularProgressBar from './CircularProgressBar';
import jsPDF from 'jspdf';
import axios from 'axios';

const StudentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { student } = location.state || {};

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!student) {
        return <div className="text-center text-red-600">No student data available.</div>;
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log("Fetching data for Student ID:", student._id);
                const response = await axios.get(
                    `http://localhost:5000/api/quizzes/68c3f4a8d8f5cf7b2c9dbc40/student/${student._id}/category-distribution`
                );

                console.log("API Response:", response.data);

                if (response.data.success) {
                    setCategories(response.data.data);
                } else {
                    console.error("Failed to fetch data:", response.data.message);
                }
            } catch (error) {
                console.error(
                    "Error fetching student result data:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [student]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text(`Student Name: ${student.name}`, 10, 10);
        doc.text(`Student ID: ${student.studentId}`, 10, 20);
        doc.text("Category-wise Answer Distribution:", 10, 30);

        categories.forEach((category, index) => {
            const yesPercentage = category.answers.Yes?.percentage || 0;
            const noPercentage = category.answers.No?.percentage || 0;
            const maybePercentage = category.answers.Maybe?.percentage
                                    || category.answers["MAY BE / NOT SURE"]?.percentage
                                    || 0;

            const baseY = 40 + index * 40;

            doc.text(`Category: ${category.category}`, 10, baseY);
            doc.text(`Yes: ${yesPercentage}%`, 10, baseY + 10);
            doc.text(`No: ${noPercentage}%`, 10, baseY + 20);
            doc.text(`Maybe: ${maybePercentage}%`, 10, baseY + 30);
        });

        doc.save('student_result.pdf');
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 space-y-8">
            {/* Student Details */}
            <section className="bg-[#f8fafc] p-6 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Information</h2>
                <p className="text-gray-700"><strong>Name:</strong> {student.name}</p>
                <p className="text-gray-700"><strong>Student ID:</strong> {student.studentId}</p>
                <p className="text-gray-700"><strong>Email:</strong> {student.email}</p>
                <p className="text-gray-700"><strong>Department:</strong> {student.department}</p>
                <p className="text-gray-700"><strong>Year:</strong> {student.year}</p>
            </section>

            {/* Category-wise Answer Distribution */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-center text-gray-700">
                    Category-wise Answer Distribution
                </h2>
                {categories.length === 0 ? (
                    <div className="text-center text-gray-600">No category data available.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((category, index) => {
                            const yes = category.answers.Yes?.percentage || 0;
                            const no = category.answers.No?.percentage || 0;
                            const maybe = category.answers.Maybe?.percentage
                                          || category.answers["MAY BE / NOT SURE"]?.percentage
                                          || 0;

                            return (
                                <motion.div
                                    key={category._id}
                                    className="text-center p-4 bg-gray-50 rounded-lg shadow-sm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">{category.category}</h3>

                                    <CircularProgressBar percentage={yes} />
                                    <p className="text-md text-gray-700">Yes: {yes.toFixed(2)}%</p>

                                    <CircularProgressBar percentage={no} />
                                    <p className="text-md text-gray-700">No: {no.toFixed(2)}%</p>

                                    <CircularProgressBar percentage={maybe} />
                                    <p className="text-md text-gray-700">Maybe: {maybe.toFixed(2)}%</p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Buttons */}
            <div className="flex justify-center mt-8 space-x-4">
                <button
                    onClick={downloadPDF}
                    className="flex items-center py-3 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition ease-in-out"
                >
                    <FaDownload className="mr-2" />
                    Download PDF
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center py-3 px-6 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition ease-in-out"
                >
                    <FaArrowLeft className="mr-2" />
                    Back
                </button>
            </div>
        </div>
    );
};

export default StudentResult;
