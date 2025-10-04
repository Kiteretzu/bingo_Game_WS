// src/components/globals/profile/BackgroundUploader.tsx
import React, { useRef, useState } from "react";
import { Upload, X, Check } from "lucide-react";



interface BackgroundUploaderProps {
  onApply: (imageUrl: string) => void;
  onCancel: () => void;
}

export default function BackgroundUploader({
  onApply,
  onCancel,
}: BackgroundUploaderProps) {
  const [previewImage, setPreviewImage] = useState("");

  const applyBackground = () => {
    if (previewImage) {
      onApply(previewImage);
      setPreviewImage("");
    }
  };

  const cancelPreview = () => {
    setPreviewImage("");
    onCancel();
  };

  return (
    <div className="mb-6">


      {/* Preview */}
      {previewImage && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Preview</h4>
          <div className="relative rounded-lg overflow-hidden h-48">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={applyBackground}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelPreview}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
