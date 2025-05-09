import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ name, count, image }) => {
  return (
    <Link 
      to={`/category/${encodeURIComponent(name)}`}
      className="group relative block overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400">{name}</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold drop-shadow-md">{name}</h3>
        <p className="mt-1 text-sm font-medium text-white/90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-2 sm:opacity-0">
          {count} {count === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Hover Button Effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-90 rounded-full bg-white/20 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
        <span className="block h-10 w-10 rounded-full bg-white p-2 text-center text-sm font-medium text-gray-800 shadow-sm">
          View
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;