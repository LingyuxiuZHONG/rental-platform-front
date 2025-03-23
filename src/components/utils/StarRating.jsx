import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, maxStars = 5, size = 'md', showRatingText = true, className = '' }) => {
  // 根据size属性确定星星大小
  const getStarSize = () => {
    const sizes = {
      'sm': 'w-3 h-3',
      'md': 'w-4 h-4',
      'lg': 'w-5 h-5',
      'xl': 'w-6 h-6'
    };
    return sizes[size] || sizes.md;
  };

  const starSize = getStarSize();

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => {
          const ratingValue = index + 1;
          const isFullStar = rating >= ratingValue;
          const isHalfStar = rating >= ratingValue - 0.5 && rating < ratingValue;
          
          return (
            <span key={index} className="relative inline-block mr-1">
              {/* 空星（基础） */}
              <Star 
                className={`${starSize} text-gray-300`} 
                fill="none" 
              />
              
              {/* 覆盖层（全星或半星） */}
              {(isFullStar || isHalfStar) && (
                <span 
                  className="absolute inset-0 overflow-hidden" 
                  style={{ width: isHalfStar ? '50%' : '100%' }}
                >
                  <Star 
                    className={`${starSize} text-yellow-500`} 
                    fill="currentColor" 
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      
      {showRatingText && (
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      )}
    </div>
  );
};

export default StarRating;