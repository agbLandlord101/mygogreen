/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";

type Picked = {
  file: File;
  previewUrl: string;
};

export default function UploadIdPage() {
  const [front, setFront] = useState<Picked | null>(null);
  const [back, setBack] = useState<Picked | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  function isImage(file?: File | null) {
    return !!file && file.type.startsWith("image/");
  }

  function onPick(which: "front" | "back", file?: File | null) {
    if (!file) return;
    if (!isImage(file)) {
      setMessage({ type: "error", text: "Please upload image files only (jpg, png, webp)." });
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const picked = { file, previewUrl };

    if (which === "front") {
      if (front?.previewUrl) URL.revokeObjectURL(front.previewUrl);
      setFront(picked);
    } else {
      if (back?.previewUrl) URL.revokeObjectURL(back.previewUrl);
      setBack(picked);
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, which: "front" | "back") {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onPick(which, file || null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!front?.file || !back?.file) {
      setMessage({ type: "error", text: "Please select both front and back images." });
      return;
    }

    // Optional client-side size guard (Telegram accepts up to ~20MB per file)
    const maxMB = 15;
    for (const f of [front.file, back.file]) {
      if (f.size > maxMB * 1024 * 1024) {
        setMessage({ type: "error", text: `Each image must be <= ${maxMB}MB.` });
        return;
      }
    }

    try {
      setSubmitting(true);
      const form = new FormData();
      form.append("front", front.file);
      form.append("back", back.file);
      form.append("note", note);

      const res = await fetch("/api/telegram-upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setMessage({ type: "success", text: "Sent to Telegram successfully." });
      // reset
      if (front?.previewUrl) URL.revokeObjectURL(front.previewUrl);
      if (back?.previewUrl) URL.revokeObjectURL(back.previewUrl);
      setFront(null);
      setBack(null);
      setNote("");
    } catch (err: unknown) {
  if (err instanceof Error) {
    setMessage({ type: "error", text: err.message });
  } else {
    setMessage({ type: "error", text: "Something went wrong." });
  }
} finally {
  setSubmitting(false);
}

  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="w-full sticky top-0 z-10 bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logogreen.svg" alt="UNAP Logo" className="h-8 w-auto" />
            <span className="font-semibold">Secure Upload</span>
          </div>
          <a href="/" className="text-sm hover:text-green-600">Home</a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload Front & Back Images</h1>
          <p className="text-gray-600 mb-6">
            Please upload clear photos of the <strong>front</strong> and <strong>back</strong>. We’ll securely forward them to our team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FRONT */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="front" className="block font-medium mb-2">Front Image</label>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && frontInputRef.current?.click()}
                  onClick={() => frontInputRef.current?.click()}
                  onDrop={(e) => onDrop(e, "front")}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {front ? (
                    <div className="space-y-3">
                      <img
                        src={front.previewUrl}
                        alt="Front preview"
                        className="mx-auto max-h-56 object-contain rounded-lg"
                      />
                      <p className="text-sm text-gray-700 truncate">{front.file.name}</p>
                      <button
                        type="button"
                        className="text-red-600 text-sm underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          URL.revokeObjectURL(front.previewUrl);
                          setFront(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">Click to select or drag & drop</p>
                      <p className="text-sm text-gray-500">JPG, PNG, or WEBP up to 15MB</p>
                    </>
                  )}
                  <input
                    ref={frontInputRef}
                    id="front"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPick("front", e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              {/* BACK */}
              <div>
                <label htmlFor="back" className="block font-medium mb-2">Back Image</label>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && backInputRef.current?.click()}
                  onClick={() => backInputRef.current?.click()}
                  onDrop={(e) => onDrop(e, "back")}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {back ? (
                    <div className="space-y-3">
                      <img
                        src={back.previewUrl}
                        alt="Back preview"
                        className="mx-auto max-h-56 object-contain rounded-lg"
                      />
                      <p className="text-sm text-gray-700 truncate">{back.file.name}</p>
                      <button
                        type="button"
                        className="text-red-600 text-sm underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          URL.revokeObjectURL(back.previewUrl);
                          setBack(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">Click to select or drag & drop</p>
                      <p className="text-sm text-gray-500">JPG, PNG, or WEBP up to 15MB</p>
                    </>
                  )}
                  <input
                    ref={backInputRef}
                    id="back"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPick("back", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label htmlFor="note" className="block font-medium mb-2">Note (optional)</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Add any context for the reviewer…"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-500">
                By uploading, you confirm you have the right to share these images. Do not upload sensitive IDs unless requested.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-black font-semibold px-6 py-3 rounded-lg transition"
              >
                {submitting ? "Sending…" : "Send to Telegram"}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-lg px-4 py-3 ${
                  message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}
                role="status"
              >
                {message.text}
              </div>
            )}
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-black text-white text-center text-sm py-4">
        © {new Date().getFullYear()} UNAP Corporation. All rights reserved.
      </footer>
    </div>
  );
}
