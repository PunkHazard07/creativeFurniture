import { FaEdit, FaTrash } from "react-icons/fa";

const ProductCard = ({ product, onEdit, onRemove }) => {
    const isOut = product.isOutOfStock || product.quantity === 0;

return (
    <div className="p-4 shadow-md rounded-xl border bg-white flex flex-col justify-between">
      <div>
        <div className="relative w-full pb-2/3 h-48">
          <img
            src={product.images || "https://via.placeholder.com/150"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain rounded-lg"
          />
          {isOut && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
              <span className="bg-red-500 text-white px-3 py-1 rounded-md transform rotate-45 text-sm font-bold">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="text-lg font-semibold mt-2">₦{product.price}</p>

          <div className="mt-2 text-sm">
            {product.isOutOfStock ? (
              <span className="text-red-500 font-medium">Out of Stock</span>
            ) : (
              <span className="text-green-600 font-medium">
                In Stock: {product.quantity}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-4 pt-0 mt-2">
        <button
          className="flex-1 min-w-24 px-3 py-2 bg-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition"
          onClick={() => onEdit(product)}
        >
          <FaEdit size={16} /> Edit
        </button>
        <button
          className="flex-1 min-w-24 px-3 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition"
          onClick={() => onRemove(product._id)}
        >
          <FaTrash size={16} /> Remove
        </button>
      </div>
    </div>
  );
};

export default ProductCard;