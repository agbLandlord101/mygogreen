"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Place this file at: app/thank-you/page.tsx
// Redirect to this page after a successful submit: router.push("/thank-you")

export default function ThankYouPage() {
  const router = useRouter();
  const [appId, setAppId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  

  useEffect(() => {
    // 1) Pull from localStorage if available
    const storedId = typeof window !== "undefined" ? localStorage.getItem("applicationId") : null;
    
    

    // 2) Generate if not already present (persist for refreshes)
    if (storedId) {
      setAppId(storedId);
    } else {
      const id = generateApplicationId();
      setAppId(id);
      try { localStorage.setItem("applicationId", id); } catch {}
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 shadow-sm print:hidden">
        <div className="max-w-3xl mx-auto p-4 flex items-center">
          
        </div>
      </header>

      {/* Main Card */}
      <main className="max-w-3xl mx-auto p-4 print:p-0">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-green-600"
                aria-hidden
              >
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.59a.75.75 0 1 0-1.22-.92l-3.774 5.012-1.71-1.71a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l4.374-5.598Z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-gray-600">We’ve received your information and started processing it.</p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Your Application Number</h3>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <code className="text-base font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900">
                {appId || "Generating..."}
              </code>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                aria-live="polite"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M15.75 3A2.25 2.25 0 0 1 18 5.25v9A2.25 2.25 0 0 1 15.75 16.5h-9A2.25 2.25 0 0 1 4.5 14.25v-9A2.25 2.25 0 0 1 6.75 3h9Zm3.75 3a.75.75 0 0 1 .75.75v10.5A3.75 3.75 0 0 1 16.5 21H8.25a.75.75 0 0 1 0-1.5H16.5a2.25 2.25 0 0 0 2.25-2.25V6.75a.75.75 0 0 1 .75-.75Z"/>
                </svg>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 print:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path fillRule="evenodd" d="M6.75 3A2.25 2.25 0 0 0 4.5 5.25V7.5h15V5.25A2.25 2.25 0 0 0 17.25 3h-10.5ZM19.5 9H4.5A2.25 2.25 0 0 0 2.25 11.25v4.5A2.25 2.25 0 0 0 4.5 18h.75v-3.75A2.25 2.25 0 0 1 7.5 12h9a2.25 2.25 0 0 1 2.25 2.25V18h.75a2.25 2.25 0 0 0 2.25-2.25v-4.5A2.25 2.25 0 0 0 19.5 9Zm-3 9.75v-3a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v3A2.25 2.25 0 0 0 9.75 21h4.5a2.25 2.25 0 0 0 2.25-2.25Z" clipRule="evenodd"/>
                </svg>
                Print receipt
              </button>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>• Save your application number for future reference.</li>
              <li>• You can view or update your details anytime from your profile.</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3 print:hidden">
              <button
                onClick={() => router.push("/profile")}
                className="px-5 py-2.5 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Go to Profile
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-5 py-2.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Return Home
              </button>
            </div>
          </div>

          {/* Footer helper text */}
          <p className="text-center text-xs text-gray-500 mt-6 print:hidden">
            Tip: You can always retrieve this number later from your Profile.
          </p>
        </div>
      </main>
    </div>
  );
}

function generateApplicationId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  // Prefer strong randomness in the browser
  let rand = "";
  try {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    rand = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 8)
      .toUpperCase();
  } catch {
    rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  }

  return `APP-${y}${m}${d}-${rand}`;
}
