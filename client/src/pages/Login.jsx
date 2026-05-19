import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        { token: credentialResponse.credential }
      );
      login(response.data.user, response.data.token);
      toast.success(`Welcome back, ${response.data.user.name}!`);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login failed. Please try again.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold font-serif text-[#131921]">G.C. Store</h1>
        </Link>
        <div className="bg-white p-8 rounded-lg border border-gray-300 shadow-sm flex flex-col items-center text-center">
          <h2 className="text-2xl font-medium mb-2">Sign in</h2>
          <p className="text-sm text-gray-600 mb-6">Securely sign in with your Google account.</p>
          
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
          {loading && <p className="text-sm text-yellow-600 mt-2">Signing in...</p>}

          <p className="text-xs text-gray-500 mt-6 text-left">
            By signing in, you agree to our{" "}
            <span className="text-[#007185] cursor-pointer hover:underline">Conditions of Use</span>{" "}
            and{" "}
            <span className="text-[#007185] cursor-pointer hover:underline">Privacy Notice</span>.
          </p>
        </div>
        <div className="flex items-center my-4 text-xs text-gray-500">
          <div className="flex-1 border-t border-gray-300" />
          <span className="mx-3">New to G.C. Store?</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>
        <Link to="/signup" className="block w-full text-center border border-gray-400 rounded-lg py-2 text-sm bg-gradient-to-b from-gray-50 to-gray-200 hover:from-gray-100">
          Create your G.C. Store account
        </Link>
      </div>
    </div>
  );
}

export default Login;
