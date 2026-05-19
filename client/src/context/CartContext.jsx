import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart in localStorage
  useEffect(() => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add To Cart
  const addToCart = (product) => {
    const productId = product._id || product.id;
    const existingItem = cartItems.find(
      (item) => (item._id || item.id) === productId
    );

    if (existingItem) {
      const updatedCart = cartItems.map((item) =>
        (item._id || item.id) === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([
        ...cartItems,
        { ...product, quantity: 1, _id: productId }
      ]);
    }
  };

  // Remove From Cart
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(
      (item) => (item._id || item.id) !== id
    );
    setCartItems(updatedCart);
  };

  // Increase Quantity
  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      (item._id || item.id) === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart);
  };

  // Decrease Quantity
  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      (item._id || item.id) === id
        ? {
            ...item,
            quantity:
              item.quantity > 1
                ? item.quantity - 1
                : 1,
          }
        : item
    );
    setCartItems(updatedCart);
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};