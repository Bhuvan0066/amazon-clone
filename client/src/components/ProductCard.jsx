import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {

  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300 bg-white">

      {/* Clickable Product */}
      <Link to={`/product/${product._id}`}>

        <img
          src={product.image}
          alt={product.title}
          className="h-52 w-full object-contain"
        />

        <h2 className="mt-4 text-lg font-semibold">
          {product.title}
        </h2>

        <p className="text-green-600 font-bold text-xl mt-2">
          ₹{product.price}
        </p>

      </Link>

      {/* Add To Cart Button */}
      <button
        onClick={() => addToCart(product)}
        className="bg-yellow-400 w-full py-2 mt-4 rounded-md font-semibold hover:bg-yellow-500"
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;