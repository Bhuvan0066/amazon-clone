import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        { token: credentialResponse.credential }
      );
      login(response.data.user, response.data.token);
      toast.success(`Account ready! Welcome, ${response.data.user.name}!`);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Signup failed. Please try again.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold font-serif text-[#131921]">G.C. Store</h1>
        </Link>
        <div className="bg-white p-8 rounded-lg border border-gray-300 shadow-sm flex flex-col items-center text-center">
          <h2 className="text-2xl font-medium mb-2">Create account</h2>
          <p className="text-sm text-gray-600 mb-6">Use your Google account to securely sign up.</p>
          
          <div className="w-full flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
              shape="rectangular"
              size="large"
            />
          </div>
          {loading && <p className="text-sm text-yellow-600 mt-2">Creating account...</p>}

          <p className="text-xs text-gray-500 mt-6 text-left">
            By creating an account, you agree to our{" "}
            <span className="text-[#007185] cursor-pointer hover:underline">Conditions of Use</span>{" "}
            and{" "}
            <span className="text-[#007185] cursor-pointer hover:underline">Privacy Notice</span>.
          </p>
        </div>
        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#007185] hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
