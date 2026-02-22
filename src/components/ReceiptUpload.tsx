'use client';

import React, { useState, useRef } from 'react';
import { createExpenseFromImage } from '../api/client';
import { compressImage, validateImageFile } from '../utils/imageCompression';

interface ReceiptUploadProps {
  onExpenseCreated: (slug: string) => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onExpenseCreated }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!selectedFile || !payerName.trim()) return;

    setIsUploading(true);
    setError(null);

    try {
      const targetSizeKB = selectedFile.size > 3 * 1024 * 1024 ? 1024 : 2048;
      const compressedFile = await compressImage(selectedFile, {
        maxWidth: selectedFile.size > 5 * 1024 * 1024 ? 1280 : 1920,
        maxHeight: selectedFile.size > 5 * 1024 * 1024 ? 1280 : 1920,
        quality: selectedFile.size > 3 * 1024 * 1024 ? 0.6 : 0.8,
        maxSizeKB: targetSizeKB,
      });

      const newExpense = await createExpenseFromImage(compressedFile, payerName.trim());
      onExpenseCreated(newExpense.slug || newExpense.id);
    } catch (error) {
      console.error('Failed to create expense:', error);
      if (error instanceof Error) {
        if (error.message.includes('413') || error.message.toLowerCase().includes('too large')) {
          setError('Image is still too large after compression. Please try a smaller image or take a new photo with lower resolution.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to process receipt. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 sm:p-10">
      <div className="space-y-8">
        <div>
          <label htmlFor="payerName" className="block text-sm font-semibold text-gray-700 mb-2">
            Who paid the bill?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="payerName"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400"
              placeholder="e.g. John Doe"
              required
              disabled={isUploading}
            />
          </div>
          {!payerName.trim() && (
            <p className="text-xs text-orange-500 mt-2 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Please enter your name to continue
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label htmlFor="receipt" className="block text-sm font-semibold text-gray-700">
              Upload Receipt
            </label>
            <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
          </div>

          {/* Hidden file input controlled by ref */}
          <input
            type="file"
            id="receipt"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={!payerName.trim() || isUploading}
          />

          {!selectedFile ? (
            <div
              onClick={() => { if (payerName.trim() && !isUploading) triggerFileSelect(); }}
              className={`relative group border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${!payerName.trim() || isUploading
                ? 'border-gray-200 bg-gray-50 opacity-60'
                : 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-400 cursor-pointer'
                }`}>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`p-4 rounded-full ${!payerName.trim() ? 'bg-gray-100' : 'bg-white shadow-sm group-hover:shadow group-hover:scale-105 transition-all'}`}>
                  <svg className={`h-8 w-8 ${!payerName.trim() ? 'text-gray-400' : 'text-indigo-500'}`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-700">
                    Click to browse from your device
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!payerName.trim() || isUploading}
                  className={`mt-2 px-6 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors ${!payerName.trim() || isUploading
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  Select File
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-indigo-100 rounded-xl p-6 bg-indigo-50/20">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative mb-4">
                    <div className="animate-spin outline-none rounded-full h-14 w-14 border-4 border-indigo-100 border-t-indigo-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-indigo-700">Processing receipt...</p>
                    <p className="text-sm text-indigo-500 font-medium mt-1">Reading items and prices</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="flex-shrink-0 p-2 bg-indigo-50 text-indigo-600 rounded-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="truncate text-sm font-medium text-gray-700">
                        {selectedFile.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileSelect}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold whitespace-nowrap px-2"
                    >
                      Change
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Submit Receipt</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUpload;
