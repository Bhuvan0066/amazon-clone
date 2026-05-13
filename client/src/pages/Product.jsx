import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { useCart } from "../context/CartContext";

function Product() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const { addToCart } = useCart();

  // Fetch Single Product
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await axios.get(
          `http://localhost:5000/api/products`
        );

        const foundProduct = response.data.find(
          (item) => item._id === id
        );

        setProduct(foundProduct);

      } catch (error) {

        console.log(error);

      }
    };

    fetchProduct();

  }, [id]);

  if (!product) {

    return (
      <h1 className="text-3xl p-10">
        Loading...
      </h1>
    );
  }

  return (
    <div className="p-10">

      <div className="grid md:grid-cols-2 gap-10 bg-white p-10 rounded-lg shadow-lg">

        {/* Image */}
        <div>

          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[400px] object-contain"
          />

        </div>

        {/* Details */}
        <div>

          <h1 className="text-4xl font-bold">
            {product.title}
          </h1>

          <p className="text-3xl text-green-600 font-bold mt-6">
            ₹{product.price}
          </p>

          <p className="mt-6 text-gray-600 text-lg">
            Premium quality product with best pricing and fast delivery.
          </p>

          <button
            onClick={() => addToCart(product)}
            className="bg-yellow-400 px-8 py-3 rounded-md mt-8 text-lg font-semibold hover:bg-yellow-500"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default Product;