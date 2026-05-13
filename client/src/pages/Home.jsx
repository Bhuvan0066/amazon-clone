import { useEffect, useState } from "react";
import axios from "axios";

import ProductCard from "../components/ProductCard";

function Home() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch Products
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(response.data);

      } catch (error) {

        console.log(error);

      }
    };

    fetchProducts();

  }, []);

  // Filter Products
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  return (
    <div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-200 to-yellow-100 h-[300px] flex flex-col items-center justify-center">

        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          Welcome to G.C. Store
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-6 py-3 w-[350px] rounded-md border outline-none"
        />

      </div>

      {/* Products */}
      <div className="p-10">

        <h2 className="text-3xl font-bold mb-8">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {filteredProducts.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
            />

          ))}

        </div>

      </div>

    </div>
  );
}

export default Home;