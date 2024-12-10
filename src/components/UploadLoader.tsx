import React from 'react';
import { motion } from 'framer-motion';

interface UploadLoaderProps {
  stage: 'preparing' | 'uploading' | 'processing' | 'finalizing';
}

const UploadLoader: React.FC<UploadLoaderProps> = ({ stage }) => {
  const stageDescriptions = {
    preparing: 'Getting everything ready...',
    uploading: 'Uploading your masterpiece...',
    processing: 'Adding final touches...',
    finalizing: 'Almost there...'
  };

  const progressVariants = {
    preparing: { width: '25%' },
    uploading: { width: '50%' },
    processing: { width: '75%' },
    finalizing: { width: '100%' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-96 max-w-md"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Loader */}
          <motion.div 
            className="w-24 h-24 relative"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 100 100" 
              className="absolute inset-0 text-black"
            >
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="10"
                strokeDasharray="280"
                strokeDashoffset="280"
                className="opacity-20"
              />
              <motion.circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="10"
                initial={{ strokeDashoffset: 280 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>

          {/* Progress Text */}
          <div className="text-center">
            <motion.h2 
              key={stage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold text-gray-800"
            >
              {stageDescriptions[stage]}
            </motion.h2>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className="bg-black h-2.5 rounded-full"
              initial={{ width: '0%' }}
              animate={progressVariants[stage]}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadLoader;