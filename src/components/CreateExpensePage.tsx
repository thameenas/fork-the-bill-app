'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ReceiptUpload from './ReceiptUpload';

const CreateExpensePage: React.FC = () => {
  const router = useRouter();

  const handleExpenseCreated = async (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Fork The Bill
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Upload a receipt, share the link, and everyone claims their order!
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto z-10">
        <ReceiptUpload onExpenseCreated={handleExpenseCreated} />

        {/* Educational Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center px-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 whitespace-nowrap">1. Snap Receipt</h3>
            <p className="text-sm text-gray-500">Upload a photo of your bill.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 whitespace-nowrap">2. Share URL</h3>
            <p className="text-sm text-gray-500">Share the bill link with your friends.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 whitespace-nowrap">3. Claim Items</h3>
            <p className="text-sm text-gray-500">Each person selects what they had.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 whitespace-nowrap">4. View Total</h3>
            <p className="text-sm text-gray-500">View the final amount each person owes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExpensePage;
