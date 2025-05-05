import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CountryDetails from "./pages/CountryDetails";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Favorites from "./pages/Favorites";
import RecentlyViewed from "./pages/RecentlyViewed";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.auth);
  const { darkMode, useSystemTheme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (useSystemTheme) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    } else {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode, useSystemTheme]);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <LoginForm /> : <Navigate to="/" replace />}
      />
      <Route
        path="/signup"
        element={!user ? <SignupForm /> : <Navigate to="/" replace />}
      />
      <Route path="/" element={<Home />} />
      <Route path="/country/:code" element={<CountryDetails />} />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route path="/recently-viewed" element={<RecentlyViewed />} />
    </Routes>
  );
}

export default App;
