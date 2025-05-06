import { useState } from "react";
import { fetchWithAuth } from "../utils/api";

const Add = () => {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Indoor");
  const [price, setPrice] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", productName);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("bestseller", isBestSeller);

      
      const response = await fetchWithAuth("/add", {
        method: "POST",
        body: formData,
      });

      if(response.error){
        throw new Error(response.error|| "Something went wrong")
      }

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Product</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write product description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="bestseller"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
          />
          <label htmlFor="bestseller" className="text-gray-700 font-medium cursor-pointer">
            Mark as Bestseller
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          ADD PRODUCT
        </button>
      </form>
    </div>
  );
};

export default Add;
