import React, { useState, useCallback } from 'react';
import { BoundingBox } from './types';
import { segmentFrames } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import FrameDisplay from './components/FrameDisplay';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    setOriginalImageUrl(URL.createObjectURL(file));
    setExtractedFrames([]);
    setError(null);
  }, [originalImageUrl]);

  const cropImageWithBoundingBoxes = useCallback(async (imageUrl: string, boxes: BoundingBox[]): Promise<string[]> => {
    const image = new Image();
    image.src = imageUrl;

    return new Promise((resolve) => {
      image.onload = () => {
        const croppedImages = boxes.map(box => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return '';

          // Calculate pixel values from percentages
          const sx = box.x * image.width;
          const sy = box.y * image.height;
          const sWidth = box.width * image.width;
          const sHeight = box.height * image.height;

          canvas.width = sWidth;
          canvas.height = sHeight;

          // Draw the cropped portion of the image onto the canvas
          ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

          return canvas.toDataURL('image/png');
        });
        resolve(croppedImages.filter(img => img !== ''));
      };
      image.onerror = () => {
        setError('Failed to load image for cropping.');
        resolve([]);
      };
    });
  }, []);

  const handleExtractFrames = useCallback(async () => {
    if (!originalImage || !originalImageUrl) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedFrames([]);

    try {
      const boundingBoxes = await segmentFrames(originalImageUrl);
      
      if (boundingBoxes.length === 0) {
        setError("No frames were detected. This method works best with comics that have clear, bright gutters between panels.");
        setIsLoading(false);
        return;
      }

      const frames = await cropImageWithBoundingBoxes(originalImageUrl, boundingBoxes);
      setExtractedFrames(frames);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during frame segmentation.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, originalImageUrl, cropImageWithBoundingBoxes]);

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main>
        <ImageUploader 
          onImageUpload={handleImageUpload}
          onExtract={handleExtractFrames}
          isLoading={isLoading}
          imagePreviewUrl={originalImageUrl}
        />
        {error && (
          <div className="max-w-4xl mx-auto p-4 my-4 bg-red-900 text-red-200 border border-red-700 rounded-lg text-center">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        <FrameDisplay frames={extractedFrames} />
      </main>
      <footer className="text-center p-4 mt-8 border-t border-gray-700">
        <p className="text-sm text-gray-500">Powered by Jung the greatest</p>
        <p className="text-xs text-gray-600 mt-2">
          For developers: A Python script for local processing is also available. See <code>extract_frames.py</code>.
        </p>
      </footer>
    </div>
  );
};

export default App;