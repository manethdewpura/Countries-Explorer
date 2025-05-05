import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaHeart,
  FaHome,
  FaUserPlus,
  FaGithub,
  FaHistory,
} from "react-icons/fa";
import { TbLogout, TbLogin } from "react-icons/tb";
import { logout } from "../store/authSlice.store";
import { auth } from "../firebase";

/**
 * HamburgerMenu component - Provides navigation sidebar and user menu
 * Handles user authentication state and navigation
 */
export default function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Handles user logout and navigation
   * Dispatches logout action and redirects to login page
   */
  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 
        dark:hover:bg-gray-600 transition-colors shadow-md border border-gray-200 
        dark:border-gray-600 mr-4"
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        className={`w-full fixed inset-0 z-30 backdrop-blur-sm transition-opacity duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 shadow-lg z-40 
        transform transition-transform duration-500 flex flex-col
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {user ? user.displayName || user.email : "Countries Explorer"}
          </h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col p-4 space-y-4 flex-grow">
          <li>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center hover:text-blue-500 cursor-pointer"
            >
              <FaHome className="text-2xl mr-5 text-gray-600 dark:text-gray-400" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/recently-viewed"
              onClick={() => setMenuOpen(false)}
              className="flex items-center hover:text-blue-500 cursor-pointer"
            >
              <FaHistory className="text-2xl mr-5 text-gray-600 dark:text-gray-400" />
              <span>Recently Viewed</span>
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/favorites"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center hover:text-blue-500 cursor-pointer"
                >
                  <FaHeart className="text-2xl mr-5 text-gray-600 dark:text-gray-400" />
                  <span>Favorites</span>
                </Link>
              </li>
              <li
                className="flex items-center hover:text-blue-500 cursor-pointer"
                onClick={handleLogout}
              >
                <TbLogout className="text-2xl mr-5 text-gray-600 dark:text-gray-400" />
                <span>Sign Out</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center hover:text-blue-500 cursor-pointer"
                >
                  <TbLogin className="text-2xl mr-5 text-gray-600 dark:text-gray-400" />
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center hover:text-blue-500 cursor-pointer"
                >
                  <FaUserPlus className="text-2xl mr-5 text-gray-600 dark:text-gray-400" />
                  <span>Sign Up</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex justify-center space-x-4 mt-4 text-gray-600 dark:text-gray-400">
            <a
              href="https://github.com/manethdewpura"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.facebook.com/maneth.mindiya/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.instagram.com/maneth_mindiya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaInstagram size={24} />
            </a>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Powered by{" "}
            <a
              href="https://restcountries.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300"
            >
              REST Countries API
            </a>
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Made by Maneth Dewpura
          </p>
        </div>
      </div>
    </>
  );
}
