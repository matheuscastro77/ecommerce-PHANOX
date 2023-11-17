import Link from "next/link";
import React from "react";
import { AiOutlineShopping } from "react-icons/ai";
import Cart from "./Cart";
import { useStateContext } from "../context/StateContext";

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  const openModal = () => {
    setShowCart(true);
    var node = document.createElement("style");
    node.setAttribute("type", "text/css");
    node.textContent =
      "html, body { height: auto ! important ; overflow: hidden ! important ; }";
    document.head.prepend(node);
  };

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href={"/"} style={{ fontWeight: 700 }}>
          Time Tunes
        </Link>
      </p>

      <button className="cart-icon" type="button" onClick={() => openModal()}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
