import { useState } from "react";
import { fetchWithAuth } from "../utils/api";

const Add = () => {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Living Room");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1"); // Added quantity state
  const [isOutOfStock, setIsOutOfStock] = useState(false); // Added isOutOfStock state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle out of stock checkbox change
  const handleOutOfStockChange = (e) => {
    setIsOutOfStock(e.target.checked);
    // If marking as out of stock, set quantity to 0
    if (e.target.checked) {
      setQuantity("0");
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    
    // If quantity is set to 0, automatically mark as out of stock
    if (parseInt(newQuantity) === 0) {
      setIsOutOfStock(true);
    } else if (parseInt(newQuantity) > 0 && isOutOfStock) {
      // If adding quantity and product was marked as out of stock, update status
      setIsOutOfStock(false);
    }
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
      formData.append("price", price); // Add price to form data
      formData.append("quantity", quantity); // Add quantity to form data
      formData.append("isOutOfStock", isOutOfStock); // Add isOutOfStock to form data

      
      const response = await fetchWithAuth("/add", {
        method: "POST",
        body: formData,
      });

      if(response.error){
        throw new Error(response.error|| "Something went wrong")
      }

      //reset form after successful submission
      setFile(null);
      setProductName("");
      setDescription("");
      setCategory("Living Room");
      setPrice("");
      setQuantity("1"); // Reset quantity
      setIsOutOfStock(false); // Reset isOutOfStock

      //reset file input
      const fileInput = document.getElementById("fileInput");
      if (fileInput) {
        fileInput.value = "";
      }

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
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
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
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Dining Room">Dining Room</option>
              <option value="Mirror">Mirror</option>
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

        {/* Quantity & Stock Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Quantity in Stock</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="Enter available quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex items-center justify-start h-full pt-6">
            <input
              type="checkbox"
              id="outOfStock"
              checked={isOutOfStock}
              onChange={handleOutOfStockChange}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
            />
            <label htmlFor="outOfStock" className="ml-3 text-gray-700 font-medium cursor-pointer">
              Mark as Out of Stock
            </label>
          </div>
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