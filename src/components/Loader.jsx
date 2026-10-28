import React from 'react';

// Single skeleton card replicating a product layout
const SkeletonCard = () => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 max-w-sm w-full mx-auto shadow-sm bg-white">
      <div className="animate-pulse flex flex-col space-y-4">
        {/* Product Image Placeholder */}
        <div className="rounded-lg bg-gray-200 h-48 w-full"></div>
        
        <div className="flex-1 space-y-3 py-1">
          {/* Brand/Category Placeholder */}
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          
          {/* Title Placeholder */}
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          
          {/* Rating Placeholder */}
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          
          {/* Price & Button Row */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Grid wrapper to render multiple placeholder cards
const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title/Header Placeholder */}
      <div className="animate-pulse h-8 bg-gray-200 rounded w-48 mb-8"></div>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductSkeleton;
