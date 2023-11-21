/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import { urlForImage } from "../sanity/lib/image";
import getStripe from "../sanity/lib/getStripe";

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuanitity,
    onRemove,
  } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();

    toast.loading("Redirecting...");

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  const closeModal = () => {
    setShowCart(false);
    document.head.querySelector("style")?.remove();
  };
  return (
    <div className="cart-container-main">
      <div className="cart-wrapper" ref={cartRef}>
        <div className="cart-container">
          <button
            type="button"
            className="cart-heading"
            onClick={() => closeModal()}
          >
            <AiOutlineLeft />
            <span className="heading">Seu carrinho</span>
            <span className="cart-num-items">({totalQuantities} itens)</span>
          </button>

          {cartItems.length < 1 && (
            <div className="empty-cart">
              <AiOutlineShopping size={150} />
              <h3>Seu carrinho está vazio</h3>
              <Link href="/">
                <button
                  type="button"
                  onClick={() => closeModal()}
                  className="btn"
                >
                  Continuar comprando
                </button>
              </Link>
            </div>
          )}

          <div className="product-container">
            {cartItems.length >= 1 &&
              cartItems.map((item) => {
                return (
                  <div className="product" key={item._id}>
                    <img
                      src={urlForImage(item?.image[0])}
                      className="cart-product-image"
                      alt="product"
                    />
                    <div className="item-desc">
                      <div className="flex top">
                        <h5> {item.name}</h5>
                        <h4>
                          R${" "}
                          {item.price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </h4>
                      </div>
                      <div className="flex bottom">
                        <div>
                          <p className="quantity-desc">
                            <span
                              className="minus"
                              onClick={() =>
                                toggleCartItemQuanitity(item._id, "dec")
                              }
                            >
                              <AiOutlineMinus />
                            </span>
                            <span className="num">{item.quantity}</span>
                            <span
                              className="plus"
                              onClick={() =>
                                toggleCartItemQuanitity(item._id, "inc")
                              }
                            >
                              <AiOutlinePlus />
                            </span>
                          </p>
                        </div>
                        <button
                          type="button"
                          className="remove-item"
                          onClick={() => onRemove(item)}
                        >
                          <TiDeleteOutline />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {cartItems.length >= 1 && (
            <div className="cart-bottom">
              <div className="total">
                <h3>Total:</h3>
                <h3>
                  R${" "}
                  {totalPrice.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <div className="btn-container">
                <button type="button" className="btn2" onClick={handleCheckout}>
                  Pagar com Stripe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
