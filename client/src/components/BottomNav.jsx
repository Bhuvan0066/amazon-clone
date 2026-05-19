import { Link, useLocation } from "react-router-dom";
import { Home, User, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "../context/CartContext";

const BottomNav = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/profile", icon: User, label: "You" },
    { path: "/cart", icon: ShoppingCart, label: "Cart", badge: totalItems },
    { path: "/menu", icon: Menu, label: "Menu" }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center h-16 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full relative ${isActive ? 'text-[#007185]' : 'text-gray-600'}`}
          >
            {isActive && <div className="absolute top-0 w-8 h-[3px] bg-[#007185] rounded-b-full"></div>}
            
            <div className="relative mt-1">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-[6px] py-[2px] rounded-full min-w-[20px] text-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
