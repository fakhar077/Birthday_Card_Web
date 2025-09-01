
import React, { useState, useRef } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { generateBirthdayCard } from '../services/geminiService';
import { Loader } from './Loader';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { RefreshIcon } from './icons/RefreshIcon';

export const CardGenerator: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          setError("File size exceeds 4MB. Please choose a smaller image.");
          return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    if (!imageFile || !name.trim()) {
      setError('Please provide a name and an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCardUrl(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const generatedUrl = await generateBirthdayCard(base64Image, imageFile.type, name);
      setGeneratedCardUrl(generatedUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedCardUrl) return;
    const link = document.createElement('a');
    link.href = generatedCardUrl;
    link.download = `birthday-card-${name.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="w-full max-w-2xl p-6 md:p-8 bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-lg">
        <div className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name for the card"
            className="w-full px-4 py-3 bg-white/10 dark:bg-black/20 rounded-lg border border-white/20 dark:border-gray-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          
          <button
            onClick={triggerFileSelect}
            className="w-full flex items-center justify-center gap-3 px-4 py-8 bg-white/10 dark:bg-black/20 rounded-lg border-2 border-dashed border-white/30 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400"
          >
            <UploadIcon />
            <span>{imageFile ? `Selected: ${imageFile.name}` : 'Upload a personal photo'}</span>
          </button>
          
          {imagePreview && (
            <div className="mt-4 text-center">
              <p className="text-sm font-medium mb-2">Image Preview:</p>
              <img src={imagePreview} alt="Preview" className="mx-auto max-h-40 rounded-lg shadow-md" />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || !imageFile || !name}
            className="w-full py-3 font-bold text-lg text-white bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 shadow-lg hover:shadow-neon-cyan"
          >
            {isLoading ? 'Generating Your Card...' : '✨ Generate Card'}
          </button>

          {error && <p className="text-red-400 text-center font-medium">{error}</p>}
        </div>
      </div>

      {isLoading && <Loader />}

      {generatedCardUrl && (
        <div className="w-full max-w-2xl animate-fade-in">
           <div className="p-4 bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-lg">
                <img src={generatedCardUrl} alt="Generated birthday card" className="w-full rounded-lg" />
           </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button
                onClick={handleDownload}
                className="flex-1 py-3 px-6 font-semibold text-white bg-green-500/80 hover:bg-green-500 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-md"
            >
                <DownloadIcon />
                Download
            </button>
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex-1 py-3 px-6 font-semibold text-white bg-purple-500/80 hover:bg-purple-500 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-md"
            >
                <RefreshIcon />
                Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
