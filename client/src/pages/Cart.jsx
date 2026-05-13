import { useCart } from "../context/CartContext";

function Cart() {

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (

        <h2 className="text-2xl">
          Cart is Empty
        </h2>

      ) : (

        <div className="space-y-6">

          {cartItems.map((item) => (

            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md"
            >

              <div className="flex items-center gap-6">

                <img
                  src={item.image}
                  alt={item.title}
                  className="h-28 w-28 object-contain"
                />

                <div>

                  <h2 className="text-2xl font-semibold">
                    {item.title}
                  </h2>

                  <p className="text-green-600 text-xl font-bold mt-2">
                    ₹{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">

                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-300 px-4 py-1 rounded"
                    >
                      -
                    </button>

                    <span className="text-lg font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-gray-300 px-4 py-1 rounded"
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
              >
                Remove
              </button>

            </div>
          ))}

          {/* Total */}
          <div className="text-right mt-10">

            <h2 className="text-3xl font-bold">
              Total: ₹{totalPrice}
            </h2>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;