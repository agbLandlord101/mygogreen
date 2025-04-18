/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizes[size]} inline-block`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const Popup = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/mygov");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4 text-[#007A33]">Identity Verification Required</h2>
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#007A33]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          To comply with Australian banking regulations, please verify your identity with myGovID.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleContinue}
            className="bg-[#007A33] text-white px-6 py-3 rounded-md hover:bg-[#006029] transition-colors font-medium text-sm"
          >
            Verify with myGov
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const closePopup = () => setShowPopup(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    if (!storedUsername) return;

    const fetchAccountData = async () => {
      try {
        const response = await fetch(
          `https://ymcq30o8c7.execute-api.us-east-1.amazonaws.com/profile/${storedUsername}`
        );
        const data = await response.json();
        setAccountData(data);
        if (!data.verified) setShowPopup(true);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };
   
    fetchAccountData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex flex-col md:flex-row">
      {showPopup && <Popup onClose={closePopup} />}
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A1A1A] text-white p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#007A33]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <h2 className="text-xl font-bold">UNAP</h2>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 hover:bg-[#2D2D2D] rounded-lg text-sm font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Accounts</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Good day, {accountData?.firstName}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-[#007A33]">●</span>
              <p className="text-sm text-gray-600">NetBank Saver (•••• {accountData?.accountNumber?.slice(-4)})</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!accountData?.verified && (
              <button
                className="bg-[#FFEB3B] text-[#1A1A1A] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FDD835] flex items-center"
                onClick={() => (window.location.href = '/mygov')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                Verify Identity
              </button>
            )}
            <div className="relative group">
              <div className="w-10 h-10 bg-[#007A33] rounded-full flex items-center justify-center text-white cursor-pointer">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded-lg p-4 mt-2 min-w-[200px]">
                <div className="text-sm font-medium text-gray-700">{username}</div>
                <div className="text-xs text-gray-500 mt-1">{accountData?.email}</div>
                <hr className="my-2" />
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Account Overview */}
        <section className="mb-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 sm:mb-0">
                Your Accounts
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => (window.location.href = '/registercard')}
                  className="bg-[#007A33] text-white px-5 py-2.5 rounded-md hover:bg-[#006029] text-sm font-medium"
                >
                  Transfer
                </button>
                <button
                  onClick={() => (window.location.href = '/lggreen')}
                  className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-md hover:bg-[#333333] text-sm font-medium"
                >
                  Make Payment
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border-l-4 border-[#007A33] bg-[#f8f9fa] p-6 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                      <p className="text-2xl font-bold text-[#1A1A1A]">
                      ${accountData?.loanAmount?.toLocaleString()}

                      </p>
                      <p className="text-xs text-gray-500 mt-2">NetBank Saver</p>
                    </div>
                    <div className="text-[#007A33]">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-[#1A1A1A] bg-[#f8f9fa] p-6 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Card Balance</p>
                      <p className="text-2xl font-bold text-[#1A1A1A]">
                        ${accountData?.cardBalance?.toLocaleString('en-AU')}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">VISA •••• {accountData?.cardLast4}</p>
                    </div>
                    <div className="text-[#1A1A1A]">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 3h2a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zm13 6h-8m8 4h-8m8 4h-8M7 16h-.01M7 13h-.01M7 10h-.01"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Transaction History */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border-b">
              <div className="flex items-center space-x-4">
                <div className="bg-[#007A33] p-2 rounded-full">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;