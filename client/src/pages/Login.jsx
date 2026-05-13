import { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  // Handle Login
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save User + Token
      login(
        response.data.user,
        response.data.token
      );

      alert("Login Successful");

      navigate("/");

    } catch (error) {

      alert(
        error.response.data.message
      );

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-lg shadow-lg w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-8 text-center">
          Login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded-md mb-5"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded-md mb-5"
          required
        />

        {/* Button */}
        <button
          type="submit"
          className="bg-yellow-400 w-full py-3 rounded-md font-semibold hover:bg-yellow-500"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;