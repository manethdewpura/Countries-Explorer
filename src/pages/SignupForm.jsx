import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

/**
 * SignupForm component - Handles new user registration
 * Manages form state, validation, and account creation
 */
export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  /**
   * Handles form submission and user registration
   * Validates passwords, creates user account, and updates profile
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter both passwords");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(user, {
        displayName: formData.name,
      });

      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address");
          break;
        default:
          setError("Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates form data state when input fields change
   */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
          Create Your Account
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg 
            bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
            focus:border-transparent outline-none transition-all"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            disabled={loading}
          />

          <input
            name="email"
            type="email"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg 
            bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
            focus:border-transparent outline-none transition-all"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            disabled={loading}
          />

          <input
            name="password"
            type="password"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg 
            bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
            focus:border-transparent outline-none transition-all"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            disabled={loading}
          />

          <input
            name="confirmPassword"
            type="password"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg 
            bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
            focus:border-transparent outline-none transition-all"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
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
              Creating Account...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 
            dark:hover:text-blue-300 font-medium"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
