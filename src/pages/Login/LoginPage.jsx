import React, { useState } from "react";
import { login, loadUser } from "../../services/AuthService";
import Login from "./Login";
import { setUser } from "../../services/UserService";

function LoginPage({ onSuccess }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handles login form submission
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
      const user = await loadUser();
      setUser(user);
      if (onSuccess) onSuccess();
      return {}; // success: no errors
    } catch (err) {


      // Capture validation errors if they exist
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors) {
        return { errors: validationErrors };
      }

      // Otherwise set a global error
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      return {};
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          {/* You can import and use Building2 icon here if needed */}
          <h1 className="text-2xl font-bold text-gray-900">HRM System</h1>
        </div>
        {/* Only Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 mt-2">Please sign in to your account</p>
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>
          )}
          <Login onSuccess={handleLogin} loading={loading} />
        </div>
        {/* Demo Credentials (optional) */}
        {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-purple-800 font-medium mb-2">
            Demo Credentials:
          </p>
          <p className="text-sm text-blue-700">
            <span className="font-mono">admin@hrm.com</span> /{" "}
            <span className="font-mono">admin123</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default LoginPage;
