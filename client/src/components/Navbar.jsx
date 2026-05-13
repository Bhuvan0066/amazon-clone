import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const { cartItems } = useCart();

  const { user, logout } = useAuth();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="bg-[#131921] text-white flex items-center justify-between px-6 py-4">

      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-bold">
          G.C. Store
        </h1>
      </Link>

      {/* Search */}
      <div className="flex flex-1 mx-10">

        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 text-black bg-white outline-none rounded-l-md"
        />

        <button className="bg-yellow-400 px-6 rounded-r-md text-black font-semibold">
          Search
        </button>

      </div>

      {/* Right Side */}
      <div className="flex gap-8 items-center">

        {/* User */}
        {user ? (

          <div>

            <p>
              Hello, {user.name}
            </p>

            <button
              onClick={logout}
              className="font-bold"
            >
              Logout
            </button>

          </div>

        ) : (

          <Link to="/login">

            <div>

              <p>Hello, Sign in</p>

              <h2 className="font-bold">
                Account
              </h2>

            </div>

          </Link>

        )}

        {/* Orders */}
        <Link to="/cart">

          <div>

            <p>Returns</p>

            <h2 className="font-bold">
              & Orders
            </h2>

          </div>

        </Link>

        {/* Cart */}
        <Link to="/cart">

          <div className="text-xl font-bold flex items-center gap-2">

            🛒 Cart

            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-sm">

              {totalItems}

            </span>

          </div>

        </Link>

      </div>

    </div>
  );
}

export default Navbar;