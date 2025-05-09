import React, { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import Title from "./Title";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  console.log("Fetched categories:", categories);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-2 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500">Error loading categories: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      {/* Title Section */}
      <div className="text-center pb-10">
        <Title text1="FEATURED" text2="CATEGORY" />
        <p className="text-sm text-gray-600 max-w-2xl mx-auto mt-3">
          Find the Perfect Fit for Every Room.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          console.log("Rendering category:", category.name, "with image:", category.image);
          return (
            <CategoryCard
              key={category.name}
              name={category.name}
              count={category.count}
              image={category.image}  // This is correct - passing "image" from API as "images" prop
            />
          );
        })}
      </div>

      {categories.length === 0 && (
        <p className="text-center text-gray-500 py-8">No categories found.</p>
      )}
    </section>
  );
};

export default CategorySection;