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

    const existingItem = cartItems.find(
      (item) => item.id === product.id
    );

    if (existingItem) {

      const updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setCartItems(updatedCart);

    } else {

      setCartItems([
        ...cartItems,
        { ...product, quantity: 1 }
      ]);

    }
  };

  // Remove From Cart
  const removeFromCart = (id) => {

    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(updatedCart);
  };

  // Increase Quantity
  const increaseQuantity = (id) => {

    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCartItems(updatedCart);
  };

  // Decrease Quantity
  const decreaseQuantity = (id) => {

    const updatedCart = cartItems.map((item) =>
      item.id === id
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};