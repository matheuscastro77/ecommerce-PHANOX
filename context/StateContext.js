import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }

        const soredTotalPrice = localStorage.getItem('totalPrice')
        if (soredTotalPrice) {
            setTotalPrice(JSON.parse(soredTotalPrice));
        }

        const soredTotalQuantities = localStorage.getItem('totalQuantities')
        if (soredTotalQuantities) {
            setTotalQuantities(JSON.parse(soredTotalQuantities));
        }
    }, []);

    const onAdd = (product, quantity) => {
        if (!product || !product._id) {
            return;
        }

        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        const updatedTotalPrice = totalPrice + product.price * quantity;
        const updatedTotalQuantities = totalQuantities + quantity;

        setTotalPrice(updatedTotalPrice);
        setTotalQuantities(updatedTotalQuantities);

        localStorage.setItem('totalPrice', JSON.stringify(updatedTotalPrice));
        localStorage.setItem('totalQuantities', JSON.stringify(updatedTotalQuantities));


        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                };
                return cartProduct;
            });

            setCartItems(updatedCartItems);

            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);

            localStorage.setItem('cartItems', JSON.stringify([...cartItems, { ...product }]));
        }

        localStorage.setItem('totalPrice', JSON.stringify(updatedTotalPrice));
        localStorage.setItem('totalQuantities', JSON.stringify(updatedTotalQuantities));


        toast.success(`${quantity} ${product.name} adicionado ao carrinho.`);
    }

    const onRemove = (product) => {
        if (!product || !product._id) {
            console.error("Invalid product id");
            return;
        }

        const foundProduct = cartItems.find((item) => item._id === product._id);
        if (!foundProduct) {
            console.error("Product not found");
            return;
        }

        const quantityToRemove = foundProduct.quantity;

        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        const removedProductTotalPrice = foundProduct.price * quantityToRemove;
        const updatedTotalPrice = totalPrice - removedProductTotalPrice;
        const updatedTotalQuantities = totalQuantities - quantityToRemove;

        setTotalPrice(updatedTotalPrice);
        setTotalQuantities(updatedTotalQuantities);
        setCartItems(newCartItems);

        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        localStorage.setItem('totalPrice', JSON.stringify(updatedTotalPrice));
        localStorage.setItem('totalQuantities', JSON.stringify(updatedTotalQuantities));

        toast.success(`${foundProduct.name} removido do carrinho.`);
    }

    const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);

        let updatedTotalPrice = totalPrice;
        let updatedTotalQuantities = totalQuantities;

        if (value === 'inc') {
            updatedTotalPrice = totalPrice + foundProduct.price;
            updatedTotalQuantities = totalQuantities + 1;

            setTotalPrice(updatedTotalPrice);
            setTotalQuantities(updatedTotalQuantities);

            setCartItems(prevCartItems => {
                const updatedCartItems = prevCartItems.map(item => {
                    if (item._id === id) {
                        return { ...item, quantity: foundProduct.quantity + 1 }
                    }
                    return item;
                });

                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

                return updatedCartItems;
            });

        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                updatedTotalPrice = totalPrice - foundProduct.price;
                updatedTotalQuantities = totalQuantities - 1;

                setTotalPrice(updatedTotalPrice);
                setTotalQuantities(updatedTotalQuantities);

                setCartItems(prevCartItems => {
                    const updatedCartItems = prevCartItems.map(item => {
                        if (item._id === id) {
                            return { ...item, quantity: foundProduct.quantity - 1 }
                        }
                        return item;
                    });

                    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

                    return updatedCartItems;
                });
            }
        }
        localStorage.setItem('totalPrice', JSON.stringify(updatedTotalPrice));
        localStorage.setItem('totalQuantities', JSON.stringify(updatedTotalQuantities));
    }
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }



    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    }

    // const incQty = () => {
    //     const storedQty = localStorage.getItem('qty');
    //     const parsedQty = storedQty ? parseInt(storedQty) : 0;
    //     const updatedQty = parsedQty + 1;

    //     setQty(updatedQty);
    //     localStorage.setItem('qty', updatedQty.toString());
    // }

    // const decQty = () => {
    //     const storedQty = localStorage.getItem('qty');
    //     const parsedQty = storedQty ? parseInt(storedQty) : 0;

    //     const updatedQty = parsedQty > 1 ? parsedQty - 1 : 1;

    //     setQty(updatedQty);
    //     localStorage.setItem('qty', updatedQty.toString());
    // }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuanitity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);

