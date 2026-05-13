import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // Handle Signup
  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert(response.data.message);

      navigate("/login");

    } catch (error) {

      alert(
        error.response.data.message
      );

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSignup}
        className="bg-white p-10 rounded-lg shadow-lg w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-8 text-center">
          Signup
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-3 rounded-md mb-5"
          required
        />

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
          Signup
        </button>

      </form>

    </div>
  );
}

export default Signup;