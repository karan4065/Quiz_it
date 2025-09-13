// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                credentials:'include'
            });

            let result = await response.json();

            if (response.ok && result.success) {
                // Faculty login successful, navigate to faculty dashboard
                console.log('Faculty login successful:', result.data);
                navigate("/faculty-dashboard", { state: { facultyDetails: result.data } });
            } else {
                // If faculty login fails, attempt student login
                response = await fetch('http://localhost:5000/api/student/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: username, password }),
                    credentials:'include'
                });

                result = await response.json();

                if (response.ok && result.success) {
                    // Student login successful, navigate to student details
                    console.log('Student login successful:', result.data);
                    navigate("/student-details", { state: { student: result.data } });
                } else {
                    // Both logins failed
                    console.error('Login failed:', result.message);
                    alert(result.message || 'Login failed');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert(`An error occurred: ${error.message || 'Please try again later.'}`);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#313970]">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#cd354d] text-white font-semibold py-2 rounded hover:bg-[#f29109] transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
