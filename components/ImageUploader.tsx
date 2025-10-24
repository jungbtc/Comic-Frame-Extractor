
import React, { useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onExtract: () => void;
  isLoading: boolean;
  imagePreviewUrl: string | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l2-2m-2 2l-2-2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12V6" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onExtract, isLoading, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-accent"
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="max-h-96 mx-auto rounded-md object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadIcon />
            <p className="text-gray-400">
              <span className="font-semibold text-accent">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>

      {imagePreviewUrl && (
        <div className="mt-6 text-center">
          <button
            onClick={onExtract}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-primary"
          >
            {isLoading ? <LoadingSpinner /> : null}
            {isLoading ? 'Extracting Frames...' : 'Extract Frames'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
