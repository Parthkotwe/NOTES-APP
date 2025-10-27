import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from '../../utils/helper';
import Navbar from '../../components/Navbar/navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../axiosInstantce'; // check spelling

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Please enter a valid password";
      valid = false;
    }

    setError(newErrors);
    if (!valid) return;

    try {
      console.log("🔥 sending login:", { email, password });
      const response = await axiosInstance.post("/login", { email, password });
      console.log(response);
      if (response.data && response.data.accessToken) {
        // Save token consistently
        console.log("login succesfull",response);
        localStorage.setItem("accessToken", response.data.accessToken);
        alert("Login successful");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError({ email: err.response.data.message, password: err.response.data.message });
      } else {
        setError({ email: "An unexpected error occurred", password: "An unexpected error occurred" });
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white border border-gray-400 rounded-2xl shadow-md w-full max-w-sm p-8 mx-4">
          <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.email && <p className='text-red-500 text-sm mt-1'>{error.email}</p>}
            </div>

            <div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error.password && <p className='text-red-500 text-sm mt-1'>{error.password}</p>}
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Not registered yet?{" "}
            <Link to="/signup" className="text-blue-500 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
