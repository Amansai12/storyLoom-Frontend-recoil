import React from 'react';
import { Card } from './ui/card';

const BlogPostSkeleton: React.FC = () => {
  return (
    <Card className="w-full animate-pulse p-4 mb-4">
      <div className="flex flex-col space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="flex items-center space-x-4 mt-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </Card>
  );
};

export default BlogPostSkeleton;