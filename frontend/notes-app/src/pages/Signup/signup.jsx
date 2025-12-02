import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../axiosInstantce"; // <-- ensure spelling matches your file

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!name) {
      newErrors.name = "Please enter your full name";
      valid = false;
    }
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
      console.log("🔥 sending signup:", { name, email, password });
      const response = await axiosInstance.post("/signup", {
        fullName: name,
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        alert("Signup successful!");
        navigate("/login"); // or navigate("/dashboard") if you want to login immediately
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError({
          name: err.response.data.message,
          email: err.response.data.message,
          password: err.response.data.message,
        });
      } else {
        setError({
          name: "An unexpected error occurred",
          email: "An unexpected error occurred",
          password: "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white border border-gray-400 rounded-2xl shadow-md w-full max-w-sm p-8 mx-4">
          <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Sign Up
          </h1>

          <form onSubmit={handleSignup} className="flex flex-col space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error.name && (
                <p className="text-red-500 text-sm mt-1">{error.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
