import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice.store";
import ThemeToggle from "../components/ThemeToggle";

/**
 * LoginForm component - Handles user authentication
 * Manages form state and authentication error handling
 */
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const auth = getAuth();

  /**
   * Handles form submission and authentication
   * Dispatches appropriate actions based on authentication result
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, pw);
      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
      navigate("/");
    } catch (err) {
      let errorMessage;
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email is already registered. Please try logging in instead.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters long.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/user-not-found":
          errorMessage =
            "No account found with this email. Please register first.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        default:
          errorMessage = "An error occurred. Please try again.";
      }
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg animate-fadeIn"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Welcome Back
        </h2>
        <div className="space-y-4">
          <input
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg 
            bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
            focus:border-transparent outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            disabled={loading}
          />
          <input
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg
            bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
            focus:border-transparent outline-none transition-all"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            type="password"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 
          rounded-lg text-red-600 dark:text-red-200 text-sm animate-fadeIn"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-6 p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 
          dark:hover:bg-blue-700 text-white rounded-lg transition-colors
          disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 
            dark:hover:text-blue-300 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
